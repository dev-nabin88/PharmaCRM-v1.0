import React, {useEffect, useState, useCallback, useContext} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PermissionsAndroid,
  Button,
  ScrollView,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import axios from 'axios';
import {LocationContext} from '../LocationContext';


export default function DoctorScreen() {
  const {location} = useContext(LocationContext);
  const navigation = useNavigation();

  //  const [location, setLocation] = useState(null);
  //  const [hasPermission, setHasPermission] = useState(null);
  const [isAreaOpen, setIsAreaOpen] = useState(false);
  const [isDoctorOpen, setIsDoctorOpen] = useState(false);
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState();
  const [areas, setAreas] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const onAreaOpen = () => {
    setIsDoctorOpen(false);
    setIsOpen(false);
  };

  const onDoctorOpen = () => {
    setIsAreaOpen(false);
    setIsOpen(false);
  };

  const onVisitOpen = () => {
    setIsAreaOpen(false);
    setIsDoctorOpen(false);
  };

  //handling submit form data

  const handleSubmit = async () => {
    if (!selectedArea || !selectedDoctor || !item || !location) {
      alert('Please fill in all fields before submitting.');
      // console.log(postData);
      return;
    }

    const selectedAreaName = areas.find(
      area => area.value === selectedArea,
    )?.label;
    const selectedDoctorName = doctors.find(
      doc => doc.value === selectedDoctor,
    )?.label;
    // const selectedVisit_With=visitItems.find(vt => vt.value === selectedVisit_With)?.label;

    const postData = {
      selectedArea: selectedAreaName,
      selectedDoctor: selectedDoctorName,
      Visit_With: item.toString(),
      latitude: parseFloat(location.latitude), // Ensure number format
      longitute: parseFloat(location.longitude),
    };

    try {
      const response = await axios.post(
        'https://visitorApi.iecsl.in/api/DoctorDCRAPI',
        postData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        
      
        alert('Submission Successful!');
        setSelectedArea('');
        setSelectedDoctor('');
        setItem('');
        // Optionally, navigate to another screen
        // navigation.navigate('HOME');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Submission failed. Please try again.');
    }
  };

  //api for handle doctor DCR

  // Area API calling................

  useEffect(() => {
    axios
      .get('https://visitorApi.iecsl.in/api/SelectAreaAPI')
      .then(response => {
        const areaData = response.data.map(area => ({
          label: area.areaName,
          value: area.areaID,
        }));
        setAreas(areaData);
      })
      .catch(error => console.error('Error fetching areas:', error));
  }, []);

  // AreaWiseDoctor API Call...........

  useEffect(() => {
    if (selectedArea) {
      axios
        .get(
          `https://visitorApi.iecsl.in/api/SelectDoctorAPI/sp_GetDoctors?areaId=${selectedArea}`,
        )
        .then(response => {
          const doctorData = response.data.map(doc => ({
            label: doc.doctorName,
            value: doc.doctorID,
          }));
          setDoctors(doctorData);
        })
        .catch(error => console.error('Error fetching doctors:', error));
    }
  }, [selectedArea]);

  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);

  const visitItems = [
    {label: 'Manager', value: 'manager'},
    {label: 'Self', value: 'self'},
  ];

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
      }}>
      <View
        style={{
          height: 50,
          width: '100%',
          backgroundColor: '#4d94ff',
          borderBottomEndRadius: 1,
          borderBottomStartRadius: 1,
        }}>
        <View
          style={{
            height: 25,
            width: 25,
            marginLeft: 10,
          }}>
          <TouchableOpacity
            style={{
              marginTop: 10,
            }}
            onPress={() => navigation.navigate('HOME')}>
            <Image source={require('../images/leftarrow.png')} />
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: 140,
            height: 50,
            marginLeft: 50,
            marginTop: -15,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              fontFamily: 'Kanit-SemiBold',
              color: '#fff',
            }}>
            Doctor
          </Text>
        </View>
      </View>

      <View
        style={{
          backgroundColor: '#BFCAE5',
          height: 80,
          width: '80%',
          alignSelf: 'center',
          marginTop: 25,
          borderRadius: 5,
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
            alignSelf: 'center',
          }}>
          <Text
            style={{
              fontSize: 16,
              color: 'black',
              marginTop: 20,
              fontFamily: 'Kanit-SemiBold',
            }}>
            Latitude: {location?.latitude || 'fetching...'}
          </Text>

          <Text
            style={{
              fontFamily: 'Kanit-SemiBold',
              fontSize: 16,
              color: 'black',
            }}>
            Longitude: {location?.longitude || 'fetching'}
          </Text>
        </View>
      </View>

       <View style={{flex: 1, marginTop: 40,padding:5,paddingHorizontal: 20}}> 
        
          {/* Area Dropdown */}

          <View style={{zIndex: 3000}}>
            <DropDownPicker
              items={areas}
              placeholder="Select Area"
              open={isAreaOpen}
              setOpen={setIsAreaOpen}
              value={selectedArea}
              setValue={setSelectedArea}
              dropDownContainerStyle={{maxHeight: 180}}
              listMode="SCROLLVIEW"
              showTickIcon={true}
              onOpen={onAreaOpen}
              placeholderStyle={{color: 'black'}}
            />
          </View> 

          {/* Doctor Dropdown */}
          <View style={{zIndex: 2000, marginTop: 20}}>
            <DropDownPicker
              items={doctors}
              placeholder="Select Doctor"
              open={isDoctorOpen}
              setOpen={setIsDoctorOpen}
              value={selectedDoctor}
              dropDownContainerStyle={{maxHeight: 180}}
              setValue={setSelectedDoctor}
              listMode="SCROLLVIEW"
              showTickIcon={true}
              placeholderStyle={{color: 'black'}}
              disabled={!selectedArea}
              onOpen={onDoctorOpen}
            />
          </View>

          {/* Visit Type Dropdown */}

          <View style={{zIndex: 1000, marginTop: 20}}>
            <DropDownPicker
              items={visitItems}
              placeholder="Select Visit With"
              open={isOpen}
              setOpen={setIsOpen}
              value={item}
              setValue={setItem}
              listMode="SCROLLVIEW"
              disabled={!selectedDoctor}
              dropDownContainerStyle={{maxHeight: 180}}
              onOpen={onVisitOpen}
            />
          </View> 

      <View
        style={{
          marginTop:50,
          backgroundColor: '#4d94ff',
          height: 50,
          width: 340,
          alignSelf: 'center',
          borderRadius: 10,
          
        }}>
        <TouchableOpacity
          style={{
            height: 50,
            width: 340,
          }}
          onPress={handleSubmit}>
          <Text
            style={{
              fontSize: 18,
              color: '#fff',
              alignSelf: 'center',
              height: 50,
              fontFamily: 'Kanit-SemiBold',
              textAlignVertical: 'center',
            }}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  pickerContainer: {
    
    width:'90%',
    alignSelf:'center',
    marginTop:20,
    borderRadius:5,
    borderWidth:1,
    borderColor:'black',
    fontFamily:"Kanit-Regular",
  },
  label: {
    fontSize: 16,
    fontFamily:'Kanit-Regular',
    color: 'black',
    marginBottom: 5,
    
  },

  picker: {
    
    fontFamily:"Kanit-Regular",
    color:'#404040',
  },
});



