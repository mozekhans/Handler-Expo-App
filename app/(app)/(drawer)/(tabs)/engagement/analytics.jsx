// app/(tabs)/analytics/index.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "../../../../../components/common/Header";
import engagementService from "../../../../../services/engagementService";
import contentService from "../../../../../services/contentService";
import { useBusiness } from "../../../../../hooks/businessHooks/useBusiness";
// import { useAuth } from '../../../../../context/AuthContext';
import { theme } from "../../../../../styles/theme";

const { width } = Dimensions.get("window");

export default function AnalyticsScreen() {
  const { business } = useBusiness();
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("30days");
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const dateRanges = {
        // '7days': { startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        // '30days': { startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        // '90days': { startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        "7days": {
          startDate: new Date(
            Date.now() - 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },

        "30days": {
          startDate: new Date(
            Date.now() - 30 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },

        "90days": {
          startDate: new Date(
            Date.now() - 90 * 24 * 60 * 60 * 1000,
          ).toISOString(),
        },
      };

      const [engagementStats, contentStats] = await Promise.all([
        engagementService.getStats(business._id, dateRanges[selectedPeriod]),
        contentService.getContentStats(business._id),
      ]);

      setAnalyticsData({
        engagement: engagementStats.stats,
        content: contentStats.stats,
      });
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon, color }) => (
    <View style={styles.metricCard}>
      <View style={[styles.metricIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.metricValue}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      {change !== undefined && (
        <View
          style={[
            styles.changeBadge,
            { backgroundColor: change >= 0 ? "#4CAF5020" : "#F4433620" },
          ]}
        >
          <Ionicons
            name={change >= 0 ? "trending-up" : "trending-down"}
            size={14}
            color={change >= 0 ? "#4CAF50" : "#F44336"}
          />
          <Text
            style={[
              styles.changeText,
              { color: change >= 0 ? "#4CAF50" : "#F44336" },
            ]}
          >
            {Math.abs(change)}%
          </Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Header title="Analytics" showMenu />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Analytics" showMenu />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Period Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.periodSelector}
          contentContainerStyle={styles.periodContainer}
        >
          {[
            { key: "7days", label: "7 Days" },
            { key: "30days", label: "30 Days" },
            { key: "90days", label: "90 Days" },
          ].map((period) => (
            <TouchableOpacity
              key={period.key}
              style={[
                styles.periodButton,
                selectedPeriod === period.key && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.key)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.key && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <MetricCard
              title="Total Engagements"
              value={analyticsData?.engagement?.total || 0}
              change={12}
              icon="chatbubbles"
              color={theme.colors.primary}
            />
            <MetricCard
              title="Response Rate"
              value={`${Math.round((analyticsData?.engagement?.responseRate || 0) * 100)}%`}
              change={5}
              icon="trending-up"
              color="#4CAF50"
            />
            <MetricCard
              title="Avg Response Time"
              value="2.5h"
              change={-8}
              icon="time"
              color="#FF9800"
            />
            <MetricCard
              title="Content Published"
              value={analyticsData?.content?.published || 0}
              change={15}
              icon="create"
              color="#2196F3"
            />
          </View>
        </View>

        {/* Engagement Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement Breakdown</Text>
          <View style={styles.card}>
            <View style={styles.chartPlaceholder}>
              <Ionicons
                name="bar-chart"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.chartText}>
                Engagement chart will appear here
              </Text>
            </View>
          </View>
        </View>

        {/* Platform Performance */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Performance</Text>
          <View style={styles.card}>
            {["facebook", "instagram", "twitter", "linkedin"].map(
              (platform) => (
                <View key={platform} style={styles.platformRow}>
                  <View style={styles.platformInfo}>
                    <Ionicons
                      name={`logo-${platform}`}
                      size={20}
                      color={theme.colors.text}
                    />
                    <Text style={styles.platformName}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.platformStats}>
                    <Text style={styles.platformValue}>
                      {Math.floor(Math.random() * 1000)}
                    </Text>
                    <Text style={styles.platformLabel}>engagements</Text>
                  </View>
                </View>
              ),
            )}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
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
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  periodContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  periodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  periodButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  periodText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: "500",
  },
  periodTextActive: {
    color: "white",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: theme.colors.text,
    marginBottom: 16,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  metricCard: {
    width: (width - 44) / 2,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  metricIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.text,
  },
  metricTitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start",
    gap: 2,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    ...theme.shadows.small,
  },
  chartPlaceholder: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    borderRadius: 8,
  },
  chartText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
  },
  platformRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.divider,
  },
  platformInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  platformName: {
    fontSize: 15,
    color: theme.colors.text,
    fontWeight: "500",
  },
  platformStats: {
    alignItems: "flex-end",
  },
  platformValue: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text,
  },
  platformLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  bottomSpacing: {
    height: 40,
  },
});
