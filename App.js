import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppContext } from "./AppContext"; 
import * as Notifications from "expo-notifications";
import SignUpScreen from "./components/SignUpScreen";
import LoginScreen from "./components/LoginScreen";
import StudentHome from "./components/StudentHome";
import DoctorHome from "./components/DoctorHome";
import CompanyHome from "./components/CompanyHome";
import HeaderScreen from "./components/HeaderScreen";
import FooterScreen from "./components/FooterScreen";
import ProfileScreen from "./components/ProfileScreen";
import ProfileHeader from "./components/ProfileHeader";
import FollowersScreen from "./components/FollowersScreen";
import FollowingScreen from "./components/FollowingScreen";
import ConnectionsScreen from "./components/ConnectionsScreen";
import ChatScreen from "./components/ChatScreen";
import PostForm from "./components/PostForm";
import PostsScreen from "./components/PostsScreen";
import PostDetailScreen from "./components/PostDetailScreen";
import CreateCommentScreen from "./components/CreateCommentScreen";
import LikeButton from "./components/LikeButton";
import NetworkScreen from "./components/NetworkScreen";


const AuthStack = createNativeStackNavigator();
const AppStack = createNativeStackNavigator();

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");

  useEffect(() => {
    const checkTokenAndRole = async () => {
      const token = await AsyncStorage.getItem("token");
      const role = await AsyncStorage.getItem("role");
      console.log("role",role)
      if (token) {
        setIsLoggedIn(true);
      }

      if (role) {
        setRole(role);
      }
    };

    checkTokenAndRole();
  },1000 [role]);

  const AuthNavigator = () => (
    <AuthStack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false }}
    >
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="SignUpScreen" component={SignUpScreen} />
    </AuthStack.Navigator>
  );

  const DoctorNavigator = () => (
    <AppStack.Navigator
      initialRouteName="DoctorHome"
      screenOptions={{ headerShown: false }}
    >
      <AppStack.Screen name="DoctorHome" component={DoctorHome} />
    </AppStack.Navigator>
  );

  const CompanyNavigator = () => (
    <AppStack.Navigator
      initialRouteName="CompanyHome"
      screenOptions={{ headerShown: false }}
    >
      <AppStack.Screen name="CompanyHome" component={CompanyHome} />
    </AppStack.Navigator>
  );

  const AppNavigator = () => (
    <AppStack.Navigator
      initialRouteName="StudentHome"
      screenOptions={{ headerShown: false }}
    >
      <AppStack.Screen name="StudentHome" component={StudentHome} />
      <AppStack.Screen name="HeaderScreen" component={HeaderScreen} />
      <AppStack.Screen name="FooterScreen" component={FooterScreen} />
      <AppStack.Screen name="ProfileScreen" component={ProfileScreen} />
      <AppStack.Screen name="FollowersScreen" component={FollowersScreen} />
      <AppStack.Screen name="FollowingScreen" component={FollowingScreen} />
      <AppStack.Screen name="ConnectionsScreen" component={ConnectionsScreen} />
      <AppStack.Screen name="ChatScreen" component={ChatScreen} />
      <AppStack.Screen name="PostForm" component={PostForm} />
      <AppStack.Screen name="PostsScreen" component={PostsScreen} />
      <AppStack.Screen name="PostDetailScreen" component={PostDetailScreen} />
      <AppStack.Screen name="CreateCommentScreen" component={CreateCommentScreen} />
      <AppStack.Screen name="LikeButton" component={LikeButton} />
      <AppStack.Screen name="NetworkScreen" component={NetworkScreen} />
    </AppStack.Navigator>
  );

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <View style={styles.container}>
        <NavigationContainer>
          {isLoggedIn ? (
            role === "doctor" ? (
              <DoctorNavigator />
            ) : role === "company" ? (
              <CompanyNavigator />
            ) : (
              <AppNavigator />
            )
          ) : (
            <AuthNavigator />
          )}
        </NavigationContainer>
      </View>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
});
