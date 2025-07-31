import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Snackbar,
  Text,
} from 'react-native-paper';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState({ visible: false, message: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email.includes('@')) {
      Alert.alert('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setSnackbar({ visible: true, message: 'Reset email sent!' });
      setEmail('');
    } catch (error) {
      setSnackbar({
        visible: true,
        message: error instanceof Error ? error.message : 'Something went wrong.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View>
        <Title style={styles.title}>Reset Password</Title>

        <TextInput
          label="Email Address"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
          placeholder="you@example.com"
        />

        <Button
          mode="contained"
          onPress={handleReset}
          disabled={loading || !email}
          loading={loading}
          style={styles.button}
        >
          Send Reset Link
        </Button>

        <Button
          mode="text"
          onPress={() => router.back()}
          style={{ marginTop: 10 }}
        >
          Back to Login
        </Button>

        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ visible: false, message: '' })}
          duration={3000}
          style={{ backgroundColor: '#333' }}
        >
          {snackbar.message}
        </Snackbar>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    color: '#00BFA6',
    fontSize: 24,
    marginBottom: 24,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#00BFA6',
    marginTop: 8,
  },
});
