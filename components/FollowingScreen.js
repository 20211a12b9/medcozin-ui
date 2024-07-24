import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileHeader from './ProfileHeader';

const FollowingScreen = () => {
  return (
    <View style={styles.container}>
      <ProfileHeader />
      {/* Additional content can be added here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default FollowingScreen;
