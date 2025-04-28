import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUsername = await AsyncStorage.getItem("username");
      setIsLoggedIn(!!storedUsername);
    };
    checkLoginStatus();
  }, []);

  const login = async (username) => {
    await AsyncStorage.setItem("username", username);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("username");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
