import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, FlatList, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Calendar from 'expo-calendar';
// import { Calendar } from 'react-native-calendars';
import { useBusiness } from '../../../../hooks/useBusiness';
import { useContent } from '../../../../hooks/useContent';
import { theme } from '../../../../styles/theme';
import { formatDate, formatPostTime } from '../../../../utils/formatters';
import Header from '../../../../components/common/Header';
import Card from '../../../../components/common/Card';
import LoadingIndicator from '../../../../components/common/LoadingIndicator';
import ErrorMessage from '../../../../components/common/ErrorMessage';
import EmptyState from '../../../../components/common/EmptyState';

export default function CalendarScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date(), 'yyyy-MM-dd'));
  const [markedDates, setMarkedDates] = useState({});
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [selectedDayPosts, setSelectedDayPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { currentBusiness } = useBusiness();
  const { getScheduledContent } = useContent();

  useEffect(() => {
    loadScheduledPosts();
  }, [currentBusiness]);

  useFocusEffect(
    useCallback(() => {
      loadScheduledPosts();
    }, [])
  );

  const loadScheduledPosts = async () => {
    if (!currentBusiness) return;
    
    try {
      setLoading(true);
      setError(null);
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 2);

      const posts = await getScheduledContent(currentBusiness.id, startDate, endDate);
      setScheduledPosts(posts);
      
      const marks = {};
      posts.forEach(post => {
        const date = formatDate(post.scheduledFor, 'yyyy-MM-dd');
        if (!marks[date]) {
          marks[date] = {
            marked: true,
            dotColor: theme.colors.primary,
          };
        }
      });
      
      marks[selectedDate] = {
        ...marks[selectedDate],
        selected: true,
        selectedColor: theme.colors.primary + '20',
      };
      
      setMarkedDates(marks);
    } catch (err) {
      setError(err.message || 'Failed to load scheduled posts');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadScheduledPosts();
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    
    const dayPosts = scheduledPosts.filter(post => 
      formatDate(post.scheduledFor, 'yyyy-MM-dd') === day.dateString
    );
    setSelectedDayPosts(dayPosts);
    setModalVisible(true);
  };

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: 'logo-facebook',
      instagram: 'logo-instagram',
      twitter: 'logo-twitter',
      linkedin: 'logo-linkedin',
    };
    return icons[platform] || 'globe-outline';
  };

  const renderPostItem = ({ item }) => (
    <TouchableOpacity
      style={styles.postItem}
      onPress={() => {
        setModalVisible(false);
        router.push(`/content/${item.id}`);
      }}
    >
      <View style={styles.postItemHeader}>
        <Ionicons name={getPlatformIcon(item.platforms[0])} size={20} color={theme.colors.primary} />
        <Text style={styles.postItemTime}>{formatPostTime(item.scheduledFor)}</Text>
      </View>
      <Text style={styles.postItemTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.postItemPreview} numberOfLines={2}>
        {item.content?.text}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return <LoadingIndicator fullScreen text="Loading calendar..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        fullScreen
        message={error}
        onRetry={loadScheduledPosts}
        icon="alert-circle-outline"
      />
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Calendar"
        showBack={false}
        showMenu={true}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/content/create')}>
            <Ionicons name="add" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.calendarContainer}>
          <Calendar
            markedDates={markedDates}
            onDayPress={onDayPress}
            theme={{
              backgroundColor: 'transparent',
              calendarBackground: theme.colors.surface,
              textSectionTitleColor: theme.colors.text,
              selectedDayBackgroundColor: theme.colors.primary,
              selectedDayTextColor: '#fff',
              todayTextColor: theme.colors.primary,
              dayTextColor: theme.colors.text,
              textDisabledColor: theme.colors.textSecondary,
              dotColor: theme.colors.primary,
              selectedDotColor: '#fff',
              arrowColor: theme.colors.primary,
              monthTextColor: theme.colors.text,
              textDayFontWeight: '400',
              textMonthFontWeight: '600',
              textDayHeaderFontWeight: '500',
            }}
          />
        </View>

        <View style={styles.upcomingSection}>
          <Text style={styles.sectionTitle}>Upcoming Posts</Text>
          {scheduledPosts
            .filter(post => new Date(post.scheduledFor) > new Date())
            .sort((a, b) => new Date(a.scheduledFor) - new Date(b.scheduledFor))
            .slice(0, 5)
            .map((post, index) => (
              <TouchableOpacity
                key={post.id}
                style={styles.upcomingItem}
                onPress={() => router.push(`/content/${post.id}`)}
              >
                <View style={styles.upcomingTime}>
                  <Text style={styles.upcomingDate}>
                    {formatDate(post.scheduledFor, 'MMM d')}
                  </Text>
                  <Text style={styles.upcomingTimeText}>
                    {formatPostTime(post.scheduledFor)}
                  </Text>
                </View>
                <View style={styles.upcomingContent}>
                  <Text style={styles.upcomingTitle} numberOfLines={1}>
                    {post.title}
                  </Text>
                  <View style={styles.upcomingPlatforms}>
                    {post.platforms.map((platform, i) => (
                      <Ionicons
                        key={i}
                        name={getPlatformIcon(platform)}
                        size={14}
                        color={theme.colors.textSecondary}
                        style={styles.platformIcon}
                      />
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {formatDate(selectedDate, 'MMMM d, yyyy')}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            {selectedDayPosts.length === 0 ? (
              <View style={styles.emptyModal}>
                <Ionicons name="calendar-outline" size={48} color={theme.colors.textSecondary} />
                <Text style={styles.emptyModalText}>No posts scheduled for this day</Text>
                <TouchableOpacity
                  style={styles.createPostButton}
                  onPress={() => {
                    setModalVisible(false);
                    router.push('/content/create');
                  }}
                >
                  <Text style={styles.createPostButtonText}>Schedule Post</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={selectedDayPosts}
                renderItem={renderPostItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.modalList}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  calendarContainer: {
    backgroundColor: theme.colors.surface,
    margin: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  upcomingSection: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  upcomingItem: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  upcomingTime: {
    width: 70,
    marginRight: theme.spacing.sm,
  },
  upcomingDate: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  upcomingTimeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  upcomingContent: {
    flex: 1,
  },
  upcomingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: 4,
  },
  upcomingPlatforms: {
    flexDirection: 'row',
  },
  platformIcon: {
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: theme.colors.backdrop,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  modalList: {
    padding: theme.spacing.md,
  },
  postItem: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  postItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  postItemTime: {
    fontSize: 12,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  postItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  postItemPreview: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  emptyModal: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  emptyModalText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  createPostButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  createPostButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});