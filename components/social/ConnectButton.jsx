// import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useTheme } from '../../hooks/useTheme';

// export default function ConnectButton({ platform, onPress, loading, connected }) {
//   const { colors } = useTheme();
  
//   const getPlatformColor = () => {
//     const colors = {
//       facebook: '#1877F2',
//       instagram: '#E4405F',
//       twitter: '#1DA1F2',
//       linkedin: '#0A66C2',
//       tiktok: '#000000',
//       pinterest: '#BD081C',
//       youtube: '#FF0000',
//     };
//     return colors[platform] || colors.primary;
//   };
  
//   const getIconName = () => {
//     const icons = {
//       facebook: 'logo-facebook',
//       instagram: 'logo-instagram',
//       twitter: 'logo-twitter',
//       linkedin: 'logo-linkedin',
//       tiktok: 'logo-tiktok',
//       pinterest: 'logo-pinterest',
//       youtube: 'logo-youtube',
//     };
//     return icons[platform] || 'link-outline';
//   };
  
//   const platformColor = getPlatformColor();
  
//   return (
//     <TouchableOpacity
//       style={[
//         styles.button,
//         {
//           backgroundColor: connected ? platformColor + '20' : platformColor,
//           borderColor: platformColor,
//         },
//       ]}
//       onPress={onPress}
//       disabled={loading}
//       activeOpacity={0.8}
//     >
//       {loading ? (
//         <ActivityIndicator size="small" color={connected ? platformColor : '#fff'} />
//       ) : (
//         <>
//           <Ionicons name={getIconName()} size={20} color={connected ? platformColor : '#fff'} />
//           <Text
//             style={[
//               styles.text,
//               { color: connected ? platformColor : '#fff' },
//             ]}
//           >
//             {connected ? 'Connected' : `Connect ${platform.charAt(0).toUpperCase() + platform.slice(1)}`}
//           </Text>
//         </>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   button: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 24,
//     borderWidth: 1,
//     gap: 8,
//   },
//   text: {
//     fontSize: 14,
//     fontWeight: '600',
//   },
// });























import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import { PLATFORMS } from '../../utils/platforms';

const ConnectButton = ({ platform, onPress, loading = false, disabled = false }) => {
  const platformInfo = PLATFORMS[platform];
  if (!platformInfo) return null;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { borderColor: platformInfo.color },
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
      activeOpacity={0.7}
    >
      <Ionicons name={platformInfo.icon} size={24} color={platformInfo.color} />
      <Text style={[styles.text, { color: platformInfo.color }]}>
        {loading ? 'Connecting...' : `Connect ${platformInfo.name}`}
      </Text>
      {loading ? (
        <ActivityIndicator size="small" color={platformInfo.color} />
      ) : (
        <Ionicons name="add-circle" size={24} color={platformInfo.color} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: theme.spacing.md,
  },
});

export default ConnectButton;