import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, StatusBar, TouchableOpacity, Alert,Pressable } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import UserPermissions from './utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import medicozinConfig from '../medicozin.config';

const ProfileHeader = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({
        userid: '',
        avatar: ''
    });
    const [studentDetails, setStudentDetails] = useState(null);
    const [fisrtname,setFirstname]=useState('')
    const [secondname,setSecondname]=useState('')

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
                await fetchStudentDetails(userData);
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

    const fetchStudentDetails = async (userId) => {
        try {
            const storedUser = await AsyncStorage.getItem('id');
            const jwt = await AsyncStorage.getItem('token');
            console.log("jwt",jwt,"id",storedUser)
            const response = await fetch(`${medicozinConfig.API_HOST}/studentDetails/${storedUser}`, {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + jwt,
                },
            });
            if (response.status === 200) {
                const data = await response.text();
                console.log(data.split(',')[1].split(':')[1],"",data.split(',')[2].split(':')[1])
                const data1=data.split(',')[1].split(':')[1];
                const data2=data.split(',')[2].split(':')[1];
                const cleanedText1 = data1.replace(/"/g, '');
                const cleanedText2=data2.replace(/"/g, '');
                setFirstname(cleanedText1)
                setSecondname(cleanedText2)
                setStudentDetails(data);
            } else if (response.status === 403) {
                AsyncStorage.removeItem('token');
                throw new Error('Unauthorized');
            } else {
                throw new Error('Failed to fetch student details');
            }
        } catch (error) {
            console.error('Error fetching student details:', error);
            Alert.alert('Error', 'Failed to fetch student details');
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
    const goBack = () => {
        navigation.goBack();
    };
    return (
        <View style={styles.container}>
             <Pressable onPress={goBack} style={styles.backButton}>
                            <Image style={styles.backIcon} source={require('../assets/goback.png')} />
                        </Pressable>
            <TouchableOpacity style={styles.container2}>
                <Text style={styles.container2text}>{fisrtname} {secondname} </Text>
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
                {studentDetails && (
                    <>
                        <Text style={styles.nameText}>{studentDetails.name}</Text>
                        <Text style={styles.emailText}>{studentDetails.email}</Text>
                    </>
                )}
            </View>
            <TouchableOpacity>
                <Image style={styles.icon} source={require("../assets/telegram2.png")} />
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
    avatarContainer: {
        width: 54,
        height: 54,
        borderRadius: 27,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E1E2E6',
        marginRight: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 27,
    },
    detailsContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    emailText: {
        fontSize: 14,
        color: '#666',
    },
    icon: {
        width: 44,
        height: 44,
        resizeMode: 'contain',
    },
    container2text:{
        fontWeight:'bold',
        fontSize:19
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        width: 20,
        height: 23,
    },
});

export default ProfileHeader;






























