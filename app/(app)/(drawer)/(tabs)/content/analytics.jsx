// // app/(app)/content/analytics.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   Dimensions,
//   TouchableOpacity,
// } from 'react-native';
// import { LineChart, PieChart } from 'react-native-chart-kit';
// import { useContent } from '../../../../../hooks/useContent';
// import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
// import DateTimePicker from '@react-native-community/datetimepicker';

// const screenWidth = Dimensions.get('window').width;

// export default function ContentAnalytics() {
//   const { getStats, loading } = useContent();
//   const [stats, setStats] = useState(null);
//   const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
//   const [endDate, setEndDate] = useState(new Date());
//   const [showStartPicker, setShowStartPicker] = useState(false);
//   const [showEndPicker, setShowEndPicker] = useState(false);

//   useEffect(() => {
//     loadStats();
//   }, [startDate, endDate]);

//   const loadStats = async () => {
//     try {
//       const data = await getStats(startDate.toISOString(), endDate.toISOString());
//       setStats(data);
//     } catch (error) {
//       console.error('Failed to load stats:', error);
//     }
//   };

//   const getChartData = () => {
//     if (!stats) return null;
    
//     return {
//       labels: ['Drafts', 'Scheduled', 'Published', 'Failed', 'Review'],
//       datasets: [{
//         data: [
//           stats.drafts || 0,
//           stats.scheduled || 0,
//           stats.published || 0,
//           stats.failed || 0,
//           stats.review || 0,
//         ],
//       }],
//     };
//   };

//   const getPieData = () => {
//     if (!stats) return [];
    
//     return [
//       {
//         name: 'Published',
//         population: stats.published || 0,
//         color: '#28a745',
//         legendFontColor: '#333',
//       },
//       {
//         name: 'Scheduled',
//         population: stats.scheduled || 0,
//         color: '#17a2b8',
//         legendFontColor: '#333',
//       },
//       {
//         name: 'Drafts',
//         population: stats.drafts || 0,
//         color: '#ffc107',
//         legendFontColor: '#333',
//       },
//       {
//         name: 'Failed',
//         population: stats.failed || 0,
//         color: '#dc3545',
//         legendFontColor: '#333',
//       },
//     ];
//   };

//   if (loading || !stats) {
//     return <LoadingSpinner />;
//   }

//   const chartData = getChartData();
//   const pieData = getPieData();

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Content Analytics</Text>
        
//         <View style={styles.dateRange}>
//           <TouchableOpacity
//             style={styles.dateButton}
//             onPress={() => setShowStartPicker(true)}
//           >
//             <Text style={styles.dateButtonText}>
//               Start: {startDate.toLocaleDateString()}
//             </Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             style={styles.dateButton}
//             onPress={() => setShowEndPicker(true)}
//           >
//             <Text style={styles.dateButtonText}>
//               End: {endDate.toLocaleDateString()}
//             </Text>
//           </TouchableOpacity>
//         </View>
        
//         {showStartPicker && (
//           <DateTimePicker
//             value={startDate}
//             mode="date"
//             onChange={(event, date) => {
//               setShowStartPicker(false);
//               if (date) setStartDate(date);
//             }}
//           />
//         )}
        
//         {showEndPicker && (
//           <DateTimePicker
//             value={endDate}
//             mode="date"
//             onChange={(event, date) => {
//               setShowEndPicker(false);
//               if (date) setEndDate(date);
//             }}
//           />
//         )}
//       </View>

//       {/* Summary Cards */}
//       <View style={styles.summaryGrid}>
//         <View style={styles.summaryCard}>
//           <Text style={styles.summaryValue}>{stats.total || 0}</Text>
//           <Text style={styles.summaryLabel}>Total Content</Text>
//         </View>
//         <View style={styles.summaryCard}>
//           <Text style={[styles.summaryValue, { color: '#28a745' }]}>
//             {stats.published || 0}
//           </Text>
//           <Text style={styles.summaryLabel}>Published</Text>
//         </View>
//         <View style={styles.summaryCard}>
//           <Text style={[styles.summaryValue, { color: '#17a2b8' }]}>
//             {stats.scheduled || 0}
//           </Text>
//           <Text style={styles.summaryLabel}>Scheduled</Text>
//         </View>
//         <View style={styles.summaryCard}>
//           <Text style={[styles.summaryValue, { color: '#ffc107' }]}>
//             {stats.drafts || 0}
//           </Text>
//           <Text style={styles.summaryLabel}>Drafts</Text>
//         </View>
//       </View>

