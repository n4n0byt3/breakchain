import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Title } from 'react-native-paper';

export default function ViewHistoryScreen() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const q = query(
          collection(db, 'proofs'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        const results = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProofs(results);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProofs();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>📜 Your Submissions</Title>
      {loading ? (
        <ActivityIndicator size="large" color="#00BFA6" />
      ) : proofs.length === 0 ? (
        <Text style={styles.empty}>No submissions yet.</Text>
      ) : (
        proofs.map(proof => (
          <View key={proof.id} style={styles.card}>
            <Image source={{ uri: proof.imageUrl }} style={styles.image} />
            <Text style={styles.description}>{proof.description}</Text>
            <Text style={styles.timestamp}>
              {proof.timestamp?.toDate?.().toLocaleString() || 'Unknown time'}
            </Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#121212',
    padding: 16,
    flexGrow: 1,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  empty: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: 50,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 8,
  },
  description: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  timestamp: {
    color: '#888',
    marginTop: 6,
    fontSize: 12,
  },
});
