
// // app/(app)/business/index.js
// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   RefreshControl,
//   Image,
// } from "react-native";
// import { router } from "expo-router";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { Ionicons } from "@expo/vector-icons";
// import { useBusinessStore } from "../../../../stores/businessStore";
// import { useBusinessList } from "../../../../hooks/businessHooks/useBusinessList";
// import BusinessSwitcher from "../../../../components/business/BusinessSwitcher";
// import LoadingSpinner from "../../../../components/business/ui/LoadingSpinner";
// import ErrorMessage from "../../../../components/business/ui/ErrorMessage";

// export default function BusinessHomeScreen() {
//   const { currentBusiness, loading, error, switchBusiness } =
//     useBusinessStore();
//   const { businesses, refresh } = useBusinessList();
//   const [refreshing, setRefreshing] = useState(false);

//   const handleRefresh = async () => {
//     setRefreshing(true);
//     await refresh();
//     setRefreshing(false);
//   };

//   const handleSwitchBusiness = async (businessId) => {
//     await switchBusiness(businessId);
//   };

//   // In app/(app)/business/index.jsx

//   const navigateTo = (path) => {
//     if (!currentBusiness) return;
//     router.push(`/business/${currentBusiness._id}${path}`);
//   };

//   const quickActions = [
//     {
//       id: "overview",
//       title: "Business Overview",
//       description: "View business details and statistics",
//       icon: "analytics-outline",
//       color: "#1976d2",
//       path: "", 
//     },
//     {
//       id: "team",
//       title: "Team Members",
//       description: "Manage your team and permissions",
//       icon: "people-outline",
//       color: "#2e7d32",
//       path: "/team", 
//       badge: currentBusiness?.teamMembers?.length || 0,
//     },
//     {
//       id: "brand-voice",
//       title: "Brand Voice",
//       description: "Define your brand's tone and style",
//       icon: "mic-outline",
//       color: "#9c27b0",
//       path: "/brand-voice",
//     },
//     {
//       id: "target-audience",
//       title: "Target Audience",
//       description: "Define your ideal customer profile",
//       icon: "compass-outline",
//       color: "#f57c00",
//       path: "/target-audience", 
//     },
//     {
//       id: "competitors",
//       title: "Competitors",
//       description: "Track and analyze competitors",
//       icon: "pulse-outline",
//       color: "#d32f2f",
//       path: "/competitors", 
//     },
//     {
//       id: "integrations",
//       title: "Integrations",
//       description: "Connect with social media and tools",
//       icon: "apps-outline",
//       color: "#00acc1",
//       path: "/integrations",
//     },
//     {
//       id: "settings",
//       title: "Settings",
//       description: "Configure business settings",
//       icon: "settings-outline",
//       color: "#757575",
//       path: "/settings", 
//     },
//   ];

//   const recentActivity = [
//     {
//       id: 1,
//       type: "post",
//       title: "New post scheduled",
//       description: "Instagram post scheduled for tomorrow",
//       time: "2 hours ago",
//       icon: "calendar-outline",
//     },
//     {
//       id: 2,
//       type: "team",
//       title: "Team member joined",
//       description: "John Doe accepted the invitation",
//       time: "1 day ago",
//       icon: "person-add-outline",
//     },
//     {
//       id: 3,
//       type: "competitor",
//       title: "Competitor updated",
//       description: "Competitor analysis updated",
//       time: "2 days ago",
//       icon: "trending-up-outline",
//     },
//   ];

//   if (loading && !currentBusiness) {
//     return <LoadingSpinner />;
//   }

//   if (error) {
//     return <ErrorMessage message={error} onRetry={refresh} />;
//   }

//   if (!currentBusiness) {
//     return (
//       <SafeAreaView style={styles.container}>
//         <View style={styles.emptyContainer}>
//           <Ionicons name="business-outline" size={80} color="#ccc" />
//           <Text style={styles.emptyTitle}>No Business Selected</Text>
//           <Text style={styles.emptyText}>
//             Create a new business or select an existing one to get started
//           </Text>
//           <TouchableOpacity
//             style={styles.createButton}
//             onPress={() => router.push("/business/create")}
//           >
//             <Text style={styles.createButtonText}>Create Business</Text>
//           </TouchableOpacity>
//           {businesses.length > 0 && (
//             <TouchableOpacity
//               style={styles.selectButton}
//               onPress={() => router.push("/business/select")}
//             >
//               <Text style={styles.selectButtonText}>
//                 Select Existing Business
//               </Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         refreshControl={
//           <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
//         }
//       >
//         {/* Header with Business Switcher */}
//         <View style={styles.header}>
//           <View style={styles.headerTop}>
//             <Text style={styles.headerTitle}>Business</Text>
//             <TouchableOpacity onPress={() => router.push("/business/create")}>
//               <Ionicons name="add-circle-outline" size={28} color="#1976d2" />
//             </TouchableOpacity>
//           </View>

