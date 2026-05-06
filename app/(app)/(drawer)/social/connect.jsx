// import { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
//   Linking,
// } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons';
// import * as WebBrowser from 'expo-web-browser';
// import * as AuthSession from 'expo-auth-session';
// import { Dimensions } from 'react-native';
// import { useTheme } from '../../../../hooks/useTheme';
// import { useSocial } from '../../../../hooks/useSocial';
// import { useBusiness } from '../../../../hooks/useBusiness';
// import Header from '../../../../components/common/Header';
// import Card from '../../../../components/common/Card';
// import Button from '../../../../components/common/Button';
// import PlatformIcon from '../../../../components/social/PlatformIcon';

// WebBrowser.maybeCompleteAuthSession();

// const PLATFORMS = [
//   {
//     id: 'facebook',
//     name: 'Facebook',
//     icon: 'logo-facebook',
//     color: '#1877F2',
//     description: 'Connect Facebook Page to manage posts, comments, and insights',
//     scopes: ['pages_manage_posts', 'pages_read_engagement', 'pages_manage_engagement'],
//   },
//   {
//     id: 'instagram',
//     name: 'Instagram',
//     icon: 'logo-instagram',
//     color: '#E4405F',
//     description: 'Connect Instagram Business account to post and track engagement',
//     scopes: ['instagram_basic', 'instagram_content_publish', 'instagram_manage_comments'],
//   },
//   {
//     id: 'twitter',
//     name: 'Twitter',
//     icon: 'logo-twitter',
//     color: '#1DA1F2',
//     description: 'Connect Twitter account to tweet and engage with your audience',
//     scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
//   },
//   {
//     id: 'linkedin',
//     name: 'LinkedIn',
//     icon: 'logo-linkedin',
//     color: '#0A66C2',
//     description: 'Connect LinkedIn Company Page for professional content',
//     scopes: ['openid', 'profile', 'email', 'w_member_social'],
//   },
//   {
//     id: 'tiktok',
//     name: 'TikTok',
//     icon: 'logo-tiktok',
//     color: '#000000',
//     description: 'Connect TikTok Business account to post videos',
//     scopes: ['user.info.basic', 'video.list', 'video.upload', 'video.publish'],
//   },
//   {
//     id: 'pinterest',
//     name: 'Pinterest',
//     icon: 'logo-pinterest',
//     color: '#BD081C',
//     description: 'Connect Pinterest Business account for visual content',
//     scopes: ['boards:read', 'boards:write', 'pins:read', 'pins:write'],
//   },
//   {
//     id: 'youtube',
//     name: 'YouTube',
//     icon: 'logo-youtube',
//     color: '#FF0000',
//     description: 'Connect YouTube channel to upload and manage videos',
//     scopes: ['youtube.upload', 'youtube.force-ssl'],
//   },
// ];

// export default function ConnectSocialScreen() {
//   const [connecting, setConnecting] = useState(false);
//   const [selectedPlatform, setSelectedPlatform] = useState(null);
//   const [authUrl, setAuthUrl] = useState(null);
  
//   const { colors } = useTheme();
//   const { currentBusiness } = useBusiness();
//   const { connectAccount, getAuthUrl, loading } = useSocial();

//   const handleConnect = async (platform) => {
//     setSelectedPlatform(platform);
//     setConnecting(true);
    
//     try {
//       // Get the current business ID
//       const businessId = currentBusiness?.id || currentBusiness?._id;
      
//       if (!businessId) {
//         Alert.alert('Error', 'No business selected. Please select a business first.');
//         setConnecting(false);
//         return;
//       }
      
//       // Create redirect URI for OAuth callback
//       const redirectUri = AuthSession.makeRedirectUri({
//         scheme: 'socialmediaai',
//         path: 'social/callback',
//       });
      
//       // Get auth URL from backend - pass businessId
//       const result = await getAuthUrl(platform.id, redirectUri, businessId);
      
//       if (result?.authUrl) {
//         setAuthUrl(result.authUrl);
        
//         // Open browser for OAuth
//         const browserResult = await WebBrowser.openAuthSessionAsync(
//           result.authUrl,
//           redirectUri
//         );
        
//         if (browserResult.type === 'success') {
//           // Parse the callback URL
//           const url = browserResult.url;
//           const params = new URLSearchParams(url.split('?')[1]);
//           const code = params.get('code');
//           const state = params.get('state');
          
