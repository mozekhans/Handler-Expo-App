// app/engagement/assign/[id].js
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../../../../components/common/Header';
import engagementService from '../../../../../services/engagementService';
import teamService from '../../../../../services/businessApi';
import { useEngagementActions } from '../../../../../hooks/useEngagementActions';
import { useAuth } from '../../../../../context/AuthContext';
import { theme } from '../../../../../styles/theme';

export default function AssignEngagementScreen() {
  const router = useRouter();
  const { id, businessId: paramBusinessId, engagementId: paramEngagementId } = useLocalSearchParams();
  const { business, user } = useAuth();
  
  const [teamMembers, setTeamMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [engagement, setEngagement] = useState(null);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'workload', 'role'

  const engagementIdToUse = id || paramEngagementId;
  const businessIdToUse = paramBusinessId || business?._id;
  const { assignEngagement } = useEngagementActions(businessIdToUse);

  useEffect(() => {
    if (engagementIdToUse) {
      fetchData();
    }
  }, [engagementIdToUse]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [teamRes, engagementRes] = await Promise.all([
        teamService.getTeamMembers(businessIdToUse),
        engagementService.getEngagement(businessIdToUse, engagementIdToUse),
      ]);

      const members = teamRes.members || teamRes.data?.members || [];
      setTeamMembers(members);
      setFilteredMembers(members);
      setEngagement(engagementRes.engagement || engagementRes.data?.engagement);

      // Pre-select currently assigned member
      const currentAssignee = engagementRes.engagement?.assignedTo;
      if (currentAssignee) {
        const assignedMember = members.find(m => m._id === currentAssignee._id);
        if (assignedMember) {
          setSelectedMember(assignedMember);
        }
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Error', 'Failed to load team members. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredMembers(teamMembers);
      return;
    }

    const searchLower = query.toLowerCase();
    const filtered = teamMembers.filter(member =>
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchLower) ||
      member.email?.toLowerCase().includes(searchLower) ||
      member.role?.toLowerCase().includes(searchLower) ||
      member.department?.toLowerCase().includes(searchLower)
    );
    setFilteredMembers(filtered);
  }, [teamMembers]);

  const sortMembers = useCallback((members) => {
    switch (sortBy) {
      case 'workload':
        return [...members].sort((a, b) => (a.activeTasks || 0) - (b.activeTasks || 0));
      case 'role':
        return [...members].sort((a, b) => (a.role || '').localeCompare(b.role || ''));
      case 'name':
      default:
        return [...members].sort((a, b) => 
          `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
        );
    }
  }, [sortBy]);

  const sortedMembers = useMemo(() => 
    sortMembers(filteredMembers), 
    [filteredMembers, sortMembers]
  );

  const handleAssign = async () => {
    if (!selectedMember) {
      Alert.alert('Selection Required', 'Please select a team member to assign this engagement to.');
      return;
    }

    setAssigning(true);
    try {
      const response = await assignEngagement(engagementIdToUse, selectedMember._id);
      
      Alert.alert(
        'Assignment Successful',
        `Engagement assigned to ${selectedMember.firstName} ${selectedMember.lastName}`,
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to assign engagement. Please try again.';
      Alert.alert('Assignment Failed', errorMessage);
    } finally {
      setAssigning(false);
    }
  };

  const handleUnassign = async () => {
    if (!engagement?.assignedTo) return;

    Alert.alert(
      'Unassign Engagement',
      `Remove assignment from ${engagement.assignedTo.firstName} ${engagement.assignedTo.lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unassign',
          style: 'destructive',
          onPress: async () => {
            setAssigning(true);
            try {
              await assignEngagement(engagementIdToUse, null);
              Alert.alert('Success', 'Engagement unassigned successfully', [
                { text: 'OK', onPress: () => router.back() },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to unassign engagement');
            } finally {
              setAssigning(false);
            }
          },
        },
      ]
    );
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: '#F44336',
      owner: '#E91E63',
      manager: '#FF9800',
      moderator: '#9C27B0',
      member: '#2196F3',
      viewer: '#4CAF50',
    };
    return colors[role?.toLowerCase()] || '#9E9E9E';
  };

  const renderMember = ({ item }) => {
    const isSelected = selectedMember?._id === item._id;
    const isCurrentlyAssigned = engagement?.assignedTo?._id === item._id;
    const isCurrentUser = item._id === user?._id;
    const workload = item.activeTasks || 0;

    return (
      <TouchableOpacity
        style={[
          styles.memberCard,
          isSelected && styles.memberCardSelected,
          isCurrentlyAssigned && styles.memberCardAssigned,
        ]}
        onPress={() => setSelectedMember(isSelected ? null : item)}
        activeOpacity={0.7}
      >
        <View style={styles.memberLeft}>
          <Image
            source={{ 
              uri: item.avatar || 'https://via.placeholder.com/50',
              cache: 'force-cache'
            }}
            style={styles.avatar}
          />
          {item.isOnline && <View style={styles.onlineDot} />}
        </View>

        <View style={styles.memberInfo}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName} numberOfLines={1}>
              {item.firstName} {item.lastName}
            </Text>
            {isCurrentUser && (
              <View style={styles.youBadge}>
                <Text style={styles.youText}>You</Text>
              </View>
            )}
            {isCurrentlyAssigned && (
              <View style={styles.assignedIndicator}>
                <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
              </View>
            )}
          </View>

          <Text style={styles.memberEmail} numberOfLines={1}>
            {item.email}
          </Text>

          <View style={styles.memberMeta}>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) + '20' }]}>
              <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
                {item.role || 'Member'}
              </Text>
            </View>

            {item.department && (
              <Text style={styles.departmentText}>{item.department}</Text>
            )}
          </View>

          <View style={styles.workloadBar}>
            <View style={styles.workloadInfo}>
              <Text style={styles.workloadLabel}>Active Tasks</Text>
              <Text style={[
                styles.workloadValue,
                workload > 10 ? styles.workloadHigh : workload > 5 ? styles.workloadMedium : null,
              ]}>
                {workload}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { 
                  width: `${Math.min(workload / 15 * 100, 100)}%`,
                  backgroundColor: workload > 10 ? '#F44336' : workload > 5 ? '#FF9800' : '#4CAF50',
                },
              ]} />
            </View>
          </View>
        </View>

        <View style={styles.memberActions}>
          {isSelected ? (
            <View style={styles.radioSelected}>
              <Ionicons name="checkmark" size={16} color="white" />
            </View>
          ) : (
            <View style={styles.radio} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Engagement Context */}
      {engagement && (
        <View style={styles.engagementContext}>
          <View style={styles.engagementHeader}>
            <View style={styles.engagementType}>
              <Ionicons
                name={
                  engagement.type === 'comment' ? 'chatbubble' :
                  engagement.type === 'message' ? 'mail' :
                  engagement.type === 'mention' ? 'at' : 'notifications'
                }
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.engagementTypeText}>
                {engagement.type?.charAt(0).toUpperCase() + engagement.type?.slice(1)}
              </Text>
            </View>
            {engagement.priority && (
              <View style={[
                styles.priorityBadge,
                { 
                  backgroundColor: 
                    engagement.priority === 'urgent' ? '#F4433620' :
                    engagement.priority === 'high' ? '#FF980020' : '#4CAF5020',
                },
              ]}>
                <Text style={[
                  styles.priorityText,
                  {
                    color:
                      engagement.priority === 'urgent' ? '#F44336' :
                      engagement.priority === 'high' ? '#FF9800' : '#4CAF50',
                  },
                ]}>
                  {engagement.priority.toUpperCase()}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.engagementContent} numberOfLines={2}>
            {engagement.content?.text || 'No content'}
          </Text>
          <View style={styles.engagementFooter}>
            <Ionicons name="person" size={12} color={theme.colors.textSecondary} />
            <Text style={styles.engagementUser} numberOfLines={1}>
              {engagement.user?.name || engagement.user?.username || 'Unknown'}
            </Text>
            <Text style={styles.engagementDot}>•</Text>
            <Ionicons
              name={`logo-${engagement.platform}`}
              size={12}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.engagementPlatform}>
              {engagement.platform}
            </Text>
          </View>
        </View>
      )}

      {/* Current Assignment */}
      <View style={styles.currentSection}>
        <Text style={styles.sectionTitle}>Current Assignment</Text>
        <View style={styles.currentCard}>
          {engagement?.assignedTo ? (
            <View style={styles.currentAssignee}>
              <Image
                source={{ uri: engagement.assignedTo.avatar || 'https://via.placeholder.com/40' }}
                style={styles.currentAvatar}
              />
              <View style={styles.currentInfo}>
                <Text style={styles.currentName}>
                  {engagement.assignedTo.firstName} {engagement.assignedTo.lastName}
                </Text>
                <Text style={styles.currentEmail}>{engagement.assignedTo.email}</Text>
                <Text style={styles.currentAssignedAt}>
                  Assigned {new Date(engagement.assignedAt || engagement.updatedAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleUnassign}
                style={styles.unassignButton}
                disabled={assigning}
              >
                <Ionicons name="close-circle" size={22} color="#F44336" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.unassignedRow}>
              <Ionicons name="person-outline" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.unassignedText}>Not assigned to anyone yet</Text>
            </View>
          )}
        </View>
      </View>

      {/* Search and Sort */}
      <View style={styles.listControls}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={theme.colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search team members..."
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor={theme.colors.textSecondary}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sortButtons}>
          {[
            { key: 'name', label: 'Name' },
            { key: 'workload', label: 'Workload' },
            { key: 'role', label: 'Role' },
          ].map((sort) => (
            <TouchableOpacity
              key={sort.key}
              style={[styles.sortButton, sortBy === sort.key && styles.sortButtonActive]}
              onPress={() => setSortBy(sort.key)}
            >
              <Text style={[
                styles.sortText,
                sortBy === sort.key && styles.sortTextActive,
              ]}>
                {sort.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Team Members List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.sectionTitle}>
          Team Members ({sortedMembers.length})
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Assign Engagement" showBack />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading team members...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="Assign Engagement"
        showBack
        rightComponent={
          <TouchableOpacity
            onPress={handleAssign}
            disabled={!selectedMember || assigning}
            style={[
              styles.headerAssignButton,
              (!selectedMember || assigning) && styles.headerAssignButtonDisabled,
            ]}
          >
            {assigning ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={[
                styles.headerAssignText,
                (!selectedMember || assigning) && styles.headerAssignTextDisabled,
              ]}>
                Assign
              </Text>
            )}
          </TouchableOpacity>
        }
      />

      <FlatList
        data={sortedMembers}
        renderItem={renderMember}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Team Members Found</Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'No members match your search criteria'
                : 'Add team members to your business to assign engagements'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                style={styles.inviteButton}
                onPress={() => router.push('/settings/team/invite')}
              >
                <Ionicons name="person-add" size={18} color="white" />
                <Text style={styles.inviteButtonText}>Invite Team Members</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 12,
  },
  headerAssignButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
  },
  headerAssignButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  headerAssignText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
  headerAssignTextDisabled: {
    color: theme.colors.textSecondary,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  engagementContext: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
    ...theme.shadows.small,
  },
  engagementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  engagementType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementTypeText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  engagementContent: {
    fontSize: 14,
    color: theme.colors.text,
    lineHeight: 20,
    marginBottom: 8,
  },
  engagementFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  engagementUser: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  engagementDot: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  engagementPlatform: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textTransform: 'capitalize',
  },
  currentSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  currentCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  currentAssignee: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  currentInfo: {
    flex: 1,
  },
  currentName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  currentEmail: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  currentAssignedAt: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  unassignButton: {
    padding: 8,
  },
  unassignedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 8,
  },
  unassignedText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  listControls: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontSize: 14,
    color: theme.colors.text,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sortButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sortText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  sortTextActive: {
    color: 'white',
  },
  listHeader: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...theme.shadows.small,
  },
  memberCardSelected: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primaryLight + '10',
  },
  memberCardAssigned: {
    borderColor: '#4CAF50',
    backgroundColor: '#4CAF5010',
  },
  memberLeft: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.background,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  memberInfo: {
    flex: 1,
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.text,
  },
  youBadge: {
    backgroundColor: theme.colors.primaryLight + '20',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
  },
  youText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  assignedIndicator: {
    marginLeft: 4,
  },
  memberEmail: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  memberMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  departmentText: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  workloadBar: {
    marginTop: 4,
  },
  workloadInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  workloadLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  workloadValue: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4CAF50',
  },
  workloadMedium: {
    color: '#FF9800',
  },
  workloadHigh: {
    color: '#F44336',
  },
  progressBar: {
    height: 4,
    backgroundColor: theme.colors.background,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  memberActions: {
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  radioSelected: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    gap: 8,
  },
  inviteButtonText: {
    fontSize: 15,
    color: 'white',
    fontWeight: '600',
  },
});