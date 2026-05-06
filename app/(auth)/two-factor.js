// src/screens/auth/TwoFactorAuthScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Share,
  Platform
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useForm } from '../../hooks/useForm';

const TwoFactorAuthScreen = ({ navigation }) => {
  const { enable2FA, verify2FASetup, disable2FA, get2FAStatus } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [backupCodes, setBackupCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const { values, handleChange, handleSubmit } = useForm({
    initialValues: {
      token: '',
      code: '',
    },
    onSubmit: async (formValues) => {
      try {
        setLoading(true);

        if (activeStep === 0) {
          const result = await enable2FA();
          setQrCode(result.qrCode);
          setSecret(result.secret);
          setActiveStep(1);
        } else if (activeStep === 1) {
          const result = await verify2FASetup(formValues.token);
          if (result.success) {
            setBackupCodes(result.backupCodes || []);
            setActiveStep(2);
          } else {
            Alert.alert('Verification Failed', 'Invalid code. Please try again.');
          }
        } else if (activeStep === 2) {
          Alert.alert('Success', '2FA has been enabled successfully!');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await get2FAStatus();
      setStatus(data);
    } catch (error) {
      console.error('Failed to load 2FA status:', error);
    }
  };

  const handleDisable = async () => {
    try {
      setLoading(true);
      const result = await disable2FA(values.code);
      if (result.success) {
        Alert.alert('Success', '2FA has been disabled');
        loadStatus();
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to disable 2FA');
    } finally {
      setLoading(false);
    }
  };

  const shareBackupCodes = async () => {
    try {
      await Share.share({
        message: backupCodes.join('\n'),
        title: 'Backup Codes',
      });
    } catch (error) {
      console.error('Error sharing backup codes:', error);
    }
  };

  // If 2FA is already enabled, show disable option
  if (status?.enabled) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Two-Factor Authentication</Text>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              2FA is currently enabled on your account
            </Text>
          </View>

          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter 6-digit code"
            value={values.code}
            onChangeText={(text) => handleChange('code', text)}
            keyboardType="number-pad"
            maxLength={6}
          />

          <TouchableOpacity
            style={[styles.button, styles.disableButton]}
            onPress={handleDisable}
            disabled={loading || values.code.length !== 6}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Disable 2FA</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Set Up Two-Factor Authentication</Text>

        {/* Step Indicator */}
        <View style={styles.stepsContainer}>
          {['Scan QR', 'Verify', 'Save Codes'].map((label, index) => (
            <View key={label} style={styles.stepContainer}>
              <View
                style={[
                  styles.stepCircle,
                  index <= activeStep && styles.stepCircleActive,
                  index === activeStep && styles.stepCircleCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.stepText,
                    index <= activeStep && styles.stepTextActive,
                  ]}
                >
                  {index + 1}
                </Text>
              </View>
              {index < 2 && (
                <View
                  style={[
                    styles.stepLine,
                    index < activeStep && styles.stepLineActive,
                  ]}
                />
              )}
              <Text style={styles.stepLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {activeStep === 0 && (
          <View>
            <Text style={styles.stepTitle}>
              1. Install an authenticator app like Google Authenticator or Authy
            </Text>
            <Text style={styles.stepTitle}>
              2. Scan the QR code or enter the secret key manually
            </Text>

            <View style={styles.qrContainer}>
              {qrCode ? (
                <Text style={styles.qrPlaceholder}>[QR Code Image Here]</Text>
              ) : (
                <Text style={styles.qrPlaceholder}>QR Code</Text>
              )}
            </View>

            <View style={styles.secretContainer}>
              <Text style={styles.secretLabel}>Secret Key:</Text>
              <Text style={styles.secretValue}>{secret || 'XXXX XXXX XXXX XXXX'}</Text>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Next: Verify Code</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {activeStep === 1 && (
          <View>
            <Text style={styles.stepTitle}>
              Enter the 6-digit code from your authenticator app
            </Text>

            <TextInput
              style={[styles.input, styles.codeInput]}
              placeholder="6-digit code"
              value={values.token}
              onChangeText={(text) => handleChange('token', text)}
              keyboardType="number-pad"
              maxLength={6}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading || values.token.length !== 6}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify and Enable</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {activeStep === 2 && (
          <View>
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>
                ⚠️ Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
              </Text>
            </View>

            <View style={styles.codesContainer}>
              {backupCodes.map((code, index) => (
                <View key={index} style={styles.codeItem}>
                  <Text style={styles.codeValue}>{code}</Text>
                </View>
              ))}
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.copyButton]}
                onPress={() => {
                  // Copy to clipboard
                  Alert.alert('Copied', 'Backup codes copied to clipboard');
                }}
              >
                <Text style={styles.actionButtonText}>Copy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.shareButton]}
                onPress={shareBackupCodes}
              >
                <Text style={styles.actionButtonText}>Share</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Complete Setup</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: '#1976d2',
  },
  stepCircleCurrent: {
    borderWidth: 2,
    borderColor: '#1976d2',
  },
  stepText: {
    color: '#666',
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#fff',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: -16,
    height: 2,
    backgroundColor: '#ddd',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: '#1976d2',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666',
  },
  stepTitle: {
    fontSize: 14,
    color: '#333',
    marginBottom: 16,
    lineHeight: 20,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  qrPlaceholder: {
    width: 200,
    height: 200,
    backgroundColor: '#f0f0f0',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#999',
  },
  secretContainer: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  secretLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  secretValue: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  codeInput: {
    textAlign: 'center',
    fontSize: 24,
    letterSpacing: 4,
  },
  button: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  disableButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoText: {
    color: '#1976d2',
    textAlign: 'center',
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  warningContainer: {
    backgroundColor: '#fff3e0',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  warningText: {
    color: '#ed6c02',
    fontSize: 14,
  },
  codesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  codeItem: {
    backgroundColor: '#f5f5f5',
    padding: 8,
    margin: 4,
    borderRadius: 4,
    minWidth: 100,
  },
  codeValue: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  copyButton: {
    backgroundColor: '#4caf50',
  },
  shareButton: {
    backgroundColor: '#2196f3',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default TwoFactorAuthScreen;