// components/engagement/EngagementList.js
import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import EngagementCard from './EngagementCard';
import EmptyState from './EmptyState';
import { theme } from '../../styles/theme';

const EngagementList = ({
  engagements,
  loading,
  refreshing,
  error,
  pagination,
  onRefresh,
  onLoadMore,
  onEngagementPress,
  onEngagementLongPress,
  selectedIds = [],
  selectionMode = false,
  ListHeaderComponent,
  businessId,
  emptyStateProps = {},
}) => {
  const renderItem = useCallback(({ item }) => (
    <EngagementCard
      engagement={item}
      onPress={() => {
        if (onEngagementPress) {
          onEngagementPress(item);
        } else {
          router.push(`/engagement/${item._id}`);
        }
      }}
      onLongPress={() => onEngagementLongPress?.(item)}
      selected={selectedIds.includes(item._id)}
      selectionMode={selectionMode}
    />
  ), [selectedIds, selectionMode, onEngagementPress, onEngagementLongPress]);

  const renderFooter = () => {
    if (!loading || engagements.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
        <Text style={styles.footerText}>Loading more engagements...</Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <EmptyState
        icon="chatbubbles-outline"
        title="No Engagements Found"
        message="Your social media engagements will appear here once they start coming in."
        {...emptyStateProps}
      />
    );
  };

  const keyExtractor = useCallback((item) => item._id, []);

  return (
    <FlatList
      data={engagements}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListHeaderComponent={ListHeaderComponent}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={theme.colors.primary}
          colors={[theme.colors.primary]}
        />
      }
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.3}
      contentContainerStyle={[
        styles.listContent,
        engagements.length === 0 && styles.emptyList,
      ]}
      showsVerticalScrollIndicator={false}
      initialNumToRender={10}
      maxToRenderPerBatch={10}
      windowSize={5}
      removeClippedSubviews={true}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  emptyList: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  separator: {
    height: 8,
  },
});

export default EngagementList;