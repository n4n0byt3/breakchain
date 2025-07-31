import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, TextInput, Text, Title, RadioButton, Switch } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function CreateGroupScreen() {
  const router = useRouter();

  const [groupType, setGroupType] = useState<'duo' | 'squad'>('duo');
  const [groupCode, setGroupCode] = useState('');
  const [stakeMode, setStakeMode] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');

  const generateCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroupCode(code);
  };

  const handleCreateOrJoin = () => {
    // TODO: Push to Firestore and validate group logic
    router.push('/'); // Replace with next screen later
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Create or Join a Group</Title>

      <Text style={styles.label}>Group Type</Text>
      <RadioButton.Group
        onValueChange={(value) => setGroupType(value as 'duo' | 'squad')}
        value={groupType}
      >
        <View style={styles.radioItem}>
          <RadioButton value="duo" color="#00BFA6" />
          <Text style={styles.radioLabel}>Duo</Text>
        </View>
        <View style={styles.radioItem}>
          <RadioButton value="squad" color="#00BFA6" />
          <Text style={styles.radioLabel}>Squad</Text>
        </View>
      </RadioButton.Group>

      <TextInput
        label="Group Code"
        value={groupCode}
        onChangeText={setGroupCode}
        mode="outlined"
        style={styles.input}
        placeholder="Enter or generate"
      />
      <Button mode="text" onPress={generateCode}>
        Generate Code
      </Button>

      <View style={styles.switchRow}>
        <Text style={styles.label}>Stake Mode</Text>
        <Switch value={stakeMode} onValueChange={setStakeMode} color="#00BFA6" />
      </View>

      {stakeMode && (
        <TextInput
          label="Stake Amount (£)"
          value={stakeAmount}
          onChangeText={setStakeAmount}
          mode="outlined"
          keyboardType="decimal-pad"
          style={styles.input}
        />
      )}

      <Button mode="contained" onPress={handleCreateOrJoin} style={styles.button}>
        Confirm Group
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
    marginBottom: 20,
    alignSelf: 'center',
  },
  input: {
    backgroundColor: '#1E1E1E',
    marginBottom: 16,
  },
  label: {
    color: '#ccc',
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    color: '#fff',
  },
  button: {
    marginTop: 24,
    backgroundColor: '#00BFA6',
  },
});
