import React, { useState, useCallback, useRef,useEffect } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, Dimensions, RefreshControl,ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import medicozinConfig from '../medicozin.config';
import { Video } from 'expo-av';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

const ArticlesofFollowersOrFollowing = ({followerId}) => {
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [viewableItems, setViewableItems] = useState([]);
    const videoRefs = useRef(new Map()); // Map to hold video refs
    const navigation = useNavigation();
    const [user, setUser] = useState({ userid: '', avatar: '' }); // Add user state if needed

    const fetchPosts = async () => {
        try {
            const jwt = await AsyncStorage.getItem('token');
            if (!jwt) {
                throw new Error('No token found');
            }
            
            const response = await fetch(`${medicozinConfig.API_HOST}/getAllbyId/${followerId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${jwt}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // console.log("Raw article data:", data);

            // Transform data into the expected format
            const formattedData = data.map((item, index) => ({
                imageUrl: item[2], // Assuming imageUrl is the third element
                postId: item[0], // Assuming postId is the first element
                type: item[1], // Assuming type is the second element
                content: item[4], // Assuming content is the fourth element
               date:item[3]
            }));

            // console.log("Formatted article data:", formattedData);
            setPosts(formattedData);
        } catch (error) {
           
            console.error('Error fetching posts:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        setViewableItems(viewableItems);

        // Manage video playback based on visibility
        viewableItems.forEach(({ item }) => {
            const videoRef = videoRefs.current.get(item.postId);
            if (videoRef) {
                videoRef.playAsync(); // Play video if the item is visible
            }
        });

        // Pause videos not in view
        posts.forEach(({ postId }) => {
            if (!viewableItems.find(viewableItem => viewableItem.item.postId === postId)) {
                const videoRef = videoRefs.current.get(postId);
                if (videoRef) {
                    videoRef.pauseAsync(); // Pause video if the item is not visible
                }
            }
        });
    }, [posts]);

    const viewabilityConfig = {
        itemVisiblePercentThreshold: 50,
    };

    const renderItem = ({ item, index }) => {
        const { imageUrl,postId, type,content} = item;

        return (
            <TouchableOpacity onPress={() => navigation.navigate('PostDetailScreen', {
                post: item,
                posts,
                currentIndex: index,
                // Ensure this function is defined if used
            })}>
                <View style={styles.postContainer}>
                    <View style={styles.imageContainer}>
                        {type === 'video' ? (
                            <Video
                                source={{ uri: imageUrl }}
                                style={styles.postImage}
                                useNativeControls
                                resizeMode="cover"
                                ref={ref => videoRefs.current.set(postId, ref)} // Attach ref to manage playback
                            />
                        ) : (
                            <Image
                                source={{ uri: imageUrl }}
                                style={styles.postImage}
                            />
                        )}
                  
                            
                      
                    </View>
                   
                </View>
            </TouchableOpacity>
        );
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPosts();
    };

    return (
        <View style={styles.container}>
            
            <FlatList
                data={posts}
                renderItem={renderItem}
                keyExtractor={(item) => item.postId.toString()}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                showsVerticalScrollIndicator={false}
                viewabilityConfig={viewabilityConfig}
                onViewableItemsChanged={onViewableItemsChanged}
                numColumns={3} // Set the number of columns for the grid
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
       
       
    },
    imageContainer: {
        position: 'relative',
        flex: 1,
        aspectRatio: 1, // Keep aspect ratio 1:1 for grid layout
        marginLeft:4
    },
    postContainer: {
        flex: 1,
    marginLeft:-5,
    marginTop:10,
    marginRight:-25
  
    },
    postImage: {
        width: '80%',
        height: 150, // Adjust height for grid items
        borderRadius: 8,
        resizeMode: 'cover',
        
      
    },

   

 

});

export default ArticlesofFollowersOrFollowing;
