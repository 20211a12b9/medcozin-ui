// SignUpScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator,Image } from 'react-native';
import medicozinConfig from '../medicozin.config';
import { useNavigation } from "@react-navigation/native";

const SignUpScreen = () => {
  const [userType, setUserType] = useState('student'); // Default user type
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    collagename: '',
    email: '',
    specialization: '',
    mobileno: '',
    password: '',
    referralcode: '',
    designation: '',
    cname: ''
  });
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,6}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobileno) => {
    const re = /^[0-9]{10}$/;
    return re.test(String(mobileno));
  };

  const validateForm = () => {
    if (!formData.firstname || !formData.lastname || !formData.email || !formData.mobileno || !formData.password) {
      Alert.alert('Error', 'All fields except referral code are mandatory!');
      return false;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert('Error', 'Invalid email format!');
      return false;
    }

    if (!validateMobile(formData.mobileno)) {
      Alert.alert('Error', 'Mobile number should be 10 digits long!');
      return false;
    }

    if (userType === 'student' && !formData.collagename) {
      Alert.alert('Error', 'College name is mandatory for students!');
      return false;
    }

    if (userType === 'doctor' && (!formData.collagename || !formData.designation || !formData.specialization)) {
      Alert.alert('Error', 'College name, designation, and specialization are mandatory for doctors!');
      return false;
    }

    if (userType === 'company' && !formData.cname) {
      Alert.alert('Error', 'Company name is mandatory for companies!');
      return false;
    }

    return true;
  };

  const registerUser = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true); // Start loading

    let url = '';
    let data = {};

    switch (userType) {
      case 'student':
        url = medicozinConfig.API_HOST + '/studentRegister';
        data = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          collagename: formData.collagename,
          email: formData.email,
          specialization: formData.specialization,
          mobileno: formData.mobileno,
          password: formData.password,
          referralcode: formData.referralcode,
        };
        break;
      case 'doctor':
        url = medicozinConfig.API_HOST + '/doctorRegister';
        data = {
          firstname: formData.firstname,
          lastname: formData.lastname,
          collagename: formData.collagename,
          email: formData.email,
          designation: formData.designation,
          specialization: formData.specialization,
          mobileno: formData.mobileno,
          password: formData.password,
          referralcode: formData.referralcode,
        };
        break;
      case 'company':
        url = medicozinConfig.API_HOST + '/companyRegister';
        data = {
          cname: formData.cname,
          email: formData.email,
          mobileno: formData.mobileno,
          password: formData.password,
        };
        break;
      default:
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        Alert.alert('Success', 'Registration successful!');
        navigation.navigate('LoginScreen');
        setFormData({ firstname: '', lastname: '', collagename: '', email: '', specialization: '', mobileno: '', password: '', referralcode: '', designation: '', cname: '' });
      } else {
        const error = await response.json();
        Alert.alert('Error', error.message || 'Registration failed!');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const renderFormFields = () => {
    switch (userType) {
      case 'student':
        return (
          <>
            <TextInput placeholder="First Name" style={styles.input}  onChangeText={(text) => handleInputChange('firstname', text)} />
            <TextInput placeholder="Last Name" style={styles.input}  onChangeText={(text) => handleInputChange('lastname', text)} />
            <TextInput placeholder="College Name" style={styles.input}  onChangeText={(text) => handleInputChange('collagename', text)} />
            <TextInput placeholder="Email" style={styles.input}  onChangeText={(text) => handleInputChange('email', text)} />
            <TextInput placeholder="Specialization" style={styles.input}  onChangeText={(text) => handleInputChange('specialization', text)} />
            <TextInput placeholder="Mobile No" style={styles.input}  onChangeText={(text) => handleInputChange('mobileno', text)} />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry  onChangeText={(text) => handleInputChange('password', text)} />
            <TextInput placeholder="Referral Code" style={styles.input}  onChangeText={(text) => handleInputChange('referralcode', text)} />
          </>
        );
      case 'doctor':
        return (
          <>
            <TextInput placeholder="First Name" style={styles.input}  onChangeText={(text) => handleInputChange('firstname', text)} />
            <TextInput placeholder="Last Name" style={styles.input}  onChangeText={(text) => handleInputChange('lastname', text)} />
            <TextInput placeholder="College Name" style={styles.input} onChangeText={(text) => handleInputChange('collagename', text)} />
            <TextInput placeholder="Email" style={styles.input}  onChangeText={(text) => handleInputChange('email', text)} />
            <TextInput placeholder="Designation" style={styles.input}  onChangeText={(text) => handleInputChange('designation', text)} />
            <TextInput placeholder="Specialization" style={styles.input}  onChangeText={(text) => handleInputChange('specialization', text)} />
            <TextInput placeholder="Mobile No" style={styles.input}  onChangeText={(text) => handleInputChange('mobileno', text)} />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry onChangeText={(text) => handleInputChange('password', text)} />
            <TextInput placeholder="Referral Code" style={styles.input}  onChangeText={(text) => handleInputChange('referralcode', text)} />
          </>
        );
      case 'company':
        return (
          <>
            <TextInput placeholder="Company Name" style={styles.input}  onChangeText={(text) => handleInputChange('cname', text)} />
            <TextInput placeholder="Email" style={styles.input}  onChangeText={(text) => handleInputChange('email', text)} />
            <TextInput placeholder="Mobile No" style={styles.input}  onChangeText={(text) => handleInputChange('mobileno', text)} />
            <TextInput placeholder="Password" style={styles.input} secureTextEntry  onChangeText={(text) => handleInputChange('password', text)} />
          </>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medicozin!</Text>
      <View style={styles.imageContainer}>
        <Image
          style={styles.appLogo}
          source={require("../assets/logo2.jpg")}
        />
      </View>
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setUserType('student')} style={userType === 'student' ? styles.activeButton : styles.button}>
          <Text style={userType === 'student' ? styles.activeButtonText : styles.buttonText}>Student</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setUserType('doctor')} style={userType === 'doctor' ? styles.activeButton : styles.button}>
          <Text style={userType === 'doctor' ? styles.activeButtonText : styles.buttonText}>Doctor</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setUserType('company')} style={userType === 'company' ? styles.activeButton : styles.button}>
          <Text style={userType === 'company' ? styles.activeButtonText : styles.buttonText}>Company</Text>
        </TouchableOpacity>
      </View>
      {renderFormFields()}
      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      ) : (
        <TouchableOpacity style={styles.registerButton} onPress={registerUser}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      )}
       <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')} style={styles.loginLink}>
        <Text style={styles.loginLinkText}>Already have an account? <Text style={styles.loginText}>Login</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // White background
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000', // Black text
    marginBottom: -20,paddingTop:10
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    backgroundColor: '#444444',
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  activeButton: {
    padding: 12,
    backgroundColor: 'orange',
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF', // Keep button text white
    fontWeight: 'bold',
  },
  activeButtonText: {
    color: '#000000', // Black text for active button
    fontWeight: 'bold',
  },
  input: {
    height: 50,
    borderColor: '#000000', // Black border for input
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    color: '#000000', // Black text in input
    backgroundColor: '#FFFFFF', // White background for input
  },
  registerButton: {
    backgroundColor: '#444444', // Change to dark color for contrast
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#FFFFFF', // White text on register button
    fontWeight: 'bold',
    fontSize: 18,
  },
  loader: {
    marginVertical: 15,
  },
  loginLink: {
    marginTop: 15,
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#000000', // Black text for login link
    fontWeight: 'bold',
  },
  loginText: {
    color: 'orange', // Orange color for highlighted login text
    fontWeight: 'bold',
  },
  imageContainer: {
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  appLogo: {
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
});


export default SignUpScreen;
