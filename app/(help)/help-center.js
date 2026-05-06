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

const helpTopics = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'rocket-outline',
    description: 'Learn the basics of using the app',
    articleCount: 12,
  },
  {
    id: 'content-creation',
    title: 'Content Creation',
    icon: 'create-outline',
    description: 'Create and manage your posts',
    articleCount: 18,
  },
  {
    id: 'engagement',
    title: 'Engagement',
    icon: 'chatbubbles-outline',
    description: 'Manage comments and messages',
    articleCount: 15,
  },
  {
    id: 'analytics',
    title: 'Analytics',
    icon: 'stats-chart-outline',
    description: 'Understand your performance',
    articleCount: 10,
  },
  {
    id: 'campaigns',
    title: 'Campaigns',
    icon: 'megaphone-outline',
    description: 'Run successful campaigns',
    articleCount: 14,
  },
  {
    id: 'ai-features',
    title: 'AI Features',
    icon: 'bulb-outline',
    description: 'Leverage artificial intelligence',
    articleCount: 16,
  },
];

const faqs = [
  {
    question: 'How do I connect my social media accounts?',
    answer: 'Go to Settings > Integrations and select the platform you want to connect.',
  },
  {
    question: 'Can I schedule posts in advance?',
    answer: 'Yes, use the calendar feature to schedule posts for future dates.',
  },
  {
    question: 'How does AI content generation work?',
    answer: 'Our AI analyzes your brand voice and industry to generate engaging content.',
  },
];

export default function HelpCenterScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <Header title="Help Center" showBack={true} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={theme.colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for help..."
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Text style={styles.sectionTitle}>Popular Topics</Text>
        <View style={styles.topicsGrid}>
          {helpTopics.slice(0, 4).map((topic) => (
            <TouchableOpacity
              key={topic.id}
              style={styles.topicCard}
              onPress={() => router.push(`/help/topic/${topic.id}`)}
            >
              <View style={styles.topicIcon}>
                <Ionicons name={topic.icon} size={32} color={theme.colors.primary} />
              </View>
              <Text style={styles.topicTitle}>{topic.title}</Text>
              <Text style={styles.topicDescription}>{topic.description}</Text>
              <Text style={styles.topicCount}>{topic.articleCount} articles</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>All Topics</Text>
        {helpTopics.slice(4).map((topic) => (
          <TouchableOpacity
            key={topic.id}
            style={styles.topicListItem}
            onPress={() => router.push(`/help/topic/${topic.id}`)}
          >
            <View style={styles.topicListItemIcon}>
              <Ionicons name={topic.icon} size={24} color={theme.colors.primary} />
            </View>
            <View style={styles.topicListItemContent}>
              <Text style={styles.topicListItemTitle}>{topic.title}</Text>
              <Text style={styles.topicListItemDescription}>{topic.description}</Text>
            </View>
            <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        ))}

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {faqs.map((faq, index) => (
          <Card key={index} style={styles.faqItem}>
            <Text style={styles.faqQuestion}>{faq.question}</Text>
            <Text style={styles.faqAnswer} numberOfLines={2}>
              {faq.answer}
            </Text>
          </Card>
        ))}

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Still need help?</Text>
          <Text style={styles.contactText}>
            Our support team is available 24/7 to assist you
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => router.push('/help/contact-support')}
          >
            <Ionicons name="headset" size={20} color="#fff" />
            <Text style={styles.contactButtonText}>Contact Support</Text>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  topicsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  topicCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  topicDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  topicCount: {
    fontSize: 11,
    color: theme.colors.primary,
  },
  topicListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  topicListItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  topicListItemContent: {
    flex: 1,
  },
  topicListItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  topicListItemDescription: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  faqItem: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  contactSection: {
    margin: theme.spacing.md,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: theme.spacing.xs,
  },
  contactText: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    gap: theme.spacing.sm,
  },
  contactButtonText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '600',
  },
});