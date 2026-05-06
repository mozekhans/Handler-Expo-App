import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';

class AppRatingService {
  constructor() {
    this.storageKeys = {
      LAUNCH_COUNT: 'app_launch_count',
      LAST_RATED_VERSION: 'last_rated_version',
      HAS_RATED: 'has_rated',
      LAST_PROMPT_DATE: 'last_prompt_date',
    };
    this.version = Constants?.expoConfig?.version || '1.0.0';
  }

  async trackLaunch() {
    try {
      const launchCount = await AsyncStorage.getItem(this.storageKeys.LAUNCH_COUNT);
      const newCount = (launchCount ? parseInt(launchCount) : 0) + 1;
      await AsyncStorage.setItem(this.storageKeys.LAUNCH_COUNT, newCount.toString());
      
      const hasRated = await AsyncStorage.getItem(this.storageKeys.HAS_RATED);
      if (hasRated !== 'true') {
        await this.checkShouldPrompt(newCount);
      }
    } catch (error) {
      console.error('Track launch error:', error);
    }
  }

  async checkShouldPrompt(launchCount) {
    const lastPromptDate = await AsyncStorage.getItem(this.storageKeys.LAST_PROMPT_DATE);
    const lastRatedVersion = await AsyncStorage.getItem(this.storageKeys.LAST_RATED_VERSION);
    
    // Don't prompt if already rated this version
    if (lastRatedVersion === this.version) return false;
    
    // Don't prompt more than once every 7 days
    if (lastPromptDate) {
      const daysSinceLastPrompt = (Date.now() - parseInt(lastPromptDate)) / (1000 * 60 * 60 * 24);
      if (daysSinceLastPrompt < 7) return false;
    }
    
    // Prompt after 10 launches
    if (launchCount >= 10) {
      this.promptForReview();
      await AsyncStorage.setItem(this.storageKeys.LAST_PROMPT_DATE, Date.now().toString());
      return true;
    }
    
    return false;
  }

  async promptForReview() {
    try {
      const isAvailable = await StoreReview.isAvailableAsync();
      
      if (isAvailable) {
        // Use in-app review if available
        await StoreReview.requestReview();
        this.onRatingGiven(true);
      } else {
        // Fallback to opening store URL
        this.openStoreUrl();
      }
    } catch (error) {
      console.error('Prompt for review error:', error);
      this.openStoreUrl();
    }
  }

  async openStoreUrl() {
    try {
      const storeUrl = Platform.select({
        ios: `https://apps.apple.com/app/idYOUR_APP_ID`,
        android: `market://details?id=YOUR_PACKAGE_NAME`,
      });
      
      if (storeUrl) {
        await Linking.openURL(storeUrl);
        this.onRatingGiven(true);
      } else {
        this.showCustomRatingDialog();
      }
    } catch (error) {
      console.error('Open store URL error:', error);
      this.showCustomRatingDialog();
    }
  }

  showCustomRatingDialog() {
    // This would be handled by a modal component
    // The modal would be shown and call onRatingGiven when user rates
    console.log('Show custom rating dialog');
  }

  async onRatingGiven(rated, rating = null) {
    if (rated) {
      await AsyncStorage.setItem(this.storageKeys.HAS_RATED, 'true');
      await AsyncStorage.setItem(this.storageKeys.LAST_RATED_VERSION, this.version);
    }
    
    // If rating is 5 stars, prompt for review again later
    if (rating === 5) {
      // Reset launch count to prompt again after more usage
      await AsyncStorage.setItem(this.storageKeys.LAUNCH_COUNT, '0');
    }
  }

  async reset() {
    await AsyncStorage.multiRemove([
      this.storageKeys.LAUNCH_COUNT,
      this.storageKeys.LAST_RATED_VERSION,
      this.storageKeys.HAS_RATED,
      this.storageKeys.LAST_PROMPT_DATE,
    ]);
  }
}

export default new AppRatingService();