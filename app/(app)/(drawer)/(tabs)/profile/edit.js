import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { launchImageLibrary } from 'expo-image-picker';
import { useAuth } from '../../../../../hooks/useAuth';
import { theme } from '../../../../../styles/theme';
import Header from '../../../../../components/common/Header';
import Avatar from '../../../../../components/common/Avatar';
import Button from '../../../../../components/common/Button';
import Input from '../../../../../components/common/Input';
import LoadingIndicator from '../../../../../components/common/LoadingIndicator';

export default function EditProfileScreen() {
  const [loading, setLoading] = useState(false);
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    avatar: user?.avatar || null,
  });

  const handleImagePick = async () => {
    const result = await launchImageLibrary({
      mediaTypes: 'images',
      quality: 0.8,
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (!result.canceled && result.assets[0]) {
      setFormData({ ...formData, avatar: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    if (!formData.firstName || !formData.lastName) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await updateProfile(formData);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Edit Profile"
        showBack={true}
        rightComponent={
          <Button
            title="Save"
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            size="sm"
          />
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={handleImagePick}>
            <Avatar
              source={formData.avatar}
              name={`${formData.firstName} ${formData.lastName}`}
              size={100}
            />
            <View style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        <Input
          label="First Name"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
          placeholder="Enter first name"
          required
        />

        <Input
          label="Last Name"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
          placeholder="Enter last name"
          required
        />

        <Input
          label="Email"
          value={formData.email}
          editable={false}
          disabled
          helper="Email cannot be changed"
        />

        <Input
          label="Phone Number"
          value={formData.phone}
          onChangeText={(text) => setFormData({ ...formData, phone: text })}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />

        <Input
          label="Bio"
          value={formData.bio}
          onChangeText={(text) => setFormData({ ...formData, bio: text })}
          placeholder="Tell us about yourself"
          multiline
          numberOfLines={4}
        />
      </ScrollView>

      {loading && <LoadingIndicator overlay />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
});