//           if (code) {
//             // Connect the account - pass businessId
//             const account = await connectAccount(platform.id, code, redirectUri, businessId);
//             if (account) {
//               Alert.alert(
//                 'Success',
//                 `${platform.name} account connected successfully!`,
//                 [
//                   {
//                     text: 'View Accounts',
//                     onPress: () => router.push('/(app)/social'),
//                   },
//                   { text: 'OK', style: 'cancel' },
//                 ]
//               );
//             } else {
//               Alert.alert('Error', 'Failed to connect account');
//             }
//           }
//         } else if (browserResult.type === 'cancel') {
//           Alert.alert('Cancelled', 'Connection was cancelled');
//         }
//       }
//     } catch (error) {
//       console.error('Connection error:', error);
//       Alert.alert('Error', 'Failed to connect account. Please try again.');
//     } finally {
//       setConnecting(false);
//       setSelectedPlatform(null);
//       setAuthUrl(null);
//     }
// };

//   const renderPlatformCard = (platform) => (
//     <Card key={platform.id} style={styles.platformCard}>
//       <View style={styles.platformHeader}>
//         <View style={[styles.platformIcon, { backgroundColor: platform.color + '20' }]}>
//           <PlatformIcon platform={platform.id} size={32} />
//         </View>
//         <View style={styles.platformInfo}>
//           <Text style={[styles.platformName, { color: colors.text }]}>
//             {platform.name}
//           </Text>
//           <Text style={[styles.platformDescription, { color: colors.textSecondary }]}>
//             {platform.description}
//           </Text>
//         </View>
//       </View>
      
//       <View style={styles.scopesContainer}>
//         <Text style={[styles.scopesLabel, { color: colors.textSecondary }]}>
//           Required Permissions:
//         </Text>
//         <View style={styles.scopesList}>
//           {platform.scopes.map((scope, index) => (
//             <View key={index} style={[styles.scopeBadge, { backgroundColor: colors.primary + '10' }]}>
//               <Ionicons name="checkmark-circle" size={12} color={colors.primary} />
//               <Text style={[styles.scopeText, { color: colors.primary }]}>
//                 {scope.replace(/_/g, ' ')}
//               </Text>
//             </View>
//           ))}
//         </View>
//       </View>
      
//       <Button
//         title={connecting && selectedPlatform?.id === platform.id ? "Connecting..." : `Connect ${platform.name}`}
//         onPress={() => handleConnect(platform)}
//         loading={connecting && selectedPlatform?.id === platform.id}
//         disabled={connecting}
//         icon={<Ionicons name="link-outline" size={20} color="#fff" />}
//         style={styles.connectButton}
//       />
//     </Card>
//   );

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <Header title="Connect Social Account" showBack={true} />

//       <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
//         <View style={styles.headerSection}>
//           <Text style={[styles.title, { color: colors.text }]}>
//             Connect Your Social Media
//           </Text>
//           <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
//             Connect your social media accounts to start managing content, tracking analytics, and engaging with your audience.
//           </Text>
//         </View>

//         {PLATFORMS.map(renderPlatformCard)}

//         <View style={styles.infoSection}>
//           <View style={[styles.infoIcon, { backgroundColor: colors.info + '20' }]}>
//             <Ionicons name="shield-checkmark" size={24} color={colors.info} />
//           </View>
//           <Text style={[styles.infoTitle, { color: colors.text }]}>Secure Connection</Text>
//           <Text style={[styles.infoText, { color: colors.textSecondary }]}>
//             We use OAuth 2.0 for secure authentication. We never store your passwords and only request necessary permissions.
//           </Text>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     padding: 16,
//     paddingBottom: 32,
//   },
//   headerSection: {
//     marginBottom: 24,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 14,
//     lineHeight: 20,
//   },
//   platformCard: {
//     padding: 16,
//     marginBottom: 16,
//   },
//   platformHeader: {
//     flexDirection: 'row',
//     marginBottom: 16,
//   },
//   platformIcon: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 16,
//   },
//   platformInfo: {
//     flex: 1,
//   },
//   platformName: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   platformDescription: {
//     fontSize: 13,
//     lineHeight: 18,
//   },
//   scopesContainer: {
//     marginBottom: 16,
//   },
//   scopesLabel: {
//     fontSize: 12,
//     marginBottom: 8,
//   },
//   scopesList: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 8,
//   },
//   scopeBadge: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 12,
//     gap: 4,
//   },
//   scopeText: {
//     fontSize: 10,
//     fontWeight: '500',
//   },
//   connectButton: {
//     marginTop: 8,
//   },
//   infoSection: {
//     alignItems: 'center',
//     padding: 20,
//     marginTop: 16,
//     borderRadius: 16,
//     backgroundColor: '#F5F5F5',
//   },
//   infoIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   infoTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
//   infoText: {
//     fontSize: 13,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
// });



























// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   ScrollView,
//   StyleSheet,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import { router } from 'expo-router';
// import * as WebBrowser from 'expo-web-browser';
// import * as Linking from 'expo-linking';
// import * as AuthSession from 'expo-auth-session';
// import Header from '../../../../components/common/Header';
// import ConnectButton from '../../../../components/social/ConnectButton';
// import socialService from '../../../../services/socialService';
// import useBusiness from '../../../../hooks/businessHooks/useBusiness';
// import { useBusinessStore } from '../../../../stores/businessStore';
// import { PLATFORMS, PLATFORM_LIST } from '../../../../utils/platforms';
// import { theme } from '../../../../styles/theme';

// export default function ConnectPlatformScreen() {
//   const [connecting, setConnecting] = useState(null);
//   const currentBusiness = useBusinessStore(state => state.currentBusiness);
  

//   const businessId = currentBusiness?._id || currentBusiness?.id;


// // const handleConnect = async (platform) => {
// //   try {
// //     const businessId =
// //       currentBusiness?._id || currentBusiness?.id;

// //     if (!businessId) {
// //       console.log('currentBusiness:', currentBusiness);

// //       Alert.alert(
// //         'Business Not Loaded',
// //         'Please wait for business data to load.'
// //       );
// //       return;
// //     }

// //     setConnecting(platform);

// //     // const redirectUri = AuthSession.makeRedirectUri({
// //     //   scheme: 'socialmediaai',
// //     //   path: 'integrations/callback',
// //     // });
// //     const redirectUri = Linking.createURL('social/callback');

// //     console.log('businessId:', businessId);

// //     const response = await socialService.getAuthUrl(
// //       businessId,
// //       platform,
// //       redirectUri
// //     );

// //     console.log('OAuth response:', response);

// //     if (!response?.authUrl) {
// //       throw new Error('Missing authUrl from backend');
// //     }

// //     const result = await WebBrowser.openAuthSessionAsync(
// //       response.authUrl,
// //       redirectUri
// //     );

// //     console.log('Auth result:', result);

// //     if (result.type === 'success') {
// //       Alert.alert('Success', 'Account connected successfully!', [
// //         {
// //           text: 'OK',
// //           onPress: () => router.back(),
// //         },
// //       ]);
// //     }
// //   } catch (error) {
// //     console.error('Connection error:', error);

// //     Alert.alert(
// //       'Connection Failed',
// //       error?.response?.data?.message ||
// //         error.message ||
// //         'Failed to connect account'
// //     );
// //   } finally {
// //     setConnecting(null);
// //   }
// // };



// WebBrowser.maybeCompleteAuthSession();

// const handleConnect = async (platform) => {
//   try {
//     setConnecting(platform);

//     const businessId = currentBusiness?._id || currentBusiness?.id;

//     const redirectUri = Linking.createURL('social/callback');

//     const response = await socialService.getAuthUrl(
//       businessId,
//       platform,
//       redirectUri
//     );

//     if (!response?.authUrl) {
//       throw new Error('Missing authUrl');
//     }

//     const result = await WebBrowser.openAuthSessionAsync(
//       response.authUrl,
//       redirectUri
//     );

//     console.log('Auth result:', result);

//     if (result.type === 'success') {
//       router.push('/(app)/social');
//     }

//   } catch (err) {
//     console.error(err);
//   } finally {
//     setConnecting(null);
//   }
// };

//   return (
//     <View style={styles.container}>
//       <Header title="Connect Platform" showBack />
//       <ScrollView
//         contentContainerStyle={styles.content}
//         showsVerticalScrollIndicator={false}
//       >
//         <Text style={styles.title}>Select a Platform</Text>
//         <Text style={styles.subtitle}>
//           Connect your social media accounts to manage them from one place
//         </Text>

