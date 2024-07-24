import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, StatusBar, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import UserPermissions from './utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';


const HeaderScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({
        userid: '',
        avatar: ''
    });
    module.exports = {
        assets: ['./assets/fonts'],
      };
    useEffect(() => {
        fetchUserData();
    }, []);

    const fetchUserData = async () => {
        try {
            const storedUser = await AsyncStorage.getItem('id');
            if (storedUser) {
                const userData = JSON.parse(storedUser);
                setUser({ userid: userData });
                await retrieveStoredAvatar(userData);
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
            }
        } catch (error) {
            console.error('Error retrieving stored avatar:', error);
        }
    };

    const handlePicker = async () => {
        await UserPermissions.getMediaLibraryPermissions();
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
            });
            if (!result.cancelled && result.assets.length > 0) {
                const selectedImage = result.assets[0];
                setUser(prevUser => ({ ...prevUser, avatar: selectedImage.uri }));
                await AsyncStorage.setItem(`avatar_${user.userid}`, selectedImage.uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    return (
        <View style={styles.container}>
          <View style={styles.logoContainer}>
    <Image style={styles.appLogo} source={require("../assets/MEDICOZ.png")} />
    <Text style={styles.greetingText} >
        Medicoz<Text style={{color:'#8EBA17'}}>!</Text>n
    </Text>
</View>

            <TouchableOpacity style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                    <Image style={styles.icon} source={require("../assets/search2.png")} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity>
                <Image style={styles.icon} source={require("../assets/telegram2.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarContainer} onPress={handlePicker}>
                <Image style={styles.avatar} source={{ uri: user.avatar || 'https://example.com/default-avatar.png' }} />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: StatusBar.currentHeight || 0,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        width: '100%',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginLeft:-17
    },
    appLogo: {
        width: 100,
        height: 40,
        resizeMode: 'contain',
    },
    greetingText: {
        marginLeft:-20,
        fontSize: 19,
        color: '#333', // You can change the color as needed
        fontFamily: 'italic',
        fontSize: 18, fontWeight: '800', fontStyle: 'italic' 
    },
  
    iconContainer: {
        marginLeft:20, 
        paddingRight:10
    },
    iconBackground: {
        backgroundColor: '#f0f0f0', // Grey background color for the search icon
        borderRadius: 30,
        padding: 2,
    },
    icon: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
    },
    avatarContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E1E2E6',
        marginLeft: 10, // Adjust margin as needed
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 27,
    },
});

export default HeaderScreen;
