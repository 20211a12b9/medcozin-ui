import React, { useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FooterScreen from './FooterScreen';
import { AppContext } from "../AppContext";

const NetworkScreen = () => {
  const navigation = useNavigation();
  const { setIsLoggedIn } = useContext(AppContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image style={styles.icon} source={require("../assets/goback.png")} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Network</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileInfo}>
          <View style={styles.belowProfile}>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FollowersScreen')}>
              <Text style={styles.profileButtonText}>Followers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('FollowingScreen')}>
              <Text style={styles.profileButtonText}>Following</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('ConnectionsScreen')}>
              <Text style={styles.profileButtonText}>Connections</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <FooterScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    marginTop: 80, // Adjusted for header height
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#353839',
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    marginBottom: 20, // Added margin bottom for spacing
  },
  profileButton: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 10,
    paddingVertical: 10,
   
  },
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '400',
  },
  belowProfile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    zIndex: 1,
    paddingTop: 40, // Ensure header title is not obscured by status bar
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
  },
  icon: {
    height: 24, // Adjusted height
    width: 24, // Adjusted width
    resizeMode: 'contain', // Ensures the image scales properly
  },
});

export default NetworkScreen;
