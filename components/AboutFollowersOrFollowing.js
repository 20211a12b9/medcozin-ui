import React, { useEffect, useState, useContext } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, ScrollView, Alert, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserPermissions from './utilities/UserPermissions';
import * as ImagePicker from 'expo-image-picker';
import { AppContext } from "../AppContext";
import FooterScreen from './FooterScreen';
import ProfileHeader from './ProfileHeader';
import { useNavigation,useRoute } from '@react-navigation/native';
import medicozinConfig from '../medicozin.config';

const screenwidth = Dimensions.get('window').width;

const AboutFollowersOrFollowing = ({ followerId }) => {
 
const [data,setData]=useState();

  

  useEffect(()=>{
   fetchAbout();
  },[])

 

  
  const fetchAbout = async () => {
    try {
      const jwt = await AsyncStorage.getItem('token');
      if (!jwt) {
        throw new Error('No token found');
      }
      const storedUser = await AsyncStorage.getItem('id');
      const response = await fetch(`${medicozinConfig.API_HOST}/studentAddress/${followerId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setData(data)
      console.log("setudentdetails",data)
    } catch (error) {
   
      console.error('Error fetching posts:', error);
    } 
  };
  return (
    <View style={styles.container}>
     
    
        <View style={styles.profileInfo}>
        
          <View style={styles.profileInfo2}>
            {/* <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>FirstName</Text>
             <Text style={styles.detailText}>{data ? data[0][2]: ''}</Text>
            </View>
            <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>LastName</Text>
             <Text style={styles.detailText}>{data ? data[0][3] :''}</Text>
            </View> */}
          </View>
          <View style={styles.profileInfo2}>
            <View style={styles.belowProfile1}>
            <Text style={styles.detailText1}>Specialization</Text>
             <Text style={styles.detailText}>{data ? data[0][5]: ''}</Text>
            </View>
           
          </View>
          <View style={styles.profileInfo2}>
            <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>Gender</Text>
             <Text style={styles.detailText}>Male</Text>
            </View>
            <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>DateOfBirth</Text>
             <Text style={styles.detailText}>07 June 1990</Text>
            </View>
          </View>
          <View style={styles.profileInfo2}>
            <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>Location</Text>
             <Text style={styles.detailText}>Hyderabad, Telangana</Text>
            </View>
            <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>Total Experiance</Text>
             <Text style={styles.detailText}>7.9 Years</Text>
            </View>
          </View>
          <View style={styles.profileInfo2}>
            {/* <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>Phone</Text>
             <Text style={styles.detailText}>{data ? data[0][4]: ''}</Text>
            </View>
            <View style={styles.belowProfile}>
            <Text style={styles.detailText1}>Email</Text>
             <Text style={styles.detailText}>{data ? data[0][1]: ''}</Text>
            </View> */}
       
          </View>
          <View style={styles.profileInfo2}>
            <View style={styles.belowProfile2}>
            <Text style={styles.detailText22}>About {data ? data[0][2]: ''} </Text>
             <Text style={styles.detailText2}></Text>
            </View>
           
          </View>
        </View>
     
    

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   marginTop:50
  },
 
  profileInfo: {
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    marginTop:-30
    
  },
  profileInfo2: {
    // alignItems: 'center',
    // width: screenwidth - 22,
    // maxWidth: 600,
    // borderRadius: 30,
    // justifyContent: 'center',
    // backgroundColor: '#dcdcdc',
    // paddingVertical: 10,
    // marginTop: 20,
    flexDirection: 'row',
    gap:10
  },
  avatarNavigator: {
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 10,
    borderColor: '#e0e0e0',
    // backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
 
 
  profileButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '200',
  },
  belowProfile: {
   
    justifyContent: 'space-around',
    width: 200,
    alignItems: 'flex-start',
  
    maxWidth: 200,
    borderRadius: 20,
   
    backgroundColor: '#dcdcdc',
    paddingVertical: 10,
    marginTop: 20,
    height:60
  },
  belowProfile1: {
   
    justifyContent: 'space-around',
    width: 400,
    alignItems: 'flex-start',

    borderRadius: 20, 
    backgroundColor: '#dcdcdc',
    paddingVertical: 10,
    marginTop: 20,
    height:60
  },
  belowProfile2: {
   
    justifyContent: 'space-around',
    width: 400,
    alignItems: 'flex-start',

    borderRadius: 20, 
    backgroundColor: '#dcdcdc',
    paddingVertical: 10,
    marginTop: 20,
    height:150
  },
  detailText:{
    paddingLeft:14,
   fontWeight:'bold',
   paddingBottom:4
  },
  detailText1:{
   paddingBottom:15,
   color:'grey',
    fontWeight:'700',
    paddingLeft:14
   },
   detailText22:{
    paddingBottom:17,
    color:'grey',
     fontWeight:'700',
     paddingLeft:14,
     marginTop:2
    },
    detailText2:{
        paddingLeft:14,
       fontWeight:'bold',
       paddingBottom:4,
       marginBottom:90
      },
});

export default AboutFollowersOrFollowing;
