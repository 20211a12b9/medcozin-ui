import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserPermissions from './utilities/UserPermissions';
import medicozinConfig from '../medicozin.config';

const PostForm = () => {
    const [content, setContent] = useState('');
    const [type, setType] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const storedId = await AsyncStorage.getItem('id');
                if (storedId !== null) {
                    setUserId(JSON.parse(storedId));
                }
            } catch (error) {
                console.log('Error fetching user ID:', error);
            }
        };

        fetchUserId();
    }, []);

    const handleImagePick = async () => {
        await UserPermissions.getMediaLibraryPermissions();

        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
               
                quality: 1,
            });

            if (!result.canceled && result.assets.length > 0) {
                setImageUri(result.assets[0].uri);
            } else {
                console.log('Image selection canceled');
            }
        } catch (error) {
            console.error('Error picking image:', error);
        }
    };

    const handleSubmit = async () => {
        if (!content || !type) {
            Alert.alert('Error', 'Content and Type are required');
            return;
        }

        const formData = new FormData();
        formData.append('studentId', userId);
        formData.append('content', content);
        formData.append('type', type);

        if (imageUri) {
            const uriParts = imageUri.split('.');
            const fileType = uriParts[uriParts.length - 1];
            formData.append('image', {
                uri: imageUri,
                name: `photo.${fileType}`,
                type: `image/${fileType}`,
            });
        }

        try {
            const jwt = await AsyncStorage.getItem('token');

            const response = await fetch(`${medicozinConfig.API_HOST}/create`, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data',
                    Authorization: 'Bearer ' + jwt,
                },
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Post created successfully');
                setContent('');
                setType('');
                setImageUri(null);
            } else {
                Alert.alert('Error', result.message || 'Something went wrong');
            }
        } catch (error) {
            Alert.alert('Error', 'Network error');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Create a Post</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Post Content"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={4}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Post Type"
                value={type}
                onChangeText={setType}
            />
            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                <Text style={styles.imagePickerText}>Pick an Image</Text>
            </TouchableOpacity>
            {imageUri && (
                <Image
                    source={{ uri: imageUri }}
                    style={styles.image}
                />
            )}
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Create Post</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        height: 100,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#fff',
    },
    imagePicker: {
        backgroundColor: '#8EBA17',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
        alignItems: 'center',
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
        marginBottom: 16,
        resizeMode: 'cover',
    },
    submitButton: {
        backgroundColor: '#4CAF50',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PostForm;