//       {/* Engagement Metrics */}
//       {stats.totalEngagement !== undefined && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Engagement Metrics</Text>
//           <View style={styles.engagementGrid}>
//             <View style={styles.engagementCard}>
//               <Text style={styles.engagementValue}>
//                 {stats.totalEngagement?.toLocaleString() || 0}
//               </Text>
//               <Text style={styles.engagementLabel}>Total Engagement</Text>
//             </View>
//             <View style={styles.engagementCard}>
//               <Text style={styles.engagementValue}>
//                 {stats.avgEngagement?.toFixed(2) || 0}
//               </Text>
//               <Text style={styles.engagementLabel}>Avg Engagement</Text>
//             </View>
//           </View>
//         </View>
//       )}

//       {/* Bar Chart */}
//       {chartData && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Content Distribution</Text>
//           <ScrollView horizontal>
//             <LineChart
//               data={chartData}
//               width={Math.max(screenWidth - 32, chartData.labels.length * 80)}
//               height={220}
//               chartConfig={{
//                 backgroundColor: '#fff',
//                 backgroundGradientFrom: '#fff',
//                 backgroundGradientTo: '#fff',
//                 decimalPlaces: 0,
//                 color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
//                 labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                 style: {
//                   borderRadius: 16,
//                 },
//               }}
//               bezier
//               style={styles.chart}
//             />
//           </ScrollView>
//         </View>
//       )}

//       {/* Pie Chart */}
//       {pieData.length > 0 && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Status Distribution</Text>
//           <PieChart
//             data={pieData}
//             width={screenWidth - 32}
//             height={220}
//             chartConfig={{
//               color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             }}
//             accessor="population"
//             backgroundColor="transparent"
//             paddingLeft="15"
//             absolute
//           />
//         </View>
//       )}

//       {/* Insights */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>AI Insights</Text>
//         <View style={styles.insightsCard}>
//           {stats.published > stats.drafts ? (
//             <Text style={styles.insightText}>
//               ✅ Great job! You're publishing more content than keeping in drafts.
//             </Text>
//           ) : (
//             <Text style={styles.insightText}>
//               💡 Tip: Try to publish more of your draft content to increase engagement.
//             </Text>
//           )}
          
//           {stats.avgEngagement < 100 && stats.published > 0 && (
//             <Text style={styles.insightText}>
//               📈 To improve engagement, consider posting at peak times and using more visuals.
//             </Text>
//           )}
          
//           {stats.scheduled > 0 && (
//             <Text style={styles.insightText}>
//               🗓️ You have {stats.scheduled} scheduled posts. Keep up the consistency!
//             </Text>
//           )}
          
//           {stats.failed > 0 && (
//             <Text style={styles.insightText}>
//               ⚠️ {stats.failed} posts failed to publish. Check your social account connections.
//             </Text>
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     backgroundColor: '#fff',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   dateRange: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   dateButton: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//     padding: 10,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   dateButtonText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   summaryGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     padding: 16,
//     gap: 12,
//   },
//   summaryCard: {
//     flex: 1,
//     minWidth: '45%',
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   summaryValue: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   summaryLabel: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 8,
//   },
//   section: {
//     backgroundColor: '#fff',
//     marginTop: 12,
//     padding: 16,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   engagementGrid: {
//     flexDirection: 'row',
//     gap: 12,
//   },
//   engagementCard: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//     padding: 16,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   engagementValue: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#28a745',
//   },
//   engagementLabel: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 4,
//   },
//   chart: {
//     marginVertical: 8,
//     borderRadius: 16,
//   },
//   insightsCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 16,
//   },
//   insightText: {
//     fontSize: 14,
//     color: '#333',
//     lineHeight: 20,
//     marginBottom: 12,
//   },
// });
























// app/(app)/content/analytics.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, PieChart } from 'react-native-chart-kit';
import { useContent } from '../../../../../hooks/useContent';
import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../../../../../components/common/Header';

const screenWidth = Dimensions.get('window').width;

