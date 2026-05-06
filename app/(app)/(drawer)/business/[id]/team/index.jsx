// // app/(app)/business/[id]/team/index.js
// import { View, FlatList, StyleSheet, Alert } from 'react-native';
// import { useLocalSearchParams, router } from 'expo-router';
// import { useTeamMembers } from '../../../../../../hooks/businessHooks/useTeamMembers';
// import TeamMemberCard from '../../../../../../components/business/TeamMemberCard';
// import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
// import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
// import EmptyState from '../../../../../../components/business/ui/EmptyState';
// import { FAB } from '../../../../../../components/business/ui/FAB';
// import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
// import { useState } from 'react';

// export default function TeamMembersScreen() {
//   const { id } = useLocalSearchParams();
//   const { teamMembers, loading, error, removeMember, refetch } = useTeamMembers(id);
//   const [selectedMember, setSelectedMember] = useState(null);
//   const [showConfirmDialog, setShowConfirmDialog] = useState(false);

//   const handleInvite = () => {
//     router.push(`/business/${id}/team/invite`);
//   };

//   const handleMemberPress = (member) => {
//     router.push(`/business/${id}/team/${member.user._id}`);
//   };

//   const handleRemoveMember = (member) => {
//     setSelectedMember(member);
//     setShowConfirmDialog(true);
//   };

//   const confirmRemoveMember = async () => {
//     if (!selectedMember) return;
    
//     try {
//       await removeMember(selectedMember.user._id);
//       setShowConfirmDialog(false);
//       setSelectedMember(null);
//       Alert.alert('Success', 'Team member removed successfully');
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Failed to remove team member');
//     }
//   };

//   if (loading) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} onRetry={refetch} />;
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={teamMembers}
//         keyExtractor={(item) => item.user._id}
//         renderItem={({ item }) => (
//           <TeamMemberCard
//             member={item}
//             onPress={() => handleMemberPress(item)}
//             onRemove={() => handleRemoveMember(item)}
//           />
//         )}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <EmptyState
//             icon="people-outline"
//             title="No Team Members"
//             message="Invite team members to collaborate on your social media management"
//             actionLabel="Invite Team Member"
//             onAction={handleInvite}
//           />
//         }
//       />
      
//       <FAB icon="person-add" onPress={handleInvite} />

//       <ConfirmDialog
//         visible={showConfirmDialog}
//         title="Remove Team Member"
//         message={`Are you sure you want to remove ${selectedMember?.user?.firstName} ${selectedMember?.user?.lastName} from the team?`}
//         confirmText="Remove"
//         cancelText="Cancel"
//         onConfirm={confirmRemoveMember}
//         onCancel={() => {
//           setShowConfirmDialog(false);
//           setSelectedMember(null);
//         }}
//         destructive
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   listContent: {
//     padding: 16,
//     flexGrow: 1,
//   },
// });
























// app/(app)/business/[id]/team/index.js
import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTeamMembers } from '../../../../../../hooks/businessHooks/useTeamMembers';
import TeamMemberCard from '../../../../../../components/business/TeamMemberCard';
import LoadingSpinner from '../../../../../../components/business/ui/LoadingSpinner';
import ErrorMessage from '../../../../../../components/business/ui/ErrorMessage';
import EmptyState from '../../../../../../components/business/ui/EmptyState';
import { FAB } from '../../../../../../components/business/ui/FAB';
import ConfirmDialog from '../../../../../../components/business/ui/ConfirmDialog';
import Header from '../../../../../../components/common/Header';

export default function TeamMembersScreen() {
  const { id } = useLocalSearchParams();
  const { teamMembers, loading, error, removeMember, refetch } = useTeamMembers(id);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleInvite = () => {
    router.push(`/business/${id}/team/invite`);
  };

  const handleMemberPress = (member) => {
    router.push(`/business/${id}/team/${member.user._id}`);
  };

  const handleRemoveMember = (member) => {
    setSelectedMember(member);
    setShowConfirmDialog(true);
  };

  const confirmRemoveMember = async () => {
    if (!selectedMember) return;
    
    try {
      await removeMember(selectedMember.user._id);
      setShowConfirmDialog(false);
      setSelectedMember(null);
      Alert.alert('Success', 'Team member removed successfully');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to remove team member');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <Header
        title="Team Members"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={handleInvite}>
            <Ionicons name="person-add" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      <FlatList
        data={teamMembers}
        keyExtractor={(item) => item.user._id}
        renderItem={({ item }) => (
          <TeamMemberCard
            member={item}
            onPress={() => handleMemberPress(item)}
            onRemove={() => handleRemoveMember(item)}
          />
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="people-outline"
            title="No Team Members"
            message="Invite team members to collaborate on your social media management"
            actionLabel="Invite Team Member"
            onAction={handleInvite}
          />
        }
      />
      
      <FAB icon="person-add" onPress={handleInvite} />

      <ConfirmDialog
        visible={showConfirmDialog}
        title="Remove Team Member"
        message={`Are you sure you want to remove ${selectedMember?.user?.firstName} ${selectedMember?.user?.lastName} from the team?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={confirmRemoveMember}
        onCancel={() => {
          setShowConfirmDialog(false);
          setSelectedMember(null);
        }}
        destructive
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
});