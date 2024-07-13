import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, TextInput, Title, Text } from 'react-native-paper';

const SignUpScreen = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    collagename: '',
    email: '',
    specialization: '',
    mobileNo: '',
    referralCode: '',
    password: '',
    // cpassword: '',
  });

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.12:8080/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // Check if the response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const responseData = await response.json();
        console.log('Response Data:', responseData);
        
        Alert.alert('Success', 'Registration Successful');
      } else {
        // Handle non-JSON response (like plain text, HTML, etc.)
        const textResponse = await response.text();
        console.error('Non-JSON response:', textResponse);
        Alert.alert('Success', textResponse); // Show the success message from server
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to register');
    }
  };
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title style={styles.title}>Sign Up</Title>
      <TextInput
        label="First Name"
        value={formData.firstname}
        onChangeText={(value) => handleInputChange('firstname', value)}
        style={styles.input}
      />
      <TextInput
        label="Last Name"
        value={formData.lastname}
        onChangeText={(value) => handleInputChange('lastname', value)}
        style={styles.input}
      />
      <TextInput
        label="College Name"
        value={formData.collagename}
        onChangeText={(value) => handleInputChange('collagename', value)}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        style={styles.input}
      />
      {/* <TextInput
        label="OTP"
        value={formData.otp}
        onChangeText={(value) => handleInputChange('otp', value)}
        style={styles.input}
      /> */}
      <TextInput
        label="Specialization"
        value={formData.specialization}
        onChangeText={(value) => handleInputChange('specialization', value)}
        style={styles.input}
      />
      <TextInput
        label="Mobile No"
        value={formData.mobileno}
        onChangeText={(value) => handleInputChange('mobileno', value)}
        style={styles.input}
      />
      <TextInput
        label="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        style={styles.input}
        secureTextEntry
      />
      {/* <TextInput
        label="Confirm Password"
        value={formData.cpassword}
        onChangeText={(value) => handleInputChange('cpassword', value)}
        style={styles.input}
        secureTextEntry
      /> */}
      <TextInput
        label="Referral Code"
        value={formData.referralcode}
        onChangeText={(value) => handleInputChange('referralcode', value)}
        style={styles.input}
      />
      <Button mode="contained" style={styles.button} onPress={handleSubmit}>
        <Text style={{ color: 'white' }}>Register</Text>
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    marginBottom: 10,
  },
  button: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default SignUpScreen;
