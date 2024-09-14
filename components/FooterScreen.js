import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FooterScreen = ({ showBack }) => {
  const navigation = useNavigation();
  
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.footer}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('StudentHome')}>
        <Image style={styles.appIcon} source={require('../assets/home4.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('NetworkScreen')}>
        <Image style={styles.appIcon} source={require('../assets/link4.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('PostForm')}>
        <Image style={styles.appIcon} source={require('../assets/post3.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Follow')}>
        <Image style={styles.appIcon} source={require('../assets/ringing3.png')} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => navigation.navigate('Portfolio')}>
        <Image style={styles.appIcon} source={require('../assets/portfolio3.png')} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#444444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderRadius: 90,
    margin: 5,
    paddingBottom:10
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  appIcon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    backgroundColor: '#444444',
    borderRadius: 15,
    padding: 5,
  },
  backIcon: {
    height: 23,
    width: 30,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
    borderRadius: 15,
    padding: 5,
  },
}); 

export default FooterScreen;
