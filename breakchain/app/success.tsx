import React from 'react';
import { View, Image, StyleSheet, ScrollView } from 'react-native';
import { Button, Text, Title, Provider as PaperProvider, MD3DarkTheme } from 'react-native-paper';
import { useLocalSearchParams, router } from 'expo-router';

export default function SuccessScreen() {
  const { imageUrl, description } = useLocalSearchParams<{
    imageUrl?: string;
    description?: string;
  }>();

  const decodedImageUrl = decodeURIComponent(imageUrl || '');
  const decodedDescription = decodeURIComponent(description || '');

  return (
    <PaperProvider theme={MD3DarkTheme}>
      <ScrollView contentContainerStyle={styles.container}>
        <Title style={styles.title}>✅ Proof Submitted!</Title>

        {decodedImageUrl ? (
          <Image source={{ uri: decodedImageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.fallbackText}>No image available</Text>
        )}

        {decodedDescription ? (
          <Text style={styles.description}>{decodedDescription}</Text>
        ) : (
          <Text style={styles.fallbackText}>No description provided</Text>
        )}

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => router.replace('/')}
        >
          Go Home
        </Button>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#121212',
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    borderRadius: 8,
    marginBottom: 20,
  },
  description: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  fallbackText: {
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#00BFA6',
    marginTop: 10,
  },
});
