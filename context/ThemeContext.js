import React, { createContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { lightTheme, darkTheme } from "../styles/theme";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState("system");
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  useEffect(() => {
    loadThemePreference();
  }, []);

  useEffect(() => {
    if (theme === "system") {
      setIsDarkMode(systemColorScheme === "dark");
    }
  }, [systemColorScheme, theme]);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
        if (savedTheme !== "system") {
          setIsDarkMode(savedTheme === "dark");
        }
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setTheme(newTheme);
    setIsDarkMode(!isDarkMode);
    await AsyncStorage.setItem("theme", newTheme);
  };

  const setThemeMode = async (mode) => {
    setTheme(mode);
    if (mode !== "system") {
      setIsDarkMode(mode === "dark");
    } else {
      setIsDarkMode(systemColorScheme === "dark");
    }
    await AsyncStorage.setItem("theme", mode);
  };

  // const colors = isDarkMode ? darkTheme : lightTheme;

  // const value = {
  //   theme,
  //   isDarkMode,
  //   colors,
  //   toggleTheme,
  //   setThemeMode
  // };

  const themeObject = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    colors: themeObject.colors, // ✅ only expose colors
    toggleTheme,
    setThemeMode,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
