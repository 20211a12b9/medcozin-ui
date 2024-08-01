import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, Text, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const HeaderScreen = () => {
    const navigation = useNavigation();
    const [user, setUser] = useState({
        userid: '',
        avatar: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('id');
                const storedAvatar = await AsyncStorage.getItem(`avatar_${storedUser}`);
                setUser(prevUser => ({ ...prevUser, avatar: storedAvatar, userid: storedUser }));
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image style={styles.appLogo} source={require("../assets/MEDICOZ.png")} />
                <Text style={styles.greetingText}>
                    Medicoz<Text style={{ color: '#8EBA17' }}>!</Text>n
                </Text>
            </View>
            <TouchableOpacity style={styles.iconContainer}>
                <View style={styles.iconBackground}>
                    <Image style={styles.icon} source={require("../assets/search2.png")} />
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}>
                <Image style={styles.icon} source={require("../assets/telegram2.png")} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.avatarContainer} onPress={() => navigation.navigate('ProfileScreen')}>
                <Image style={styles.avatar} source={user.avatar ? { uri: user.avatar } : require('../assets/avatar.png')} />
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
        paddingHorizontal: width * 0.03, // 3% of screen width
        paddingVertical: 20, // 2% of screen height
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        width: '100%',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    appLogo: {
        width: width * 0.3, // 30% of screen width
        height: height * 0.05, // 5% of screen height
        resizeMode: 'contain',
        marginLeft:-35
    },
    greetingText: {
        marginLeft: -width * 0.06, // 2% of screen width
        fontSize: width * 0.05, // 5% of screen width
        color: '#333',
        fontStyle: 'italic',
        fontWeight: '800'
    },
    iconContainer: {
        marginLeft: width * 0.03, // 3% of screen width
        paddingRight: width * 0.02, // 2% of screen width
    },
    iconBackground: {
        backgroundColor: '#f0f0f0',
        borderRadius: width * 0.07, // 7% of screen width
        padding: 2,
    },
    icon: {
        width: width * 0.1, // 10% of screen width
        height: width * 0.1, // 10% of screen width
        resizeMode: 'contain',
    },
    avatarContainer: {
        width: width * 0.12, // 12% of screen width
        height: width * 0.12, // 12% of screen width
        borderRadius: (width * 0.12) / 2, // Half of width for circle
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#a1c217',
        marginLeft: width * 0.02, // 2% of screen width
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: (width * 0.12) / 2, // Half of width for circle
    },
});

export default HeaderScreen;
