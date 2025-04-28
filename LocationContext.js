
import React, { createContext, useEffect, useState } from 'react';
import { Alert, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info'; 

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
    const [location, setLocation] = useState(null);
    const [hasPermission, setHasPermission] = useState(false);
    const [lastLocation, setLastLocation] = useState(null);

    // function to check and request location permissions
    const requestPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    title: 'Location Permission',
                    message: 'This app requires access to your location.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                setHasPermission(true);
            } else {
                setHasPermission(false);
                Alert.alert(
                    "Permission Denied",
                    "Location permission is required for this app to work properly.",
                    [{ text: "OK" }]
                );
            }
        } catch (err) {
            console.error("Permission request error:", err);
            setHasPermission(false);
        }
    };

    //check if GPS is enabled

    const checkGpsStatus = async () => {
        const isGpsEnabled = await DeviceInfo.isLocationEnabled();
        if (!isGpsEnabled) {
            Alert.alert("GPS Disabled", "Please enable GPS for accurate location tracking.");
            setLocation(null);
        }
    };

    // Get current location 
    const checkLocationEnabled = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;

                if (accuracy > 20) return; 

                setLocation({ latitude, longitude, accuracy });
            },
            (error) => {
                if (error.code === 1) {
                    setHasPermission(false);
                    Alert.alert(
                        "Location Permission Denied",
                        "Please enable location permissions in settings.",
                        [{ text: "OK", onPress: requestPermission }]
                    );
                } else if (error.code === 2) {
                    Alert.alert(
                        "Location Disabled",
                        "Please enable location",
                        [{ text: "OK" }]
                    );
                }
                setLocation(null);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
        );
    };

    useEffect(() => {
        requestPermission();
        checkGpsStatus();
    }, []);

    // check if location changes
    useEffect(() => {
        if (hasPermission) {
            const watchId = Geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude, accuracy } = position.coords;

                    if (accuracy > 20) return; 

                    //ignore small change
                    if (
                        !lastLocation ||
                        Math.abs(lastLocation.latitude - latitude) > 0.0005 ||
                        Math.abs(lastLocation.longitude - longitude) > 0.0005
                    ) {
                        setLocation({ latitude, longitude, accuracy });
                        setLastLocation({ latitude, longitude });
                    }
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    setLocation(null);
                },
                {
                    enableHighAccuracy: true,
                    distanceFilter: 50, 
                    interval: 20000, 
                    fastestInterval: 10000, 
                    maximumAge: 30000, 
                }
            );

            return () => Geolocation.clearWatch(watchId);
        }
    }, [hasPermission, lastLocation]);

    // Continuously check location 
    useEffect(() => {
        const interval = setInterval(() => {
            checkGpsStatus();
            checkLocationEnabled();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <LocationContext.Provider value={{ location }}>
            {children}
        </LocationContext.Provider>
    );
};
