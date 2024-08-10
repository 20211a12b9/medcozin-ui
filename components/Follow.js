import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import medicozinConfig from '../medicozin.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Follow = () => {
  const [studentId, setStudentId] = useState(''); // ID of the user to be followed
  const [followerId, setFollowerId] = useState(''); // ur id
  const [status, setStatus] = useState(''); // Status message

  const createFollower = async () => {
    try {
        const storedUser = await AsyncStorage.getItem('id');
      const response = await fetch(`${medicozinConfig.API_HOST}/ceateFollowers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          follower: { studentId: storedUser },
        }),
      });

      if (response.ok) {
        setStatus('Follower created successfully');
      } else {
        setStatus('Error creating follower');
      }
    } catch (error) {
      setStatus('Error creating follower');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Follow User</Text>
      <TextInput
        style={styles.input}
        placeholder="Student ID (Profile to Follow)"
        keyboardType="numeric"
        value={studentId}
        onChangeText={(text) => setStudentId(text)}
      />
      {/* <TextInput
        style={styles.input}
        placeholder="Your ID"
        keyboardType="numeric"
        value={followerId}
        onChangeText={(text) => setFollowerId(text)}
      /> */}
      <Button title="Follow" onPress={createFollower} />
      {status && <Text style={styles.status}>{status}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  status: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 16,
    color: 'green',
  },
});

export default Follow;
