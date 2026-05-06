import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';
import Header from '../../components/common/Header';
import Card from '../../components/common/Card';

const faqCategories = [
  {
    id: 'account',
    title: 'Account & Billing',
    icon: 'person-outline',
    faqs: [
      {
        id: '1',
        question: 'How do I create an account?',
        answer: 'Click the "Sign Up" button on the login screen and fill in your details. You can also sign up using Google or Facebook for faster registration.',
      },
      {
        id: '2',
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise plans.',
      },
      {
        id: '3',
        question: 'Can I change my subscription plan?',
        answer: 'Yes, you can upgrade or downgrade your plan at any time from the Billing section in Settings. Changes will be reflected in your next billing cycle.',
      },
    ],
  },
  {
    id: 'content',
    title: 'Content Creation',
    icon: 'create-outline',
    faqs: [
      {
        id: '4',
        question: 'How do I schedule a post?',
        answer: 'Create your post, tap the calendar icon, and select your desired date and time. You can also use the calendar view to manage all scheduled posts.',
      },
      {
        id: '5',
        question: 'Can I edit a scheduled post?',
        answer: 'Yes, navigate to the calendar view, tap on the scheduled post, and select "Edit". You can modify the content or reschedule it.',
      },
      {
        id: '6',
        question: 'How does AI content generation work?',
        answer: 'Our AI analyzes your brand voice, industry, and target audience to generate engaging content. You can customize the tone, length, and style.',
      },
    ],
  },
  {
    id: 'engagement',
    title: 'Engagement',
    icon: 'chatbubbles-outline',
    faqs: [
      {
        id: '7',
        question: 'How do I respond to comments?',
        answer: 'Go to the Engagement tab, find the comment you want to respond to, and tap "Reply". You can also use AI-suggested replies for faster responses.',
      },
      {
        id: '8',
        question: 'Can I set up auto-responders?',
        answer: 'Yes, you can create auto-respond rules in Settings > Engagement to automatically reply to common queries.',
      },
    ],
  },
];

export default function FAQScreen() {
  const [expandedId, setExpandedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter(category => category.faqs.length > 0);

  return (
    <View style={styles.container}>
      <Header title="FAQ" showBack={true} />

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search FAQs..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content}>
        {filteredCategories.map((category) => (
          <View key={category.id} style={styles.category}>
            <View style={styles.categoryHeader}>
              <Ionicons name={category.icon} size={24} color={theme.colors.primary} />
              <Text style={styles.categoryTitle}>{category.title}</Text>
            </View>

            {category.faqs.map((faq) => (
              <Card key={faq.id} style={styles.faqItem}>
                <TouchableOpacity
                  style={styles.faqHeader}
                  onPress={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                >
                  <Text style={styles.faqQuestion}>{faq.question}</Text>
                  <Ionicons
                    name={expandedId === faq.id ? 'chevron-up' : 'chevron-down'}
                    size={24}
                    color={theme.colors.textSecondary}
                  />
                </TouchableOpacity>
                
                {expandedId === faq.id && (
                  <View style={styles.faqAnswer}>
                    <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                    <TouchableOpacity style={styles.helpfulButton}>
                      <Text style={styles.helpfulText}>Was this helpful?</Text>
                      <View style={styles.helpfulIcons}>
                        <Ionicons name="thumbs-up-outline" size={20} color={theme.colors.textSecondary} />
                        <Ionicons name="thumbs-down-outline" size={20} color={theme.colors.textSecondary} />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            ))}
          </View>
        ))}

        {filteredCategories.length === 0 && (
          <View style={styles.noResults}>
            <Ionicons name="search-outline" size={48} color={theme.colors.textSecondary} />
            <Text style={styles.noResultsText}>No FAQs found</Text>
            <Text style={styles.noResultsSubtext}>Try adjusting your search</Text>
          </View>
        )}

        <View style={styles.contactFooter}>
          <Text style={styles.contactFooterText}>Still need help?</Text>
          <TouchableOpacity
            style={styles.contactFooterButton}
            onPress={() => router.push('/help/contact-support')}
          >
            <Text style={styles.contactFooterButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 44,
    color: theme.colors.text,
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: theme.spacing.md,
  },
  category: {
    marginBottom: theme.spacing.lg,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  faqItem: {
    marginBottom: theme.spacing.sm,
    padding: 0,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  faqAnswer: {
    padding: theme.spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  faqAnswerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  helpfulButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  helpfulText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  helpfulIcons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  noResults: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  noResultsText: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: 4,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  contactFooter: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  contactFooterText: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  contactFooterButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
  },
  contactFooterButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});