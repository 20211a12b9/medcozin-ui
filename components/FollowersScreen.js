import React from 'react';
import { View, StyleSheet } from 'react-native';
import ProfileHeader from './ProfileHeader';

const FollowersScreen = () => {
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

export default FollowersScreen;