//         {PLATFORM_LIST.map((platform) => {
//           const platformInfo = PLATFORMS[platform];
//           return (
//             <ConnectButton
//               key={platform}
//               platform={platform}
//               onPress={() => handleConnect(platform)}
//               loading={connecting === platform}
//               disabled={connecting !== null && connecting !== platform}
//             />
//           );
//         })}

//         {connecting && (
//           <View style={styles.connectingContainer}>
//             <ActivityIndicator size="small" color={theme.colors.primary} />
//             <Text style={styles.connectingText}>
//               Redirecting to {PLATFORMS[connecting]?.name}...
//             </Text>
//           </View>
//         )}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: theme.colors.background,
//   },
//   content: {
//     padding: theme.spacing.md,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: theme.colors.text,
//     marginBottom: theme.spacing.xs,
//   },
//   subtitle: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     marginBottom: theme.spacing.lg,
//     lineHeight: 20,
//   },
//   connectingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: theme.spacing.md,
//   },
//   connectingText: {
//     fontSize: 14,
//     color: theme.colors.textSecondary,
//     marginLeft: theme.spacing.sm,
//   },
// });






































// app/(app)/social/connect.jsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as IntentLauncher from 'expo-intent-launcher';
import Header from '../../../../components/common/Header';
import ConnectButton from '../../../../components/social/ConnectButton';
import socialService from '../../../../services/socialService';
import { useBusinessStore } from '../../../../stores/businessStore';
import { PLATFORMS, PLATFORM_LIST } from '../../../../utils/platforms';
import { theme } from '../../../../styles/theme';

WebBrowser.maybeCompleteAuthSession();

