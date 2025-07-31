import React, { useState } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView } from 'react-native';
import { TextInput, Button, Title, Text, useTheme, Provider as PaperProvider } from 'react-native-paper';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const theme = useTheme();
  const router = useRouter();

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Registration successful!');
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Registration Error', error.message || 'Something went wrong');
    }
  };

  return (
    <PaperProvider>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <Title style={styles.title}>Register</Title>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <Button mode="contained" onPress={handleRegister} style={styles.button}>
          Register
        </Button>

        <Button
          mode="text"
          onPress={() => router.replace('/login')}
          style={styles.switchButton}
        >
          Already have an account? Log in
        </Button>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 30,
    marginBottom: 30,
    alignSelf: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  button: {
    backgroundColor: '#00BFA6',
    marginTop: 12,
  },
  switchButton: {
    marginTop: 16,
  },
});
