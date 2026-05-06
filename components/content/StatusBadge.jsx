// components/StatusBadge.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { STATUS_COLORS } from '../../utils/constants';

const StatusBadge = ({ status }) => {
  const getStatusText = (status) => {
    const texts = {
      draft: 'Draft',
      scheduled: 'Scheduled',
      published: 'Published',
      failed: 'Failed',
      review: 'In Review',
      approved: 'Approved',
      rejected: 'Rejected',
      deleted: 'Deleted',
    };
    return texts[status] || status;
  };

  return (
    <View style={[styles.badge, { backgroundColor: STATUS_COLORS[status] || '#6c757d' }]}>
      <Text style={styles.text}>{getStatusText(status)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  text: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default StatusBadge;