//           <BusinessSwitcher
//             businesses={businesses}
//             currentBusiness={currentBusiness}
//             onSwitch={handleSwitchBusiness}
//           />
//         </View>

//         {/* Current Business Card */}
//         <TouchableOpacity
//           style={styles.currentBusinessCard}
//           onPress={() => router.push(`/business/${currentBusiness._id}`)}
//         >
//           <View style={styles.businessCardHeader}>
//             <View style={styles.businessIcon}>
//               {currentBusiness.branding?.logo ? (
//                 <Image
//                   source={{ uri: currentBusiness.branding.logo }}
//                   style={styles.businessLogo}
//                 />
//               ) : (
//                 <View
//                   style={[
//                     styles.businessIconPlaceholder,
//                     { backgroundColor: "#e3f2fd" },
//                   ]}
//                 >
//                   <Text style={styles.businessInitials}>
//                     {currentBusiness.name?.charAt(0).toUpperCase()}
//                   </Text>
//                 </View>
//               )}
//             </View>
//             <View style={styles.businessInfo}>
//               <Text style={styles.businessName}>{currentBusiness.name}</Text>
//               <Text style={styles.businessIndustry}>
//                 {currentBusiness.industry
//                   ?.replace(/_/g, " ")
//                   .replace(/\b\w/g, (l) => l.toUpperCase())}
//               </Text>
//             </View>
//             <Ionicons name="chevron-forward" size={24} color="#ccc" />
//           </View>

//           {/* Stats Row */}
//           <View style={styles.statsRow}>
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>
//                 {currentBusiness.stats?.totalPosts || 0}
//               </Text>
//               <Text style={styles.statLabel}>Posts</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>
//                 {currentBusiness.stats?.totalFollowers >= 1000
//                   ? `${(currentBusiness.stats.totalFollowers / 1000).toFixed(1)}K`
//                   : currentBusiness.stats?.totalFollowers || 0}
//               </Text>
//               <Text style={styles.statLabel}>Followers</Text>
//             </View>
//             <View style={styles.statDivider} />
//             <View style={styles.statItem}>
//               <Text style={styles.statValue}>
//                 {currentBusiness.stats?.averageEngagementRate?.toFixed(1) || 0}%
//               </Text>
//               <Text style={styles.statLabel}>Engagement</Text>
//             </View>
//           </View>
//         </TouchableOpacity>

//         {/* Quick Actions Grid */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Quick Actions</Text>
//           <View style={styles.quickActionsGrid}>
//             {quickActions.map((action) => (
//               <TouchableOpacity
//                 key={action.id}
//                 style={styles.quickActionCard}
//                 onPress={() => navigateTo(action.path)}
//               >
//                 <View
//                   style={[
//                     styles.quickActionIcon,
//                     { backgroundColor: action.color + "15" },
//                   ]}
//                 >
//                   <Ionicons name={action.icon} size={28} color={action.color} />
//                   {action.badge > 0 && (
//                     <View
//                       style={[styles.badge, { backgroundColor: action.color }]}
//                     >
//                       <Text style={styles.badgeText}>{action.badge}</Text>
//                     </View>
//                   )}
//                 </View>
//                 <Text style={styles.quickActionTitle}>{action.title}</Text>
//                 <Text style={styles.quickActionDescription} numberOfLines={2}>
//                   {action.description}
//                 </Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         </View>

