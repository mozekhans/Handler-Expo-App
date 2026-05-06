// src/components/business/BusinessHeader.jsx
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BusinessHeader = ({ business, onEdit, onDelete }) => {
  if (!business) return null;

  const getIndustryColor = (industry) => {
    const colors = {
      technology: '#1976d2',
      software: '#2e7d32',
      ecommerce: '#f57c00',
      retail: '#c2185b',
      fashion: '#7b1fa2',
      beauty: '#e91e63',
      food_beverage: '#ff5722',
      travel: '#0097a7',
      hospitality: '#5d4037',
      healthcare: '#00acc1',
      fitness: '#43a047',
      education: '#1565c0',
      finance: '#00695c',
      real_estate: '#6d4c41',
      entertainment: '#ad1457',
      media: '#4527a0',
      nonprofit: '#00838f',
      professional_services: '#283593',
      other: '#757575',
    };
    return colors[industry] || '#1976d2';
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerTop}>
        <View style={styles.logoContainer}>
          {business.branding?.logo ? (
            <Image source={{ uri: business.branding.logo }} style={styles.logo} />
          ) : (
            <View style={[styles.logoPlaceholder, { backgroundColor: getIndustryColor(business.industry) }]}>
              <Text style={styles.logoText}>
                {business.name?.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={22} color="#1976d2" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.deleteButton]} onPress={onDelete}>
            <Ionicons name="trash-outline" size={22} color="#d32f2f" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.headerContent}>
        <Text style={styles.businessName}>{business.name}</Text>
        
        <View style={styles.industryBadge}>
          <Text style={styles.industryText}>
            {business.industry?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </Text>
        </View>

        {business.niche && (
          <Text style={styles.niche}>{business.niche}</Text>
        )}

        {business.description && (
          <Text style={styles.description} numberOfLines={3}>
            {business.description}
          </Text>
        )}

        <View style={styles.metaRow}>
          {business.website && (
            <View style={styles.metaItem}>
              <Ionicons name="globe-outline" size={16} color="#666" />
              <Text style={styles.metaText} numberOfLines={1}>
                {business.website.replace(/^https?:\/\//, '')}
              </Text>
            </View>
          )}
          
          {business.location?.city && business.location?.country && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.metaText}>
                {business.location.city}, {business.location.country}
              </Text>
            </View>
          )}
          
          {business.size && (
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color="#666" />
              <Text style={styles.metaText}>{business.size} employees</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  deleteButton: {
    backgroundColor: '#ffebee',
  },
  headerContent: {
    marginTop: 5,
  },
  businessName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  industryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 8,
  },
  industryText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
  },
  niche: {
    fontSize: 15,
    color: '#666',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 5,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
});

export default BusinessHeader;