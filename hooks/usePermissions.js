import { useState, useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export const usePermissions = () => {
  const [cameraPermission, setCameraPermission] = useState(null);
  const [storagePermission, setStoragePermission] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(null);

  const checkCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

      const status = await check(permission);
      setCameraPermission(status);
      return status === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error checking camera permission:', error);
      return false;
    }
  };

  const requestCameraPermission = async () => {
    try {
      const permission = Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA;

      const status = await request(permission);
      setCameraPermission(status);
      return status === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const checkStoragePermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
        const status = await check(permission);
        setStoragePermission(status);
        return status === RESULTS.GRANTED;
      } else {
        const status = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        setStoragePermission(status ? RESULTS.GRANTED : RESULTS.DENIED);
        return status;
      }
    } catch (error) {
      console.error('Error checking storage permission:', error);
      return false;
    }
  };

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'ios') {
        const permission = PERMISSIONS.IOS.PHOTO_LIBRARY;
        const status = await request(permission);
        setStoragePermission(status);
        return status === RESULTS.GRANTED;
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage to upload media.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        setStoragePermission(granted === PermissionsAndroid.RESULTS.GRANTED ? RESULTS.GRANTED : RESULTS.DENIED);
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      return false;
    }
  };

  return {
    cameraPermission,
    storagePermission,
    notificationPermission,
    checkCameraPermission,
    requestCameraPermission,
    checkStoragePermission,
    requestStoragePermission,
  };
};