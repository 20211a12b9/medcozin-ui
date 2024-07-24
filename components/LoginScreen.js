import React, { useState, useContext } from "react";
import { View, Text, StyleSheet, TextInput, Pressable, Alert,Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppContext } from "../AppContext";
import medicozinConfig from "../medicozin.config";

const LoginScreen = ({ navigation }) => {
  const [emailMobile, setEmailMobile] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");
  const { setIsLoggedIn } = useContext(AppContext);
  const [role, setRole] = useState("");

  const submit = async () => {
    setEmailError("");
    setPasswordError("");
    setLoginError("");

    if (emailMobile === "") {
      setEmailError("Please enter your mobile number");
      return;
    } else if (password === "") {
      setPasswordError("Please enter your password");
      return;
    }

    try {
      const response = await fetch(`${medicozinConfig.API_HOST}/authenticate`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: emailMobile,
          password: password,
        }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        await AsyncStorage.setItem("token", responseData.jwt);
        await AsyncStorage.setItem("id", responseData.userId.toString());
        await AsyncStorage.setItem("role", responseData.userType);
        setRole(responseData.userType);
        setIsLoggedIn(true);

        // Navigate based on user role
        if (responseData.userType === "student") {
          navigation.navigate("StudentHome");
        } else if (responseData.userType === "company") {
          navigation.navigate("CompanyHome");
        } else {
          navigation.navigate("DoctorHome");
        }
      } else {
        throw new Error("Invalid username or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setLoginError("Invalid username or password");
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.mainHeader}>MedicozIn!</Text>
      <View style={styles.imageContainer}>
        <Image
          style={styles.appLogo}
          source={require("../assets/logo2.jpg")}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Enter Mobile Number"
    
          autoCapitalize="none"
          autoCorrect={false}
          value={emailMobile}
          onChangeText={setEmailMobile}
        />
        {emailError.length > 0 && (
          <Text style={styles.errorStyle}>{emailError}</Text>
        )}
        <TextInput
          style={styles.inputStyle}
          placeholder="Enter Password"
         
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        {passwordError.length > 0 && (
          <Text style={styles.errorStyle}>{passwordError}</Text>
        )}
        <Pressable style={styles.buttonStyle} onPress={submit}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        {loginError.length > 0 && (
          <Text style={styles.errorStyle}>{loginError}</Text>
        )}
        <Text style={styles.wrapperText}>
          Don't have an account?{" "}
          <Text
            style={styles.registerLink}
            onPress={() => navigation.navigate("SignUpScreen")}
          >
            Register
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5", // Black background
    justifyContent: "center",
    alignItems: "center",
  },
  mainHeader: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000000', // Black text
    marginBottom: -20
  },
  inputContainer: {
    width: "80%",
    alignItems: "center",
  },
  inputStyle: {
    color: "black", // White text
    borderBottomWidth: 1,
    borderColor: "#000000", // White border
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#F5F5F5", // Dark gray background for input
  },
  errorStyle: {
    color: "red",
    fontSize: 15,
    marginTop: 5,
  },
  buttonStyle: {
    backgroundColor: "#000000", // White button background
    borderRadius: 10,
    height: 50,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF", // Black text
    fontSize: 20,
  },
  wrapperText: {
    marginTop: 20,
    fontSize: 15,
    color: "#000000", // White text
  },
  registerLink: {
    color: "blue", // Change to a distinct color for visibility
    borderBottomColor: "#12E6CD",
    borderBottomWidth: 1,
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

export default LoginScreen;
