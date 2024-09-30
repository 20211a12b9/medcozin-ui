import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import medicozinConfig from '../medicozin.config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ConnectionsScreen = ({ followerId }) => {
  const [status, setStatus] = useState(''); // Adding status state to handle feedback

  console.log("followerId in connections",followerId)
  const createFollower = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('id');
      if (!storedUser) {
        setStatus('User ID not found');
        return;
      }
      console.log("stoesd user in connections",storedUser)
      const response = await fetch(`${medicozinConfig.API_HOST}/createConnection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: followerId,
          connection: { studentId: storedUser },
        }),
      });

      if (response.ok) {
        setStatus('Connection created successfully');
      } else {
        setStatus('Error creating connection');
      }
    } catch (error) {
      setStatus('Error creating connection');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={createFollower} style={styles.button}>
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>
      {status ? <Text style={styles.statusText}>{status}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  statusText: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default ConnectionsScreen;
