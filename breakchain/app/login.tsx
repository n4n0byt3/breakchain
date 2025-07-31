// app/login.tsx
import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Provider as PaperProvider,
  MD3DarkTheme,
} from 'react-native-paper';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleAuth = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert('Please fill in both fields');
      return;
    }

    if (!emailRegex.test(trimmedEmail)) {
      Alert.alert('Invalid email format');
      return;
    }

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        Alert.alert('Login successful');
      } else {
        await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        Alert.alert('Registration successful');
      }
      router.replace('/');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
  };

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Title style={styles.title}>BreakChain</Title>

        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          theme={{
            colors: {
              text: '#ffffff',
              placeholder: '#cccccc',
              primary: '#00BFA6',
              background: '#1E1E1E',
            },
          }}
        />

        <TextInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry
          style={styles.input}
          theme={{
            colors: {
              text: '#ffffff',
              placeholder: '#cccccc',
              primary: '#00BFA6',
              background: '#1E1E1E',
            },
          }}
        />

        <Button
          mode="contained"
          onPress={handleAuth}
          style={styles.button}
          textColor="#ffffff"
        >
          {mode === 'login' ? 'Login' : 'Register'}
        </Button>

        <View style={styles.linkContainer}>
          {mode === 'login' ? (
            <>
              <Button mode="text" textColor="#ffffff" onPress={() => setMode('register')}>
                Don't have an account? Register
              </Button>
              <Button mode="text" textColor="#ffffff" onPress={() => router.push('/forgot-password')}>
                Forgot Password?
              </Button>
            </>
          ) : (
            <Button mode="text" textColor="#ffffff" onPress={() => setMode('login')}>
              Already have an account? Login
            </Button>
          )}
        </View>
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
  linkContainer: {
    marginTop: 24,
    alignItems: 'center',
  },
});
