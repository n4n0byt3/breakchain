import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Title,
  Provider as PaperProvider,
  MD3DarkTheme,
  Button,
} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import uuid from 'react-native-uuid';
import { auth, db, storage } from '../firebase';
import { router } from 'expo-router';

export default function SubmitProofScreen() {
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

const handleSubmit = async () => {
  if (!description || !imageUri) {
    Alert.alert('Missing Info', 'Please enter a description and upload an image.');
    return;
  }

  try {
    setUploading(true);

    const user = auth.currentUser;
    if (!user) throw new Error('User not logged in');

    // Convert to blob
    const response = await fetch(imageUri);
    const blob = await response.blob();

    // Upload to storage
    const imageName = `${user.uid}_${uuid.v4()}.jpg`;
    const imageRef = ref(storage, `proofs/${imageName}`);
    await uploadBytes(imageRef, blob);

    // Get download URL
    const downloadUrl = await getDownloadURL(imageRef);

    // Write to Firestore
    const docData = {
      userId: user.uid,
      description,
      imageUrl: downloadUrl,
      timestamp: serverTimestamp(),
    };

    await addDoc(collection(db, 'proofs'), docData);

    // Clear state
    setDescription('');
    setImageUri(null);

    // Navigate to /success
    const encodedDescription = encodeURIComponent(description);
    const encodedImageUrl = encodeURIComponent(downloadUrl);

    router.push(`/success?imageUrl=${encodedImageUrl}&description=${encodedDescription}`);
  } catch (err: any) {
  } finally {
    setUploading(false);
  }
};


  return (
    <PaperProvider theme={MD3DarkTheme}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Title style={styles.title}>Submit Today's Proof</Title>

            <TextInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              mode="outlined"
              multiline
              numberOfLines={3}
              style={styles.input}
              placeholder="Describe what you did today..."
              theme={{
                colors: {
                  text: '#ffffff',
                  placeholder: '#aaaaaa',
                  primary: '#00BFA6',
                  background: '#1E1E1E',
                  surface: '#1E1E1E',
                },
              }}
            />

            <Button
              mode="outlined"
              onPress={handlePickImage}
              style={styles.button}
              textColor="#00BFA6"
              disabled={uploading}
            >
              {imageUri ? 'Change Image' : 'Upload Image'}
            </Button>

            {imageUri && <Image source={{ uri: imageUri }} style={styles.preview} />}

            {uploading ? (
              <>
                <ActivityIndicator size="large" color="#00BFA6" style={{ marginTop: 20 }} />
                <Text style={styles.uploadingText}>Uploading... Please wait</Text>
              </>
            ) : (
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
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
  input: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
  },
  button: {
    marginVertical: 10,
    borderColor: '#00BFA6',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  uploadingText: {
    marginTop: 10,
    color: '#ffffff',
    alignSelf: 'center',
  },
  submitButton: {
    backgroundColor: '#00BFA6',
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
