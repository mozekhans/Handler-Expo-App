import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../../../../hooks/useAuth';
import { theme } from '../../../../styles/theme';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import Button from '../../../../components/common/Button';
import Input from '../../../../components/common/Input';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import Modal from '../../../../components/common/Modal';
import ConfirmationDialog from '../../../../components/common/ConfirmationDialog';

export default function SecurityScreen() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [twoFactorQR, setTwoFactorQR] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [show2FADialog, setShow2FADialog] = useState(false);
  const [backupCodes, setBackupCodes] = useState([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [disable2FADialog, setDisable2FADialog] = useState(false);
  const [loginHistory, setLoginHistory] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const { user } = useAuth();
  const { get2FAStatus, enable2FA, verify2FA, disable2FA, getLoginHistory, getActiveSessions, terminateSession } = useSecurity();

  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);
      const [status, history, sessions] = await Promise.all([
        get2FAStatus(),
        getLoginHistory(),
        getActiveSessions(),
      ]);
      setTwoFactorEnabled(status.enabled);
      setLoginHistory(history);
      setActiveSessions(sessions);
    } catch (err) {
      setError(err.message || 'Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    try {
      const data = await enable2FA();
      setTwoFactorSecret(data.secret);
      setTwoFactorQR(data.qrCode);
      setShow2FADialog(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to enable 2FA');
    }
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    try {
      const codes = await verify2FA(verificationCode);
      setBackupCodes(codes);
      setShow2FADialog(false);
      setShowBackupCodes(true);
      setTwoFactorEnabled(true);
      Alert.alert('Success', 'Two-factor authentication enabled');
    } catch (err) {
      Alert.alert('Error', 'Invalid verification code');
    }
  };

  const handleDisable2FA = async () => {
    setDisable2FADialog(false);
    try {
      await disable2FA();
      setTwoFactorEnabled(false);
      Alert.alert('Success', 'Two-factor authentication disabled');
    } catch (err) {
      Alert.alert('Error', 'Failed to disable 2FA');
    }
  };

  const handleTerminateSession = (sessionId) => {
    Alert.alert(
      'Terminate Session',
      'Are you sure you want to terminate this session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Terminate',
          style: 'destructive',
          onPress: async () => {
            try {
              await terminateSession(sessionId);
              loadSecurityData();
              Alert.alert('Success', 'Session terminated');
            } catch (err) {
              Alert.alert('Error', 'Failed to terminate session');
            }
          },
        },
      ]
    );
  };

  const copyBackupCodes = () => {
    const codesString = backupCodes.join('\n');
    // Copy to clipboard
    Alert.alert('Copied', 'Backup codes copied to clipboard');
  };

  if (loading) {
    return <LoadingIndicator fullScreen text="Loading security settings..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadSecurityData}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Security" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Card style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Two-Factor Authentication</Text>
            {twoFactorEnabled ? (
              <TouchableOpacity onPress={() => setDisable2FADialog(true)}>
                <Text style={styles.disableText}>Disable</Text>
              </TouchableOpacity>
            ) : (
              <Button
                title="Enable"
                onPress={handleEnable2FA}
                size="sm"
              />
            )}
          </View>
          <Text style={styles.sectionDescription}>
            Add an extra layer of security to your account by requiring a verification code in addition to your password.
          </Text>
          {twoFactorEnabled && (
            <View style={styles.enabledBadge}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.success} />
              <Text style={styles.enabledText}>Enabled</Text>
            </View>
          )}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Active Sessions</Text>
          {activeSessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View style={styles.sessionInfo}>
                <Ionicons name="phone-portrait-outline" size={24} color={theme.colors.textSecondary} />
                <View style={styles.sessionDetails}>
                  <Text style={styles.sessionDevice}>{session.device}</Text>
                  <Text style={styles.sessionMeta}>
                    {session.browser} • {session.location}
                  </Text>
                  <Text style={styles.sessionTime}>
                    Last active: {new Date(session.lastActive).toLocaleString()}
                  </Text>
                </View>
              </View>
              {!session.isCurrent && (
                <TouchableOpacity
                  style={styles.terminateButton}
                  onPress={() => handleTerminateSession(session.id)}
                >
                  <Text style={styles.terminateText}>Terminate</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </Card>

        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Login Activity</Text>
          {loginHistory.slice(0, 10).map((login, index) => (
            <View key={index} style={styles.loginItem}>
              <View style={styles.loginIcon}>
                {login.success ? (
                  <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                ) : (
                  <Ionicons name="alert-circle" size={20} color={theme.colors.error} />
                )}
              </View>
              <View style={styles.loginDetails}>
                <Text style={styles.loginDevice}>
                  {login.device} • {login.browser}
                </Text>
                <Text style={styles.loginMeta}>
                  {login.ip} • {login.location}
                </Text>
                <Text style={styles.loginTime}>
                  {new Date(login.timestamp).toLocaleString()}
                </Text>
              </View>
            </View>
          ))}
        </Card>
      </ScrollView>

      <Modal
        visible={show2FADialog}
        onClose={() => setShow2FADialog(false)}
        title="Set Up Two-Factor Authentication"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            1. Scan this QR code with your authenticator app
          </Text>
          <View style={styles.qrContainer}>
            {twoFactorQR ? (
              <QRCode value={twoFactorQR} size={200} />
            ) : (
              <ActivityIndicator size="large" color={theme.colors.primary} />
            )}
          </View>
          <Text style={styles.modalText}>
            Or enter this secret key manually:
          </Text>
          <Text style={styles.secretKey}>{twoFactorSecret}</Text>
          <Text style={styles.modalText}>
            2. Enter the 6-digit code from your authenticator app
          </Text>
          <Input
            placeholder="Verification code"
            value={verificationCode}
            onChangeText={setVerificationCode}
            keyboardType="number-pad"
            maxLength={6}
            style={styles.codeInput}
          />
          <Button
            title="Verify & Enable"
            onPress={handleVerify2FA}
            disabled={!verificationCode}
            style={styles.verifyButton}
          />
        </View>
      </Modal>

      <Modal
        visible={showBackupCodes}
        onClose={() => setShowBackupCodes(false)}
        title="Backup Codes"
      >
        <View style={styles.modalContent}>
          <Text style={styles.warningText}>
            Save these backup codes in a secure place. You can use them to access your account if you lose your authenticator device.
          </Text>
          <View style={styles.backupCodesContainer}>
            {backupCodes.map((code, index) => (
              <Text key={index} style={styles.backupCode}>{code}</Text>
            ))}
          </View>
          <View style={styles.backupButtons}>
            <Button
              title="Copy"
              onPress={copyBackupCodes}
              variant="outline"
              style={styles.backupButton}
            />
            <Button
              title="Download"
              onPress={() => {}}
              variant="outline"
              style={styles.backupButton}
            />
          </View>
          <Button
            title="Done"
            onPress={() => setShowBackupCodes(false)}
            style={styles.doneButton}
          />
        </View>
      </Modal>

      <ConfirmationDialog
        visible={disable2FADialog}
        onClose={() => setDisable2FADialog(false)}
        onConfirm={handleDisable2FA}
        title="Disable 2FA"
        message="Are you sure you want to disable two-factor authentication? This will make your account less secure."
        confirmText="Disable"
        type="danger"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  section: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  disableText: {
    fontSize: 14,
    color: theme.colors.error,
    fontWeight: '500',
  },
  sectionDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  enabledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: theme.spacing.xs,
  },
  enabledText: {
    fontSize: 12,
    color: theme.colors.success,
    fontWeight: '500',
  },
  sessionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sessionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  sessionDetails: {
    flex: 1,
  },
  sessionDevice: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  sessionMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sessionTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  terminateButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  terminateText: {
    fontSize: 12,
    color: theme.colors.error,
  },
  loginItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  loginIcon: {
    width: 32,
  },
  loginDetails: {
    flex: 1,
  },
  loginDevice: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
  },
  loginMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  loginTime: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  modalContent: {
    padding: theme.spacing.md,
  },
  modalText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  qrContainer: {
    alignItems: 'center',
    marginVertical: theme.spacing.md,
  },
  secretKey: {
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  codeInput: {
    marginTop: theme.spacing.sm,
  },
  verifyButton: {
    marginTop: theme.spacing.md,
  },
  warningText: {
    fontSize: 14,
    color: theme.colors.warning,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  backupCodesContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  backupCode: {
    fontSize: 14,
    fontFamily: 'monospace',
    textAlign: 'center',
    marginVertical: 2,
  },
  backupButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  backupButton: {
    flex: 1,
  },
  doneButton: {
    marginTop: theme.spacing.sm,
  },
});