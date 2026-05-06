// src/components/business/TeamMemberCard.jsx
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TeamMemberCard = ({ member, onPress, onRemove }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return '#1976d2';
      case 'editor':
        return '#2e7d32';
      case 'viewer':
        return '#f57c00';
      default:
        return '#666';
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatar}>
        {member.user?.avatar ? (
          <Image source={{ uri: member.user.avatar }} style={styles.avatarImage} />
        ) : (
          <Text style={styles.avatarText}>
            {getInitials(member.user?.firstName, member.user?.lastName)}
          </Text>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>
            {member.user?.firstName} {member.user?.lastName}
          </Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(member.role) + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor(member.role) }]}>
              {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
            </Text>
          </View>
        </View>

        <Text style={styles.email}>{member.user?.email}</Text>

        <View style={styles.meta}>
          <Text style={styles.joinedDate}>
            Joined {new Date(member.joinedAt).toLocaleDateString()}
          </Text>
          {member.status === 'pending' && (
            <View style={styles.pendingBadge}>
              <Text style={styles.pendingText}>Pending</Text>
            </View>
          )}
        </View>
      </View>

      {onRemove && (
        <TouchableOpacity style={styles.removeButton} onPress={onRemove}>
          <Ionicons name="close-circle" size={24} color="#d32f2f" />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#1976d2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '500',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  joinedDate: {
    fontSize: 12,
    color: '#999',
  },
  pendingBadge: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  pendingText: {
    fontSize: 11,
    color: '#f57c00',
    fontWeight: '500',
  },
  removeButton: {
    padding: 5,
  },
});

export default TeamMemberCard;