//         {/* Recent Activity */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Recent Activity</Text>
//           <View style={styles.activityCard}>
//             {recentActivity.length > 0 ? (
//               recentActivity.map((activity) => (
//                 <TouchableOpacity key={activity.id} style={styles.activityItem}>
//                   <View
//                     style={[
//                       styles.activityIcon,
//                       { backgroundColor: "#f5f5f5" },
//                     ]}
//                   >
//                     <Ionicons name={activity.icon} size={20} color="#666" />
//                   </View>
//                   <View style={styles.activityContent}>
//                     <Text style={styles.activityTitle}>{activity.title}</Text>
//                     <Text style={styles.activityDescription}>
//                       {activity.description}
//                     </Text>
//                   </View>
//                   <Text style={styles.activityTime}>{activity.time}</Text>
//                 </TouchableOpacity>
//               ))
//             ) : (
//               <View style={styles.emptyActivity}>
//                 <Ionicons name="time-outline" size={48} color="#ccc" />
//                 <Text style={styles.emptyActivityText}>No recent activity</Text>
//               </View>
//             )}
//           </View>
//         </View>

//         {/* All Businesses Link */}
//         <TouchableOpacity
//           style={styles.allBusinessesLink}
//           onPress={() => router.push("/business/select")}
//         >
//           <Ionicons name="list-outline" size={20} color="#1976d2" />
//           <Text style={styles.allBusinessesText}>View All Businesses</Text>
//           <Text style={styles.businessCount}>{businesses.length} total</Text>
//           <Ionicons name="chevron-forward" size={20} color="#ccc" />
//         </TouchableOpacity>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f5f5f5",
//   },
//   header: {
//     backgroundColor: "#fff",
//     paddingHorizontal: 20,
//     paddingTop: 12,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: "#e0e0e0",
//   },
//   headerTop: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   headerTitle: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   currentBusinessCard: {
//     backgroundColor: "#fff",
//     marginHorizontal: 20,
//     marginTop: 16,
//     marginBottom: 8,
//     borderRadius: 16,
//     padding: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.08,
//     shadowRadius: 8,
//     elevation: 3,
//   },
//   businessCardHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   businessIcon: {
//     marginRight: 12,
//   },
//   businessIconPlaceholder: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   businessLogo: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//   },
//   businessInitials: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#1976d2",
//   },
//   businessInfo: {
//     flex: 1,
//   },
//   businessName: {
//     fontSize: 18,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 2,
//   },
//   businessIndustry: {
//     fontSize: 14,
//     color: "#666",
//   },
//   statsRow: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     paddingTop: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#f0f0f0",
//   },
//   statItem: {
//     alignItems: "center",
//     flex: 1,
//   },
//   statValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#1976d2",
//     marginBottom: 4,
//   },
//   statLabel: {
//     fontSize: 12,
//     color: "#666",
//   },
//   statDivider: {
//     width: 1,
//     height: "80%",
//     backgroundColor: "#e0e0e0",
//   },
//   section: {
//     paddingHorizontal: 20,
//     marginTop: 24,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 16,
//   },
//   quickActionsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//   },
//   quickActionCard: {
//     width: "48%",
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 16,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   quickActionIcon: {
//     width: 48,
//     height: 48,
//     borderRadius: 24,
//     justifyContent: "center",
//     alignItems: "center",
//     marginBottom: 12,
//     position: "relative",
//   },
//   badge: {
//     position: "absolute",
//     top: -4,
//     right: -4,
//     minWidth: 20,
//     height: 20,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 4,
//   },
//   badgeText: {
//     fontSize: 11,
//     fontWeight: "bold",
//     color: "#fff",
//   },
//   quickActionTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//     marginBottom: 4,
//   },
//   quickActionDescription: {
//     fontSize: 12,
//     color: "#999",
//     lineHeight: 16,
//   },
//   activityCard: {
//     backgroundColor: "#fff",
//     borderRadius: 16,
//     padding: 8,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.05,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   activityItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     paddingHorizontal: 8,
//     borderBottomWidth: 1,
//     borderBottomColor: "#f0f0f0",
//   },
//   activityIcon: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 12,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityTitle: {
//     fontSize: 14,
//     fontWeight: "500",
//     color: "#333",
//     marginBottom: 2,
//   },
//   activityDescription: {
//     fontSize: 13,
//     color: "#666",
//   },
//   activityTime: {
//     fontSize: 12,
//     color: "#999",
//   },
//   emptyActivity: {
//     alignItems: "center",
//     paddingVertical: 32,
//   },
//   emptyActivityText: {
//     fontSize: 14,
//     color: "#999",
//     marginTop: 8,
//   },
//   allBusinessesLink: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     marginHorizontal: 20,
//     marginTop: 24,
//     marginBottom: 30,
//     padding: 16,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   allBusinessesText: {
//     flex: 1,
//     fontSize: 16,
//     color: "#1976d2",
//     fontWeight: "500",
//     marginLeft: 12,
//   },
//   businessCount: {
//     fontSize: 14,
//     color: "#999",
//     marginRight: 8,
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: 40,
//   },
//   emptyTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#333",
//     marginTop: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#666",
//     textAlign: "center",
//     marginTop: 12,
//     marginBottom: 30,
//     lineHeight: 22,
//   },
//   createButton: {
//     backgroundColor: "#1976d2",
//     paddingHorizontal: 30,
//     paddingVertical: 16,
//     borderRadius: 12,
//     marginBottom: 12,
//   },
//   createButtonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   selectButton: {
//     borderWidth: 1,
//     borderColor: "#1976d2",
//     paddingHorizontal: 30,
//     paddingVertical: 16,
//     borderRadius: 12,
//   },
//   selectButtonText: {
//     color: "#1976d2",
//     fontSize: 16,
//     fontWeight: "500",
//   },
// });



















// app/(app)/business/index.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useBusinessStore } from "../../../../stores/businessStore";
import { useBusinessList } from "../../../../hooks/businessHooks/useBusinessList";
import BusinessSwitcher from "../../../../components/business/BusinessSwitcher";
import LoadingSpinner from "../../../../components/business/ui/LoadingSpinner";
import ErrorMessage from "../../../../components/business/ui/ErrorMessage";
import Header from "../../../../components/common/Header";

export default function BusinessHomeScreen() {
  const { currentBusiness, loading, error, switchBusiness } =
    useBusinessStore();
  const { businesses, refresh } = useBusinessList();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleSwitchBusiness = async (businessId) => {
    await switchBusiness(businessId);
  };

  const navigateTo = (path) => {
    if (!currentBusiness) return;
    router.push(`/business/${currentBusiness._id}${path}`);
  };

  const quickActions = [
    {
      id: "overview",
      title: "Business Overview",
      description: "View business details and statistics",
      icon: "analytics-outline",
      color: "#1976d2",
      path: "", 
    },
    {
      id: "team",
      title: "Team Members",
      description: "Manage your team and permissions",
      icon: "people-outline",
      color: "#2e7d32",
      path: "/team", 
      badge: currentBusiness?.teamMembers?.length || 0,
    },
    {
      id: "brand-voice",
      title: "Brand Voice",
      description: "Define your brand's tone and style",
      icon: "mic-outline",
      color: "#9c27b0",
      path: "/brand-voice",
    },
    {
      id: "target-audience",
      title: "Target Audience",
      description: "Define your ideal customer profile",
      icon: "compass-outline",
      color: "#f57c00",
      path: "/target-audience", 
    },
    {
      id: "competitors",
      title: "Competitors",
      description: "Track and analyze competitors",
      icon: "pulse-outline",
      color: "#d32f2f",
      path: "/competitors", 
    },
    {
      id: "integrations",
      title: "Integrations",
      description: "Connect with social media and tools",
      icon: "apps-outline",
      color: "#00acc1",
      path: "/integrations",
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure business settings",
      icon: "settings-outline",
      color: "#757575",
      path: "/settings", 
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "post",
      title: "New post scheduled",
      description: "Instagram post scheduled for tomorrow",
      time: "2 hours ago",
      icon: "calendar-outline",
    },
    {
      id: 2,
      type: "team",
      title: "Team member joined",
      description: "John Doe accepted the invitation",
      time: "1 day ago",
      icon: "person-add-outline",
    },
    {
      id: 3,
      type: "competitor",
      title: "Competitor updated",
      description: "Competitor analysis updated",
      time: "2 days ago",
      icon: "trending-up-outline",
    },
  ];

  if (loading && !currentBusiness) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={refresh} />;
  }

  if (!currentBusiness) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="My Businesses"
          showBack={false}
          rightComponent={
            <TouchableOpacity onPress={() => router.push("/business/create")}>
              <Ionicons name="add-circle-outline" size={24} color="#333" />
            </TouchableOpacity>
          }
        />
        
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={80} color="#ccc" />
          <Text style={styles.emptyTitle}>No Business Selected</Text>
          <Text style={styles.emptyText}>
            Create a new business or select an existing one to get started
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("/business/create")}
          >
            <Text style={styles.createButtonText}>Create Business</Text>
          </TouchableOpacity>
          {businesses.length > 0 && (
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => router.push("/business/select")}
            >
              <Text style={styles.selectButtonText}>
                Select Existing Business
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Business"
        showBack={false}
        rightComponent={
          <TouchableOpacity onPress={() => router.push("/business/create")}>
            <Ionicons name="add-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Business Switcher */}
        <View style={styles.switcherContainer}>
          <BusinessSwitcher
            businesses={businesses}
            currentBusiness={currentBusiness}
            onSwitch={handleSwitchBusiness}
          />
        </View>

        {/* Current Business Card */}
        <TouchableOpacity
          style={styles.currentBusinessCard}
          onPress={() => router.push(`/business/${currentBusiness._id}`)}
        >
          <View style={styles.businessCardHeader}>
            <View style={styles.businessIcon}>
              {currentBusiness.branding?.logo ? (
                <Image
                  source={{ uri: currentBusiness.branding.logo }}
                  style={styles.businessLogo}
                />
              ) : (
                <View
                  style={[
                    styles.businessIconPlaceholder,
                    { backgroundColor: "#e3f2fd" },
                  ]}
                >
                  <Text style={styles.businessInitials}>
                    {currentBusiness.name?.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.businessInfo}>
              <Text style={styles.businessName}>{currentBusiness.name}</Text>
              <Text style={styles.businessIndustry}>
                {currentBusiness.industry
                  ?.replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {currentBusiness.stats?.totalPosts || 0}
              </Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {currentBusiness.stats?.totalFollowers >= 1000
                  ? `${(currentBusiness.stats.totalFollowers / 1000).toFixed(1)}K`
                  : currentBusiness.stats?.totalFollowers || 0}
              </Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {currentBusiness.stats?.averageEngagementRate?.toFixed(1) || 0}%
              </Text>
              <Text style={styles.statLabel}>Engagement</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickActionCard}
                onPress={() => navigateTo(action.path)}
              >
                <View
                  style={[
                    styles.quickActionIcon,
                    { backgroundColor: action.color + "15" },
                  ]}
                >
                  <Ionicons name={action.icon} size={28} color={action.color} />
                  {action.badge > 0 && (
                    <View
                      style={[styles.badge, { backgroundColor: action.color }]}
                    >
                      <Text style={styles.badgeText}>{action.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.quickActionTitle}>{action.title}</Text>
                <Text style={styles.quickActionDescription} numberOfLines={2}>
                  {action.description}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <TouchableOpacity key={activity.id} style={styles.activityItem}>
                  <View
                    style={[
                      styles.activityIcon,
                      { backgroundColor: "#f5f5f5" },
                    ]}
                  >
                    <Ionicons name={activity.icon} size={20} color="#666" />
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityDescription}>
                      {activity.description}
                    </Text>
                  </View>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyActivity}>
                <Ionicons name="time-outline" size={48} color="#ccc" />
                <Text style={styles.emptyActivityText}>No recent activity</Text>
              </View>
            )}
          </View>
        </View>

        {/* All Businesses Link */}
        <TouchableOpacity
          style={styles.allBusinessesLink}
          onPress={() => router.push("/business/select")}
        >
          <Ionicons name="list-outline" size={20} color="#1976d2" />
          <Text style={styles.allBusinessesText}>View All Businesses</Text>
          <Text style={styles.businessCount}>{businesses.length} total</Text>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  switcherContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  currentBusinessCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  businessCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  businessIcon: {
    marginRight: 12,
  },
  businessIconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  businessLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  businessInitials: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
  },
  businessInfo: {
    flex: 1,
  },
  businessName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 2,
  },
  businessIndustry: {
    fontSize: 14,
    color: "#666",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "#e0e0e0",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  quickActionDescription: {
    fontSize: 12,
    color: "#999",
    lineHeight: 16,
  },
  activityCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: "#666",
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyActivity: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyActivityText: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
  },
  allBusinessesLink: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  allBusinessesText: {
    flex: 1,
    fontSize: 16,
    color: "#1976d2",
    fontWeight: "500",
    marginLeft: 12,
  },
  businessCount: {
    fontSize: 14,
    color: "#999",
    marginRight: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 12,
    marginBottom: 30,
    lineHeight: 22,
  },
  createButton: {
    backgroundColor: "#1976d2",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#1976d2",
    paddingHorizontal: 30,
    paddingVertical: 16,
    borderRadius: 12,
  },
  selectButtonText: {
    color: "#1976d2",
    fontSize: 16,
    fontWeight: "500",
  },
});