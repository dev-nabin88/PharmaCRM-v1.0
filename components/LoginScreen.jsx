import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TextInput,
  Pressable,
  TouchableOpacity,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useContext} from 'react';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AuthContext} from '../AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const {login} = useContext(AuthContext);
  const navigation = useNavigation();

  const [userpassword, setUserpassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !userpassword) {
      Alert.alert('Error', 'Username and Password required' );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'https://visitorApi.iecsl.in/sp_UsersAuth',

        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            username: username,
            userpassword: userpassword,
          }),
        },
      );

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok && data.message === 'Login successful') {
        await login(username);
        Alert.alert('Login Successful');
      } else {
        Alert.alert('Wrong Credentials', data.message || 'Please try again');
      }
    } catch (error) {
      
      // console.error('Login Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        marginTop: 0,
      }}>
      <View>
        <Image
          style={{
            height: 200,
            width: 200,
            marginTop: 70,
          }}
          source={require('../images/iecrmlogo.jpg')}
        />
      </View>

      <KeyboardAvoidingView style={styles.container}>
        <View
          style={{
            backgroundColor: '#D0D0D0',
            height: 50,
            width: 300,
            borderRadius: 10,
            paddingLeft: 5,
            marginBottom: 10,
            marginTop: -100,
          }}>
          <View>
            <TextInput
              style={{
                fontSize: 16,
                fontFamily: 'Kanit-Medium',
                color: '#4c4b4b',
              }}
              onChangeText={setUsername}
              placeholder="enter your Username"
              placeholderTextColor={'gray'}
            />
          </View>
        </View>

        <View
          style={{
            backgroundColor: '#D0D0D0',
            height: 50,
            width: 300,
            borderRadius: 10,
            paddingLeft: 5,
            marginTop: 30,
          }}>
          <View>
            <TextInput
              style={{
                fontSize: 16,
                color: '#4c4b4b',
                marginLeft: 10,
                fontFamily: 'Kanit-Medium',
              }}
              onChangeText={setUserpassword}
              placeholder="enter your Password"
              placeholderTextColor={'gray'}
              secureTextEntry={!isPasswordVisible}
            />

            <View
              style={{
                height: 24,
                width: 24,
                alignSelf: 'flex-end',
                marginTop: -25,
                marginRight: 25,
              }}>
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                <Image
                  style={{
                    height: 24,
                    width: 24,
                  }}
                  source={
                    isPasswordVisible
                      ? require('../images/passopen.png')
                      : require('../images/passclose.png')
                  }
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View
          style={{
            width: 120,
            alignSelf: 'flex-end',
            marginTop: 15,
          }}>
          <TouchableOpacity>
            <Text
              style={{
                color: '#38B6FF',
                fontFamily: 'Kanit-Medium',
                fontSize: 14,
              }}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={{
            height: 50,
            width: 150,
            backgroundColor: '#38B6FF',
            marginTop: 50,
            alignSelf: 'center',
            borderRadius: 15,
          }}>

          <TouchableOpacity onPress={handleLogin} disabled={loading}>

            {loading?(
               <View style={{ flex: 1, justifyContent: "center", alignItems: "center" ,backgroundColor:'#fff'}}>
               <ActivityIndicator size="large" color="#4d94ff" />
             </View>
            ): <Text
            style={{
              fontSize: 20,
              fontFamily: 'Kanit-Medium',
              alignSelf: 'center',
              padding: 10,
            }}>
            LOGIN
          </Text>}

            
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  inputcontainer: {
    width: 350,
    alignSelf: 'center',
    margin: 20,
  },

  textinput: {
    fontSize: 15,
    textDecorationColor: 'black',
    borderRadius: 50,
    borderWidth: 0.5,
    height: 50,
    paddingLeft: 15,
    color: 'black',
  },

  container: {
    flex: 1,
    justifyContent: 'center',
  },

  loginbtn: {
    backgroundColor: '#38b6ff',
    width: 350,
    height: 50,
    borderRadius: 50,
    alignSelf: 'center',
  },
});

