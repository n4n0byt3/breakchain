import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Title, Text, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';

export default function HomeScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/login');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Welcome to BreakChain 👊</Title>
      <Text style={styles.email}>Logged in as: {user?.email || 'Unknown'}</Text>

      <Button
        mode="contained"
        onPress={() => router.push('/create-group')}
        style={styles.button}
      >
        Create / Join Group
      </Button>

      <Button
        mode="contained"
        onPress={() => router.push('/submit-proof')}
        style={styles.button}
      >
        Submit Today's Proof
      </Button>

      <Button
        mode="contained"
        onPress={() => router.push('/view-history')}
        style={styles.button}
      >
        View My Proofs
      </Button>

      <Button
        mode="outlined"
        onPress={handleLogout}
        style={styles.logout}
        textColor="#f77"
      >
        Log Out
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 24,
    alignSelf: 'center',
  },
  email: {
    color: '#ccc',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    marginVertical: 10,
    backgroundColor: '#00BFA6',
  },
  logout: {
    marginTop: 30,
    borderColor: '#f77',
    borderWidth: 1,
  },
});
