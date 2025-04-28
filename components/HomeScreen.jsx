import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  View,
  Platform,
  Linking,
  StatusBar,
  Alert,
  FlatList,
  Modal,
  Pressable,
} from 'react-native';

import React, {useState, useEffect, useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {LocationContext} from '../LocationContext';
import {ScrollView} from 'react-native-gesture-handler';
import LoginScreen from './LoginScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DoctorScreen from './DoctorScreen';
import ProfileScreen from './ProfileScreen';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import {AuthContext} from '../AuthContext';

const MakeCall = () => {
  Linking.openURL('tel:+91 8597150600');
};

export default function Homescreen() {
  const {logout} = useContext(AuthContext); //logout function

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  const {location} = useContext(LocationContext);
  {
    /* #BFCAE5 */
  }

  useEffect(() => {
    requestStoragePermission();
  }, []);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.CAMERA,
        ]);
        if (
          granted['android.permission.READ_EXTERNAL_STORAGE'] !== 'granted' ||
          granted['android.permission.WRITE_EXTERNAL_STORAGE'] !== 'granted' ||
          granted['android.permission.CAMERA'] !== 'granted'
        ) {
          Alert.alert('Permissions Required', 'Please allow all permissions.');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const handleImagepic= () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    launchImageLibrary(options, async response => {
      if (!response.didCancel && !response.errorCode && response.assets?.length > 0) {
        const asset = response.assets[0];
        setSelectedImage(asset);
        setShowDownload(true);
  
       
        await AsyncStorage.setItem('selectedImageUri', asset.uri);
      }
    });
  };
  
  const downloadImage = async () => {
    if (!selectedImage) return;

    const fileName = selectedImage.fileName || 'downloaded_image.jpg';
    const downloadPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

    try {
      await RNFS.copyFile(selectedImage.uri, downloadPath );
      Alert.alert('Success', 'Image saved to Downloads!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save image.');
    }
  };

  useEffect(() => {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    // var hours = new Date().getHours(); //Current Hours
    // var min = new Date().getMinutes(); //Current Minutes
    // var sec = new Date().getSeconds(); //Current Seconds
    setCurrentDate(date + '/' + month + '/' + year + ' ');
  }, [setCurrentDate]);

  // console.log("Date",currentDate)

  //(((LogOut handling-----------------------------------------------)))

  const handleLogout = () => {
    logout();
    Alert.alert('Logout Successful', 'You have been logged out.');
  };

  const openCamera = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        setSelectedImage(response.assets[0]);
        setModalVisible(false);
      }
    });
  };

  const openFiles=()=>{
    launchImageLibrary ({mediaType: 'photo'}, response => {
      if (!response.didCancel && !response.errorCode) {
        setSelectedImage(response.assets[0]);
        setModalVisible(false);
      }
    });
  }

 

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <StatusBar backgroundColor="#4d94ff" />
      <ScrollView>
        <View
          style={{
            backgroundColor: '#4d94ff',
            width: '100%',
            height: 170,
            borderBottomLeftRadius: 100,
            // borderTopRightRadius:100,
            // borderTopLeftRadius:100,
            borderBottomRightRadius: 100,
          }}>
          <View
            style={{
              alignSelf: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontFamily: 'Kanit-Regular',
                color: 'yellow',
              }}>
              Date : {currentDate}
            </Text>
          </View>

          <View
            style={{
              padding: 5,
              backgroundColor: '#fff',
              height: 170,
              width: '70%',
              alignSelf: 'center',
              marginTop: 45,
              borderRadius: 25,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 5,
            }}>
            <View>
              <Text
                style={{
                  color: '#454545',
                  fontSize: 40,
                  fontFamily: 'Kanit-SemiBold',

                  paddingLeft: 10,
                }}>
                Hi,
              </Text>
              <Text
                style={{
                  color: '#454545',
                  fontFamily: 'Kanit-Regular',
                  fontSize: 30,
                  paddingLeft: 10,
                }}>
                Welcome!
              </Text>

              <View
                style={{
                  alignSelf: 'flex-end',
                  marginTop: -95,
                  marginRight: 25,
                }}>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                  <Image
                    style={{
                      height: 100,
                      width: 100,
                      borderRadius: 50
                    }}
                    // source={require('../images/showimg.png')}
                    source={
                      selectedImage
                        ? {uri: selectedImage.uri}
                        : require('../images/showimg.png')
                    }
                  />
                </TouchableOpacity>

                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modalVisible}
                  onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                  }}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                      <Text style={styles.modalText}>Upload Picture</Text>

                      <TouchableOpacity onPress={openCamera}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Kanit-Medium',
                            marginBottom: 10,
                          }}>
                          📷 Open Camera
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={openFiles}>
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Kanit-Medium',
                            marginBottom: 10,
                          }}>
                          🖼️ Choose From Device
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity onPress={downloadImage} >
                        <Text
                          style={{
                            fontSize: 16,
                            fontFamily: 'Kanit-Medium',
                            marginBottom: 10,
                          }}>
                           Download Image
                        </Text>
                      </TouchableOpacity>

                      <Pressable
                        style={[styles.button, styles.buttonClose]}
                        onPress={() => setModalVisible(!modalVisible)}>
                        <Text style={styles.textStyle}>close</Text>
                      </Pressable>
                    </View>
                  </View>
                </Modal>
              </View>

              <View
                style={{
                  marginTop: 5,
                  alignSelf: 'center',
                }}>
                <Text
                  style={{
                    paddingLeft: 10,
                    fontSize: 16,
                    fontFamily: 'Kanit-SemiBold',

                    color: '#4d94ff',
                  }}>
                  Latitude : {location?.latitude || 'fetching...'}
                </Text>

                <Text
                  style={{
                    paddingLeft: 10,
                    fontSize: 16,
                    fontFamily: 'Kanit-SemiBold',

                    color: '#4d94ff',
                  }}>
                  Longitude : {location?.longitude || 'fetching...'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{marginTop: 30}}>
          <View
            style={{
              padding: 5,
              backgroundColor: '#BFCAE5',
              height: 60,
              width: 60,
              alignSelf: 'flex-start',
              marginLeft: '25%',
              marginTop: 150,
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 10,
            }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('DOCTOR')}>
                <Image
                  style={{
                    height: 32,
                    width: 32,
                    alignSelf: 'center',
                  }}
                  source={require('../images/docimg.png')}
                />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'Kanit-Medium',
                  fontSize: 12,
                }}>
                Doctor
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 5,
              backgroundColor: '#BFCAE5',
              height: 60,
              width: 60,
              alignSelf: 'flex-end',
              marginTop: -60,
              marginRight: '25%',
              // marginLeft:175,
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 10,
            }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('RETAIL')}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    alignSelf: 'center',
                  }}
                  source={require('../images/retimg.png')}
                />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'Kanit-Medium',
                  fontSize: 12,
                }}>
                Retailer
              </Text>
            </View>
          </View>

          {/* <View
            style={{
              padding: 5,
              backgroundColor: '#BFCAE5',
              height: 60,
              width: 60,
              alignSelf: 'flex-end',
              marginTop: -60,
              marginRight: '50',
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 10,
            }}>
            <View>
              <TouchableOpacity onPress={ProfileScreen}>
                <Text
                  style={{
                    fontSize: 11,
                    textAlign: 'center',
                    color: 'blue',
                    fontFamily: 'Kanit-Regular',
                  }}>
                  coming soon....
                </Text>
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'Kanit-Medium',
                  fontSize: 12,
                }}>
                Profile
              </Text>
            </View>
          </View> */}

          <View
            style={{
              padding: 5,
              // backgroundColor: '#BFCAE5',
              backgroundColor: '#BFCAE5',
              height: 60,
              width: 60,
              alignSelf: 'flex-start',
              marginLeft: '25%',
              marginTop: 40,
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 10,
            }}>
            <View>
              <TouchableOpacity onPress={() => navigation.navigate('DCR')}>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    alignSelf: 'center',
                  }}
                  source={require('../images/dcr.png')}
                />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'Kanit-Medium',
                  fontSize: 12,
                }}>
                DCR
              </Text>
            </View>
          </View>

          <View
            style={{
              padding: 5,
              backgroundColor: '#BFCAE5',
              height: 60,
              width: 60,
              alignSelf: 'flex-end',
              marginTop: -60,
              marginRight: '25%',
              // marginLeft:175,
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 10,
            }}>
            <View>
              <TouchableOpacity>
                <Image
                  style={{
                    height: 30,
                    width: 30,
                    alignSelf: 'center',
                  }}
                  source={require('../images/oth.png')}
                />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'Kanit-Medium',
                  fontSize: 12,
                }}>
                Others
              </Text>
            </View>
          </View>
          {/* 
          <View
            style={{
              padding: 5,
              backgroundColor: '#BFCAE5',
              height: 60,
              width: 60,
              alignSelf: 'flex-end',
              marginTop: -60,
              marginRight: '50',
              borderRadius: 10,
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 10,
            }}>
            <View>
              <TouchableOpacity>
                <Image style={{height: 28, width: 28}} />
              </TouchableOpacity>
              <Text
                style={{
                  alignSelf: 'center',
                  fontFamily: 'Kanit-Medium',
                  fontSize: 12,
                }}>
                Products
              </Text>
            </View>
          </View> */}
        </View>

        <View
          style={{
            padding: 5,
            backgroundColor: '#76b4e8',
            height: 200,
            width: '80%',
            alignSelf: 'center',
            marginTop: 120,

            borderColor: '#000000',
            borderRadius: 25,
            shadowOffset: {
              width: 0,
              height: 1,
            },
            shadowOpacity: 0.2,
            shadowRadius: 1.41,

            elevation: 5,
          }}>
          <View
            style={{
              width: '90%',
              height: 35,
              borderRadius: 25,
              marginTop: 10,
              alignSelf: 'center',
              backgroundColor: '#ffe066',
            }}></View>

          <View
            style={{
              alignItems: 'center',
              marginTop: -30,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 16,
                fontFamily: 'Kanit-SemiBold',
              }}>
              Announcements
            </Text>
          </View>

          <View
            style={{
              marginTop: 15,
              padding: 20,
            }}>
            <Text
              style={{
                color: 'black',
                fontSize: 15,
                fontFamily: 'Kanit-Regular',
              }}>
              {currentDate} no announcements for today
            </Text>
          </View>
        </View>

        <View
          style={{
            alignSelf: 'center',
            marginTop: 55,
          }}>
          <Text
            style={{
              fontFamily: 'Kanit-Medium',
            }}>
            facing issues?
          </Text>
        </View>

        {/* help section */}

        <View style={{marginBottom: 20}}>
          <View
            style={{
              // alignSelf:'center',
              // marginLeft:125,
              // marginTop:15
              alignSelf: 'center',
              marginTop: 15,
            }}>
            <Text style={{fontFamily: 'Kanit-SemiBold', color: '#4d94ff'}}>
              Call
            </Text>
            <TouchableOpacity
              style={{marginLeft: 25, marginTop: -20}}
              onPress={MakeCall}>
              <Image
                source={require('../images/phonecall.png')}
                style={{height: 24, width: 28}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              // alignSelf:'flex-end',
              // marginRight:110,
              // marginTop:-23
              alignSelf: 'center',
              marginTop: 5,
            }}>
            <Text style={{fontFamily: 'Kanit-SemiBold', color: '#4d94ff'}}>
              or, WhatsApp
            </Text>
            <TouchableOpacity style={{marginLeft: 90, marginTop: -25}}>
              <Image
                source={require('../images/wp.png')}
                style={{height: 28, width: 28}}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flex: 1,
            marginBottom: 15,
            alignSelf: 'center',
          }}>
          <TouchableOpacity onPress={handleLogout}>
            <Text
              style={{
                fontFamily: 'Kanit-SemiBold',
              }}>
              LogOut
            </Text>

            <Image
              style={{height: 18, width: 18, marginLeft: 55, marginTop: -18}}
              source={require('../images/logoutbtn.png')}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    

  },
  modalView: {
    margin: 20,
    height: 250,
    width: '70%',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    marginTop:'100%',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginTop:20
  },
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '',
    fontSize: 18,
    fontFamily: 'Kanit-SemiBold',
  },
});
