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
import { useSubscription } from '../../../../hooks/useSubscription';
import { theme } from '../../../../styles/theme';
import Header from '../../../../components/common/Header';
import Button from '../../../../components/common/Button';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';

const plansData = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for getting started',
    features: [
      { name: 'Up to 3 social accounts', included: true },
      { name: '50 scheduled posts', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'AI content generation', included: true },
      { name: 'Team collaboration', included: false },
      { name: 'Priority support', included: false },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    monthlyPrice: 29,
    yearlyPrice: 278,
    description: 'For growing businesses',
    popular: true,
    features: [
      { name: 'Up to 10 social accounts', included: true },
      { name: 'Unlimited scheduled posts', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'AI content generation', included: true },
      { name: 'Team collaboration', included: true },
      { name: 'Email support', included: true },
    ],
  },
  {
    id: 'pro',
    name: 'Professional',
    monthlyPrice: 79,
    yearlyPrice: 758,
    description: 'For established brands',
    features: [
      { name: 'Unlimited social accounts', included: true },
      { name: 'Unlimited scheduled posts', included: true },
      { name: 'Custom analytics', included: true },
      { name: 'AI content & image generation', included: true },
      { name: 'Advanced team collaboration', included: true },
      { name: 'Priority support', included: true },
    ],
  },
];

export default function PlansScreen() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billingCycle, setBillingCycle] = useState('month');
  const { createSubscription } = useSubscription();

  const handleSubscribe = async () => {
    if (!selectedPlan) return;

    Alert.alert(
      'Confirm Subscription',
      `You're about to subscribe to the ${selectedPlan.name} plan.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Subscribe',
          onPress: async () => {
            try {
              setLoading(true);
              await createSubscription(selectedPlan.id, billingCycle);
              Alert.alert('Success', 'Subscription created successfully');
              router.back();
            } catch (err) {
              Alert.alert('Error', 'Failed to create subscription');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const getPlanPrice = (plan) => {
    return billingCycle === 'month' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getPlanSavings = (plan) => {
    if (!plan.monthlyPrice || !plan.yearlyPrice) return 0;
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = ((monthlyTotal - plan.yearlyPrice) / monthlyTotal) * 100;
    return Math.round(savings);
  };

  if (loading) {
    return <LoadingIndicator fullScreen text="Processing..." />;
  }

  return (
    <View style={styles.container}>
      <Header title="Choose a Plan" showBack={true} />

      <View style={styles.billingToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, billingCycle === 'month' && styles.toggleButtonActive]}
          onPress={() => setBillingCycle('month')}
        >
          <Text style={[styles.toggleText, billingCycle === 'month' && styles.toggleTextActive]}>
            Monthly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, billingCycle === 'year' && styles.toggleButtonActive]}
          onPress={() => setBillingCycle('year')}
        >
          <Text style={[styles.toggleText, billingCycle === 'year' && styles.toggleTextActive]}>
            Yearly
          </Text>
          <View style={styles.saveBadge}>
            <Text style={styles.saveText}>Save 20%</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {plansData.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan?.id === plan.id && styles.planCardSelected,
              plan.popular && styles.popularCard,
            ]}
            onPress={() => setSelectedPlan(plan)}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Most Popular</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              <View style={styles.planPrice}>
                <Text style={styles.planPriceValue}>${getPlanPrice(plan)}</Text>
                <Text style={styles.planPricePeriod}>/{billingCycle}</Text>
              </View>
              {billingCycle === 'year' && getPlanSavings(plan) > 0 && (
                <Text style={styles.planSavings}>Save {getPlanSavings(plan)}%</Text>
              )}
            </View>

            <Text style={styles.planDescription}>{plan.description}</Text>

            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons
                    name={feature.included ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={feature.included ? theme.colors.success : theme.colors.error}
                  />
                  <Text style={[
                    styles.featureText,
                    !feature.included && styles.featureDisabled
                  ]}>
                    {feature.name}
                  </Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.enterpriseCard}>
          <Ionicons name="business-outline" size={40} color={theme.colors.primary} />
          <Text style={styles.enterpriseTitle}>Need a custom plan?</Text>
          <Text style={styles.enterpriseText}>
            Contact us for enterprise pricing and custom features
          </Text>
          <Button
            title="Contact Sales"
            onPress={() => router.push('/help/contact-support')}
            variant="outline"
          />
        </View>

        <View style={styles.guarantee}>
          <Ionicons name="checkmark-circle" size={24} color={theme.colors.success} />
          <Text style={styles.guaranteeText}>
            30-day money-back guarantee. No questions asked.
          </Text>
        </View>

        <Button
          title={selectedPlan ? `Subscribe to ${selectedPlan.name}` : 'Select a Plan'}
          onPress={handleSubscribe}
          disabled={!selectedPlan}
          style={styles.subscribeButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  billingToggle: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    gap: 4,
  },
  toggleButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  toggleText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  toggleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  saveBadge: {
    backgroundColor: theme.colors.success,
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  saveText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  planCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  planCardSelected: {
    borderColor: theme.colors.primary,
  },
  popularCard: {
    borderColor: theme.colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -10,
    right: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: 16,
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planHeader: {
    marginBottom: theme.spacing.sm,
  },
  planName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: 2,
  },
  planPrice: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPriceValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  planPricePeriod: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  planSavings: {
    fontSize: 12,
    color: theme.colors.success,
    marginTop: 2,
  },
  planDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  planFeatures: {
    gap: theme.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  featureText: {
    fontSize: 14,
    color: theme.colors.text,
  },
  featureDisabled: {
    color: theme.colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  enterpriseCard: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  enterpriseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
    marginBottom: 2,
  },
  enterpriseText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  guarantee: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  guaranteeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  subscribeButton: {
    marginBottom: theme.spacing.xl,
  },
});