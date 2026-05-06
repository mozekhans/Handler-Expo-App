// src/components/business/BusinessCard.jsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BusinessCard = ({ 
  business, 
  onPress, 
  onSwitch,
  isActive = false,
  showSwitch = true,
  variant = 'default' // default, compact, detailed
}) => {
  const getIndustryIcon = (industry) => {
    const icons = {
      technology: 'hardware-chip-outline',
      software: 'code-slash-outline',
      ecommerce: 'cart-outline',
      retail: 'storefront-outline',
      fashion: 'shirt-outline',
      beauty: 'flower-outline',
      food_beverage: 'restaurant-outline',
      travel: 'airplane-outline',
      hospitality: 'bed-outline',
      healthcare: 'medkit-outline',
      fitness: 'barbell-outline',
      education: 'school-outline',
      finance: 'cash-outline',
      real_estate: 'home-outline',
      automotive: 'car-outline',
      entertainment: 'film-outline',
      media: 'newspaper-outline',
      nonprofit: 'heart-outline',
      professional_services: 'briefcase-outline',
      manufacturing: 'construct-outline',
      construction: 'build-outline',
      agriculture: 'leaf-outline',
      energy: 'flash-outline',
      telecommunications: 'wifi-outline',
      transportation: 'bus-outline',
      other: 'business-outline',
    };
    return icons[industry] || 'business-outline';
  };

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

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getInitials = (name) => {
    if (!name) return 'B';
    return name.split(' ').map(word => word.charAt(0)).join('').slice(0, 2).toUpperCase();
  };

  if (variant === 'compact') {
    return (
      <TouchableOpacity 
        style={[styles.compactContainer, isActive && styles.activeCompactContainer]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={[styles.compactIcon, { backgroundColor: getIndustryColor(business.industry) + '15' }]}>
          {business.branding?.logo ? (
            <Image source={{ uri: business.branding.logo }} style={styles.compactLogo} />
          ) : (
            <Text style={[styles.compactInitials, { color: getIndustryColor(business.industry) }]}>
              {getInitials(business.name)}
            </Text>
          )}
        </View>
        <Text style={styles.compactName} numberOfLines={1}>{business.name}</Text>
      </TouchableOpacity>
    );
  }

  if (variant === 'detailed') {
    return (
      <TouchableOpacity 
        style={[styles.detailedContainer, isActive && styles.activeContainer]} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.detailedHeader}>
          <View style={styles.detailedIconContainer}>
            {business.branding?.logo ? (
              <Image source={{ uri: business.branding.logo }} style={styles.detailedLogo} />
            ) : (
              <View style={[styles.detailedIconPlaceholder, { backgroundColor: getIndustryColor(business.industry) + '15' }]}>
                <Ionicons 
                  name={getIndustryIcon(business.industry)} 
                  size={32} 
                  color={getIndustryColor(business.industry)} 
                />
              </View>
            )}
          </View>
          
          <View style={styles.detailedInfo}>
            <View style={styles.detailedNameRow}>
              <Text style={styles.detailedName}>{business.name}</Text>
              {isActive && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>Current</Text>
                </View>
              )}
            </View>
            
            <Text style={styles.detailedIndustry}>
              {business.industry?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              {business.niche && ` • ${business.niche}`}
            </Text>
            
            {business.description && (
              <Text style={styles.detailedDescription} numberOfLines={2}>
                {business.description}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.detailedStats}>
          <View style={styles.statItem}>
            <Ionicons name="people-outline" size={16} color="#666" />
            <Text style={styles.statValue}>{business.teamMembers?.length || 0}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="share-social-outline" size={16} color="#666" />
            <Text style={styles.statValue}>
              {business.integrations?.filter(i => i.type === 'social').length || 0}
            </Text>
            <Text style={styles.statLabel}>Accounts</Text>
          </View>
          
          <View style={styles.statDivider} />
          
          <View style={styles.statItem}>
            <Ionicons name="trending-up-outline" size={16} color="#666" />
            <Text style={styles.statValue}>
              {business.stats?.totalFollowers ? formatNumber(business.stats.totalFollowers) : '0'}
            </Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </View>

        <View style={styles.detailedFooter}>
          <View style={styles.locationInfo}>
            {business.location?.city && (
              <>
                <Ionicons name="location-outline" size={14} color="#999" />
                <Text style={styles.locationText}>
                  {business.location.city}, {business.location.country}
                </Text>
              </>
            )}
          </View>
          
          <View style={styles.footerActions}>
            {showSwitch && !isActive && (
              <TouchableOpacity 
                style={styles.switchButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onSwitch?.();
                }}
              >
                <Ionicons name="swap-horizontal-outline" size={16} color="#1976d2" />
                <Text style={styles.switchButtonText}>Switch</Text>
              </TouchableOpacity>
            )}
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Default variant
  return (
    <TouchableOpacity 
      style={[styles.container, isActive && styles.activeContainer]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        {business.branding?.logo ? (
          <Image source={{ uri: business.branding.logo }} style={styles.logo} />
        ) : (
          <View style={[styles.iconPlaceholder, { backgroundColor: getIndustryColor(business.industry) + '15' }]}>
            <Ionicons 
              name={getIndustryIcon(business.industry)} 
              size={28} 
              color={getIndustryColor(business.industry)} 
            />
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.name, isActive && styles.activeText]} numberOfLines={1}>
            {business.name}
          </Text>
          {isActive && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>Current</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.industry}>
          {business.industry?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          {business.subIndustry && ` • ${business.subIndustry}`}
        </Text>
        
        {business.description && (
          <Text style={styles.description} numberOfLines={2}>
            {business.description}
          </Text>
        )}
        
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Ionicons name="people-outline" size={14} color="#999" />
            <Text style={styles.statText}>
              {business.teamMembers?.length || 0} members
            </Text>
          </View>
          
          {business.stats?.totalFollowers > 0 && (
            <View style={styles.stat}>
              <Ionicons name="people-circle-outline" size={14} color="#999" />
              <Text style={styles.statText}>
                {formatNumber(business.stats.totalFollowers)} followers
              </Text>
            </View>
          )}
          
          {business.location?.country && (
            <View style={styles.stat}>
              <Ionicons name="location-outline" size={14} color="#999" />
              <Text style={styles.statText}>
                {business.location.city || business.location.country}
              </Text>
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.actions}>
        {showSwitch && !isActive && (
          <TouchableOpacity 
            style={styles.switchIconButton}
            onPress={(e) => {
              e.stopPropagation();
              onSwitch?.();
            }}
          >
            <Ionicons name="swap-horizontal" size={20} color="#1976d2" />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Default variant styles
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  activeContainer: {
    borderWidth: 2,
    borderColor: '#1976d2',
    shadowColor: '#1976d2',
    shadowOpacity: 0.15,
  },
  iconContainer: {
    marginRight: 15,
  },
  iconPlaceholder: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 28,
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
    flex: 1,
  },
  activeText: {
    color: '#1976d2',
  },
  activeBadge: {
    backgroundColor: '#1976d2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginLeft: 8,
  },
  activeBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  industry: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
    lineHeight: 18,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 2,
  },
  statText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  switchIconButton: {
    padding: 8,
    marginRight: 5,
    backgroundColor: '#e3f2fd',
    borderRadius: 20,
  },

  // Compact variant styles
  compactContainer: {
    alignItems: 'center',
    width: 80,
    marginHorizontal: 5,
  },
  activeCompactContainer: {
    opacity: 1,
  },
  compactIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  compactLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  compactInitials: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  compactName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },

  // Detailed variant styles
  detailedContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailedHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailedIconContainer: {
    marginRight: 15,
  },
  detailedIconPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailedLogo: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  detailedInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  detailedNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  detailedIndustry: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  detailedDescription: {
    fontSize: 13,
    color: '#999',
    lineHeight: 18,
  },
  detailedStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  statDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#e0e0e0',
  },
  detailedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  switchButtonText: {
    fontSize: 13,
    color: '#1976d2',
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default BusinessCard;