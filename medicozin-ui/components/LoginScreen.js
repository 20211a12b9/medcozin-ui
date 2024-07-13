import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('http://192.168.1.12:8080/medicozinauthenticate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('Login Response:', responseData);

      // Handle successful login (navigate to next screen, store tokens, etc.)
      Alert.alert('Success', 'Login Successful');
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to login');
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Title style={styles.title}>MedicozIn</Title>
        <TextInput
          label="Email"
          mode="outlined"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          left={() => <TextInput.Icon name="username" />}
        />
        <TextInput
          label="Password"
          mode="outlined"
          secureTextEntry
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          left={() => <TextInput.Icon name="lock" />}
        />
        <Button mode="contained" style={styles.button} onPress={handleLogin}>
          Login
        </Button>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.forgotPassword}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text style={styles.signUp}>Don't have an account? Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  forgotPassword: {
    marginTop: 10,
    color: '#6200ee',
  },
  signUp: {
    marginTop: 20,
    color: '#6200ee',
  },
});

export default LoginScreen;
