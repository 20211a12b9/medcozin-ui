import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const DoctorHome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Doctor Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // light grey background color
    width: width,
    height: height,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // dark grey text color
  }
});

export default DoctorHome;