export default function ConnectPlatformScreen() {
  const [connecting, setConnecting] = useState(null);
  const [error, setError] = useState(null);
  const currentBusiness = useBusinessStore(state => state.currentBusiness);
  const businessId = currentBusiness?._id || currentBusiness?.id;

  const openAuthWithFallback = async (authUrl, redirectUri, platform) => {
    console.log('Opening auth URL with fallback...');
    console.log('Auth URL:', authUrl?.substring(0, 100) + '...');
    console.log('Redirect URI:', redirectUri);

    try {
      // First, try to warm up the browser (Android only)
      if (Platform.OS === 'android') {
        try {
          await WebBrowser.warmUpAsync();
          console.log('Browser warmed up successfully');
        } catch (error) {
          console.warn('Browser warm up failed:', error);
        }
      }

      // Try multiple methods to open the browser
      let result;

      // Method 1: Try openAuthSessionAsync with custom options
      try {
        console.log('Attempting Method 1: openAuthSessionAsync with custom options');
        result = await WebBrowser.openAuthSessionAsync(
          authUrl,
          redirectUri,
          {
            showInRecents: false,
            createTask: false,
            toolbarColor: theme.colors.primary,
            browserPackage: Platform.OS === 'android' ? 'com.android.chrome' : undefined,
          }
        );
        console.log('Method 1 result:', result);
      } catch (error1) {
        console.warn('Method 1 failed:', error1.message);

        // Method 2: Try openAuthSessionAsync without custom options
        try {
          console.log('Attempting Method 2: openAuthSessionAsync default options');
          result = await WebBrowser.openAuthSessionAsync(
            authUrl,
            redirectUri
          );
          console.log('Method 2 result:', result);
        } catch (error2) {
          console.warn('Method 2 failed:', error2.message);

          // Method 3: Try openBrowserAsync
          try {
            console.log('Attempting Method 3: openBrowserAsync');
            result = await WebBrowser.openBrowserAsync(authUrl);
            console.log('Method 3 result:', result);
            
            // For openBrowserAsync, we need to manually handle the callback
            // Listen for deep links
            return {
              type: 'success',
              url: null
            };
          } catch (error3) {
            console.warn('Method 3 failed:', error3.message);

            // Method 4: Try IntentLauncher for Android
            if (Platform.OS === 'android') {
              try {
                console.log('Attempting Method 4: IntentLauncher');
                await IntentLauncher.startActivityAsync(
                  'android.intent.action.VIEW',
                  {
                    data: authUrl,
                    flags: 268435456 // FLAG_ACTIVITY_NEW_TASK
                  }
                );
                
                return {
                  type: 'success',
                  url: null
                };
              } catch (error4) {
                console.warn('Method 4 failed:', error4.message);
              }
            }

            // Method 5: Last resort - try Linking.openURL
            try {
              console.log('Attempting Method 5: Linking.openURL');
              const canOpen = await Linking.canOpenURL(authUrl);
              if (canOpen) {
                await Linking.openURL(authUrl);
                return {
                  type: 'success',
                  url: null
                };
              }
            } catch (error5) {
              console.warn('Method 5 failed:', error5.message);
            }

            // If all methods fail, show manual instructions
            throw new Error(
              'Unable to open browser automatically. Please try these steps:\n\n' +
              '1. Open Chrome browser manually\n' +
              '2. Go to this URL:\n' + authUrl.substring(0, 50) + '...\n' +
              '3. You will be redirected back to the app'
            );
          }
        }
      }

      return result;

    } finally {
      // Cool down browser
      if (Platform.OS === 'android') {
        try {
          await WebBrowser.coolDownAsync();
        } catch (error) {
          console.warn('Browser cool down failed:', error);
        }
      }
    }
  };

  const handleConnect = async (platform) => {
    try {
      setConnecting(platform);
      setError(null);

      // Validate business ID
      if (!businessId) {
        Alert.alert(
          'Business Not Found',
          'Please wait for business data to load or select a business first.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Create redirect URI
      const redirectUri = Linking.createURL('social/callback');
      console.log('Redirect URI:', redirectUri);

      // Get auth URL from backend
      console.log('Fetching auth URL for platform:', platform);
      const response = await socialService.getAuthUrl(
        businessId,
        platform,
        redirectUri
      );

      if (!response?.authUrl) {
        throw new Error('Failed to get authorization URL');
      }

      console.log('Auth URL received successfully');

      // Open browser with fallback methods
      const result = await openAuthWithFallback(
        response.authUrl,
        redirectUri,
        platform
      );

      console.log('Final result:', result);

      if (result?.type === 'success' || result?.type === 'opened') {
        // Check if we got a URL back (direct callback)
        if (result.url) {
          const { url } = result;
          const params = new URLSearchParams(url.split('?')[1]);
          const code = params.get('code');
          
          if (code) {
            console.log('Got code directly from callback');
            // Navigate to callback screen with code
            router.replace({
              pathname: '/social/callback',
              params: { code, platform }
            });
          }
        } else {
          // Browser was opened successfully, show success message
          Alert.alert(
            'Authorization Started',
            `Please complete the authorization in your browser.\n\nAfter authorization, you'll be automatically redirected back to the app.`,
            [
              {
                text: 'OK',
                onPress: () => router.replace('/(app)/social')
              }
            ]
          );
        }
      } else if (result?.type === 'cancel') {
        Alert.alert(
          'Cancelled',
          'Authorization was cancelled. You can try again when ready.',
          [{ text: 'OK' }]
        );
      }

    } catch (err) {
      console.error('Connection error:', err);
      
      let errorMessage = err.message || 'Failed to connect account. Please try again.';
      
      setError(errorMessage);
      
      Alert.alert(
        'Connection Failed',
        errorMessage,
        [
          { 
            text: 'Try Again', 
            onPress: () => handleConnect(platform) 
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          }
        ]
      );
    } finally {
      setConnecting(null);
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Connect Platform" showBack />
      
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Select a Platform</Text>
        <Text style={styles.subtitle}>
          Connect your social media accounts to manage them from one place
        </Text>

        {/* Debug Info - Remove in production */}
        {__DEV__ && (
          <View style={styles.debugContainer}>
            <Text style={styles.debugText}>
              Platform: {Platform.OS} {Platform.Version}
            </Text>
            <Text style={styles.debugText}>
              Business ID: {businessId || 'Not loaded'}
            </Text>
          </View>
        )}

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Platform Buttons */}
        {PLATFORM_LIST.map((platform) => {
          const platformInfo = PLATFORMS[platform];
          return (
            <ConnectButton
              key={platform}
              platform={platform}
              onPress={() => handleConnect(platform)}
              loading={connecting === platform}
              disabled={connecting !== null && connecting !== platform}
            />
          );
        })}

        {/* Connecting Indicator */}
        {connecting && (
          <View style={styles.connectingContainer}>
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text style={styles.connectingText}>
              Opening {PLATFORMS[connecting]?.name} authorization...
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  debugContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 12,
    marginBottom: theme.spacing.md,
  },
  debugText: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: 'monospace',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 12,
    marginBottom: theme.spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 14,
    lineHeight: 20,
  },
  connectingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  connectingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
});