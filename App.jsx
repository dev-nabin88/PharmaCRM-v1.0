import React, {useContext} from 'react';
import { AuthProvider, AuthContext } from "./AuthContext";
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './components/LoginScreen';
import Homescreen from './components/HomeScreen';
import DoctorScreen from './components/DoctorScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DcrScreen from './components/DcrScreen';
import RetailScreen from './components/RetailScreen';
import DcrDetailsScreen from './components/DcrDetailsScreen';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image, View, ActivityIndicator} from 'react-native';
import {LocationProvider} from './LocationContext';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();


//

const HomeWithDrawer = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false, headerStatusBarHeight: -15}}>
      <Drawer.Screen
        name="CRM"
        component={Homescreen}
        options={{
          headerStyle: {
            backgroundColor: '#4d94ff',
          },
          headerTintColor: '#fff',
        }}
      />
    </Drawer.Navigator>
  );
};

const TabNav = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarInactiveBackgroundColor: '#fff',
        tabBarStyle: {height: 55},
      }}>
      <Tab.Screen
        name="HOME"
        component={HomeWithDrawer}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  tintColor: focused ? '#4d94ff' : 'gray',
                }}
                source={require('./images/hom.png')}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="DOCTOR"
        component={DoctorScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  tintColor: focused ? '#4d94ff' : 'gray',
                }}
                source={require('./images/doctor.png')}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="DCR"
        component={DcrScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  tintColor: focused ? '#4d94ff' : 'gray',
                }}
                source={require('./images/calldcr.png')}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="RETAIL"
        component={RetailScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <View>
              <Image
                style={{
                  height: 24,
                  width: 24,
                  tintColor: focused ? '#4d94ff' : 'gray',
                }}
                source={require('./images/retail.png')}
                resizeMode="contain"
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const AppContent = () => {
  const { isLoggedIn } = useContext(AuthContext);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" ,backgroundColor:'#fff'}}>
        <ActivityIndicator size="large" color="#4d94ff" />
      </View>
    );
  }

  return (
    <LocationProvider>
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        
        {isLoggedIn ? (
          <Stack.Screen name="AuthenticatedScreens" component={TabNav} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) }
       
        <Stack.Screen name='DcrDetails' component={DcrDetailsScreen}/>
        <Stack.Screen name='DCR' component={DcrScreen}/>


      </Stack.Navigator>
    </NavigationContainer>
    </LocationProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
   

