import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserPermissions from './utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from "../AppContext";
import FooterScreen from './FooterScreen';
import AboutFollowersOrFollowing from './AboutFollowersOrFollowing';
import { useNavigation,useRoute } from '@react-navigation/native';
import medicozinConfig from '../medicozin.config';
import ArticlesofFollowersOrFollowing from './ArticlesofFollowersOrFollowing';



const screenwidth = Dimensions.get('window').width;

const ProfileScreenOfFollowersOrFollowing = () => {
  const [user, setUser] = useState({ userid: '', avatar: '' });
  const [selectedSection, setSelectedSection] = useState(''); // State for the selected section
  const { setIsLoggedIn } = useContext(AppContext);
  const navigation = useNavigation();
  const [data,setData]=useState();
  const route = useRoute();
  const { followerId } = route.params;
  const [imageurl,setImageUrl]=useState();

  console.log("followerId",followerId)
  const fetchPosts = async () => {
    try {
        const jwt = await AsyncStorage.getItem('token');
        if (!jwt) {
            throw new Error('No token found');
        }
        const storedUser = await AsyncStorage.getItem('id');
        const response = await fetch(`${medicozinConfig.API_HOST}/getProfilepicbyId/${followerId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${jwt}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Raw article data:", data[0][0]);

        setImageUrl(data[0][0])
    } catch (error) {
       
        console.error('Error fetching posts:', error);
    } finally {
        setRefreshing(false);
    }
};

useEffect(() => {
    fetchPosts();
}, []);
  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('id');
      if (storedUser) {
        const userId = JSON.parse(storedUser);
        setUser(prevUser => ({ ...prevUser, userid: userId }));
        await retrieveStoredAvatar(userId);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const retrieveStoredAvatar = async (userId) => {
    try {
      const storedAvatar = await AsyncStorage.getItem(`avatar_${userId}`);
      if (storedAvatar) {
        setUser(prevUser => ({ ...prevUser, avatar: storedAvatar }));
      } else {
        console.log("No avatar found for user");
      }
    } catch (error) {
      console.error('Error retrieving stored avatar:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handlePicker = async () => {
    await UserPermissions.getMediaLibraryPermissions();

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        // aspect: [6, 4],
      });

      if (!result.canceled && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setUser(prevUser => ({ ...prevUser, avatar: selectedImage.uri }));
        await AsyncStorage.setItem(`avatar_${user.userid}`, selectedImage.uri);
      } else {
        console.log('Image selection canceled');
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const renderSelectedSection = () => {
    if (selectedSection === 'About') {
        return <AboutFollowersOrFollowing followerId={followerId} />;
    }
    else  if (selectedSection === 'Articles') {
      return <ArticlesofFollowersOrFollowing followerId={followerId}/>;
    }
    // Add other sections like 'Articles' or 'Rewards' as needed
    return null;
  };
  useEffect(()=>{
    fetchAbout();
   },[])
 
  
 
   
   const fetchAbout = async () => {
     try {
       const jwt = await AsyncStorage.getItem('token');
       if (!jwt) {
         throw new Error('No token found');
       }
       const storedUser = await AsyncStorage.getItem('id');
       const response = await fetch(`${medicozinConfig.API_HOST}/studentAddress/${followerId}`, {
         method: 'GET',
         headers: {
           Authorization: `Bearer ${jwt}`,
         },
       });
 
       if (!response.ok) {
         throw new Error(`HTTP error! status: ${response.status}`);
       }
 
       const data = await response.json();
       setData(data)
       console.log("setudentdetails",data)
     } catch (error) {
    
       console.error('Error fetching posts:', error);
     } 
   };
   console.log("ima",imageurl)
  return (
    <View style={styles.container}>
      {/* <ProfileHeader /> */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      
        <View style={styles.profileInfo}>
          <View style={styles.avatarNavigator}>
         
            
            <Image style={styles.appIcon} source={require('../assets/edit-text.png')} />
              <Image 
        
                style={styles.avatar} 
                source={( { uri: imageurl } )}
              />
          
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>{data? 'Dr.':''}{data ? data[0][2]: ''}{' '}{data ? data[0][3] :''}</Text>
              <Text style={styles.specialization}>{data ? data[0][5]: ''}</Text>
            </View>
          </View>
          <View style={styles.profileInfo2}>
            <View style={styles.belowProfile}>
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.profileButton} 
                  onPress={() => setSelectedSection('About')} // Set selected section
                >
                  <Text style={[styles.profileButtonText, selectedSection === 'About' && styles.selectedButton]}>About</Text>
                </TouchableOpacity>
                {selectedSection === 'About' && (
                  <Image style={styles.arrowIcon} source={require('../assets/arrow-up.png')} />
                )}
              </View>
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.profileButton} 
                  onPress={() => setSelectedSection('Articles')}
                >
                  <Text style={[styles.profileButtonText, selectedSection === 'Articles' && styles.selectedButton]}>Articles</Text>
                </TouchableOpacity>
                {selectedSection === 'Articles' && (
                  <Image style={styles.arrowIcon} source={require('../assets/arrow-up.png')} />
                )}
              </View>
              <View style={styles.sectionContainer}>
                <TouchableOpacity 
                  style={styles.profileButton} 
                  onPress={() => setSelectedSection('Rewards')}
                >
                  <Text style={[styles.profileButtonText, selectedSection === 'Rewards' && styles.selectedButton]}>Connect</Text>
                </TouchableOpacity>
                {selectedSection === 'Rewards' && (
                  <Image style={styles.arrowIcon} source={require('../assets/arrow-up.png')} />
                )}
              </View>
            </View>
          </View>
        </View>
        {renderSelectedSection()}
      
       
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
    marginTop: 4,
  },
  profileInfo: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    marginTop: -30,
  },
  profileInfo2: {
    alignItems: 'center',
    width: screenwidth - 22,
    maxWidth: 600,
    borderRadius: 30,
    justifyContent: 'center',
    backgroundColor: '#353839',
    paddingVertical: 10,
    marginTop: -10,
  },
  avatarNavigator: {
    position: 'relative',
    marginVertical: 8,
    marginHorizontal: 14,
    borderRadius: 20,
    borderColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenwidth - 12,
  },
  avatar: {
    width: screenwidth - 12,
    height: 350,
    borderRadius: 20,
    resizeMode: 'cover',
    backgroundColor: '#ffcba4',
  },
  appIcon: {
    position: 'absolute',
    top: 40, // Adjust as needed
    right: 20, // Adjust as needed
    height: 35,
    width: 35,
    resizeMode: 'contain',
    backgroundColor: '#c4d870',
    borderRadius: 15,
    padding: 5,
    zIndex: 1, // Ensure the icon is above the image
  },
  usernameContainer: {
    position: 'absolute',
    bottom: 3,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  username: {
    fontSize: 20,
    fontWeight: '300',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingBottom: 10,
    paddingHorizontal: 10,
    marginTop: 2,
    width: '100%',
    textAlign: 'center',
  },
  specialization: {
    fontSize: 16,
    fontWeight: '100',
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 0,
    paddingHorizontal: 10,
    marginTop: 0,
    paddingBottom: 2,
    width: '100%',
    textAlign: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileButton: {
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  selectedButton: {
    color: '#b7e637', // Highlight color for the selected button
  },
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '200',
  },
  arrowIcon: {
    marginBottom: -25, // Adjust the margin as needed
    width: 45,
    height: 35,
  },
  belowProfile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  sectionContainer: {
    alignItems: 'center',
    flexDirection: 'column', // Stack text and icon vertically
    justifyContent: 'center', // Align items in the center
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ff6347',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});




export default ProfileScreenOfFollowersOrFollowing;
