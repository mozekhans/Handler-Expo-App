// import { View } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import { useTheme } from '../../hooks/useTheme';

// export default function PlatformIcon({ platform, size = 24, style }) {
//   const { colors } = useTheme();
  
//   const getIconName = () => {
//     switch (platform?.toLowerCase()) {
//       case 'facebook':
//         return 'logo-facebook';
//       case 'instagram':
//         return 'logo-instagram';
//       case 'twitter':
//         return 'logo-twitter';
//       case 'linkedin':
//         return 'logo-linkedin';
//       case 'tiktok':
//         return 'logo-tiktok';
//       case 'pinterest':
//         return 'logo-pinterest';
//       case 'youtube':
//         return 'logo-youtube';
//       default:
//         return 'share-social-outline';
//     }
//   };
  
//   const getColor = () => {
//     switch (platform?.toLowerCase()) {
//       case 'facebook':
//         return '#1877F2';
//       case 'instagram':
//         return '#E4405F';
//       case 'twitter':
//         return '#1DA1F2';
//       case 'linkedin':
//         return '#0A66C2';
//       case 'tiktok':
//         return '#000000';
//       case 'pinterest':
//         return '#BD081C';
//       case 'youtube':
//         return '#FF0000';
//       default:
//         return colors.primary;
//     }
//   };
  
//   return (
//     <View style={style}>
//       <Ionicons name={getIconName()} size={size} color={getColor()} />
//     </View>
//   );
// }























import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PLATFORMS } from '../../utils/platforms';

const PlatformIcon = ({ platform, size = 40, style }) => {
  const platformInfo = PLATFORMS[platform];
  if (!platformInfo) return null;

  return (
    <View style={[
      styles.container,
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: platformInfo.color + '20',
      },
      style,
    ]}>
      <Ionicons 
        name={platformInfo.icon} 
        size={size * 0.5} 
        color={platformInfo.color} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PlatformIcon;