import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import { Alert } from 'react-native';

class UserPermissions {
    static getMediaLibraryPermissions = async () => {
        if (Constants.platform.ios) {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert("Permission required", "You need permission to access the media library.");
            }
        }
    }

    // Add other permissions handling methods as needed
}

export default UserPermissions;