export default function ContentAnalytics() {
  const { getStats, loading } = useContent();
  const [stats, setStats] = useState(null);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    loadStats();
  }, [startDate, endDate]);

  const loadStats = async () => {
    try {
      const data = await getStats(startDate.toISOString(), endDate.toISOString());
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const getChartData = () => {
    if (!stats) return null;
    
    return {
      labels: ['Drafts', 'Scheduled', 'Published', 'Failed', 'Review'],
      datasets: [{
        data: [
          stats.drafts || 0,
          stats.scheduled || 0,
          stats.published || 0,
          stats.failed || 0,
          stats.review || 0,
        ],
      }],
    };
  };

  const getPieData = () => {
    if (!stats) return [];
    
    return [
      {
        name: 'Published',
        population: stats.published || 0,
        color: '#28a745',
        legendFontColor: '#333',
      },
      {
        name: 'Scheduled',
        population: stats.scheduled || 0,
        color: '#17a2b8',
        legendFontColor: '#333',
      },
      {
        name: 'Drafts',
        population: stats.drafts || 0,
        color: '#ffc107',
        legendFontColor: '#333',
      },
      {
        name: 'Failed',
        population: stats.failed || 0,
        color: '#dc3545',
        legendFontColor: '#333',
      },
    ];
  };

  if (loading || !stats) {
    return <LoadingSpinner />;
  }

  const chartData = getChartData();
  const pieData = getPieData();

  return (
    <View style={styles.container}>
      <Header
        title="Content Analytics"
        showBack={true}
      />
      
      <ScrollView>
        <View style={styles.dateRange}>
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowStartPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Start: {startDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Text style={styles.dateButtonText}>
              End: {endDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        </View>
        
        {showStartPicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            onChange={(event, date) => {
              setShowStartPicker(false);
              if (date) setStartDate(date);
            }}
          />
        )}
        
        {showEndPicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            onChange={(event, date) => {
              setShowEndPicker(false);
              if (date) setEndDate(date);
            }}
          />
        )}

        {/* Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{stats.total || 0}</Text>
            <Text style={styles.summaryLabel}>Total Content</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: '#28a745' }]}>
              {stats.published || 0}
            </Text>
            <Text style={styles.summaryLabel}>Published</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: '#17a2b8' }]}>
              {stats.scheduled || 0}
            </Text>
            <Text style={styles.summaryLabel}>Scheduled</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: '#ffc107' }]}>
              {stats.drafts || 0}
            </Text>
            <Text style={styles.summaryLabel}>Drafts</Text>
          </View>
        </View>

        {/* Engagement Metrics */}
        {stats.totalEngagement !== undefined && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Engagement Metrics</Text>
            <View style={styles.engagementGrid}>
              <View style={styles.engagementCard}>
                <Text style={styles.engagementValue}>
                  {stats.totalEngagement?.toLocaleString() || 0}
                </Text>
                <Text style={styles.engagementLabel}>Total Engagement</Text>
              </View>
              <View style={styles.engagementCard}>
                <Text style={styles.engagementValue}>
                  {stats.avgEngagement?.toFixed(2) || 0}
                </Text>
                <Text style={styles.engagementLabel}>Avg Engagement</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bar Chart */}
        {chartData && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Content Distribution</Text>
            <ScrollView horizontal>
              <LineChart
                data={chartData}
                width={Math.max(screenWidth - 32, chartData.labels.length * 80)}
                height={220}
                chartConfig={{
                  backgroundColor: '#fff',
                  backgroundGradientFrom: '#fff',
                  backgroundGradientTo: '#fff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                bezier
                style={styles.chart}
              />
            </ScrollView>
          </View>
        )}

        {/* Pie Chart */}
        {pieData.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status Distribution</Text>
            <PieChart
              data={pieData}
              width={screenWidth - 32}
              height={220}
              chartConfig={{
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute
            />
          </View>
        )}

        {/* Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Insights</Text>
          <View style={styles.insightsCard}>
            {stats.published > stats.drafts ? (
              <Text style={styles.insightText}>
                ✅ Great job! You're publishing more content than keeping in drafts.
              </Text>
            ) : (
              <Text style={styles.insightText}>
                💡 Tip: Try to publish more of your draft content to increase engagement.
              </Text>
            )}
            
            {stats.avgEngagement < 100 && stats.published > 0 && (
              <Text style={styles.insightText}>
                📈 To improve engagement, consider posting at peak times and using more visuals.
              </Text>
            )}
            
            {stats.scheduled > 0 && (
              <Text style={styles.insightText}>
                🗓️ You have {stats.scheduled} scheduled posts. Keep up the consistency!
              </Text>
            )}
            
            {stats.failed > 0 && (
              <Text style={styles.insightText}>
                ⚠️ {stats.failed} posts failed to publish. Check your social account connections.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  dateRange: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  dateButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 14,
    color: '#333',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007bff',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  engagementGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  engagementCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  engagementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#28a745',
  },
  engagementLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  insightsCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 16,
  },
  insightText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
});