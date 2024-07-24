import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import HeaderScreen from './HeaderScreen';
import FooterScreen from './FooterScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const StudentHome = () => {

  return (
    <View style={styles.container}>
      <HeaderScreen />
      <View style={styles.contentContainer}>
     
        <Text style={styles.headerText}>  Medicoz<Text style={{color:'#8EBA17'}}>!</Text>n </Text>
      </View>
      <FooterScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0', // light grey background color
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333', // dark grey text color
  }
});

export default StudentHome;
