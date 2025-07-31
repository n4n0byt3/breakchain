import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Image } from 'react-native';
import { Text, Title, ActivityIndicator, Card, Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function FeedScreen() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Not logged in');

        const q = query(
          collection(db, 'proofs'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );

        const snapshot = await getDocs(q);
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProofs(items);
      } catch (err) {
        console.error('Error fetching proofs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProofs();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Cover source={{ uri: item.imageUrl }} />
      <Card.Content>
        <Title style={styles.text}>{item.description}</Title>
        <Text style={styles.text}>{new Date(item.timestamp?.seconds * 1000).toLocaleString()}</Text>
      </Card.Content>
    </Card>
  );

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <View style={styles.container}>
        <Title style={styles.heading}>📆 Your Proof Feed</Title>
        {loading ? (
          <ActivityIndicator size="large" color="#00BFA6" />
        ) : (
          <FlatList
            data={proofs}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  heading: {
    color: '#ffffff',
    fontSize: 22,
    marginBottom: 16,
    textAlign: 'center',
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  text: {
    color: '#ffffff',
    marginTop: 8,
  },
});
