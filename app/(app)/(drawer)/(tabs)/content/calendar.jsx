// // app/(app)/content/calendar.jsx
// import React, { useState, useEffect } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   ScrollView,
//   TouchableOpacity,
//   RefreshControl,
// } from 'react-native';
// // import { Calendar } from 'react-native-calendars';
// import * as Calendar from 'expo-calendar';
// import { useContent } from '../../../../../hooks/useContent';
// import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
// import { useRouter } from 'expo-router';

// export default function ContentCalendar() {
//   const router = useRouter();
//   const { getContentCalendar, loading } = useContent();
//   const [selectedDate, setSelectedDate] = useState('');
//   const [calendarData, setCalendarData] = useState({});
//   const [markedDates, setMarkedDates] = useState({});
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     const now = new Date();
//     loadCalendar(now.getMonth() + 1, now.getFullYear());
//   }, []);

//   const loadCalendar = async (month, year) => {
//     try {
//       const data = await getContentCalendar(month, year);
//       setCalendarData(data);
      
//       // Mark dates with content
//       const marked = {};
//       Object.keys(data).forEach(date => {
//         marked[date] = {
//           marked: true,
//           dotColor: '#007bff',
//           selected: date === selectedDate,
//         };
//       });
//       setMarkedDates(marked);
//     } catch (error) {
//       console.error('Failed to load calendar:', error);
//     }
//   };

//   const onDayPress = (day) => {
//     setSelectedDate(day.dateString);
//   };

//   const getContentForDate = (date) => {
//     return calendarData[date] || [];
//   };

//   const onRefresh = async () => {
//     setRefreshing(true);
//     const now = new Date();
//     await loadCalendar(now.getMonth() + 1, now.getFullYear());
//     setRefreshing(false);
//   };

//   const onMonthChange = (month) => {
//     loadCalendar(month.month, month.year);
//   };

//   const scheduledContent = getContentForDate(selectedDate);

//   return (
//     <ScrollView
//       style={styles.container}
//       refreshControl={
//         <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
//       }
//     >
//       <Calendar
//         onDayPress={onDayPress}
//         markedDates={markedDates}
//         onMonthChange={onMonthChange}
//         theme={{
//           selectedDayBackgroundColor: '#007bff',
//           todayTextColor: '#007bff',
//           arrowColor: '#007bff',
//         }}
//       />

//       {selectedDate && (
//         <View style={styles.scheduleSection}>
//           <Text style={styles.scheduleTitle}>
//             Scheduled for {new Date(selectedDate).toLocaleDateString()}
//           </Text>
          
//           {scheduledContent.length === 0 ? (
//             <View style={styles.emptySchedule}>
//               <Text style={styles.emptyText}>No content scheduled for this day</Text>
//               <TouchableOpacity
//                 style={styles.createButton}
//                 onPress={() => router.push('/content/create')}
//               >
//                 <Text style={styles.createButtonText}>Create Content</Text>
//               </TouchableOpacity>
//             </View>
//           ) : (
//             scheduledContent.map((item, index) => (
//               <TouchableOpacity
//                 key={index}
//                 style={styles.scheduleCard}
//                 onPress={() => router.push(`/content/${item.id}`)}
//               >
//                 <View style={styles.scheduleHeader}>
//                   <Text style={styles.scheduleTime}>{item.time || 'All day'}</Text>
//                   <View style={styles.platformBadge}>
//                     <Text style={styles.platformBadgeText}>{item.platform}</Text>
//                   </View>
//                 </View>
//                 <Text style={styles.scheduleTitle}>{item.title}</Text>
//                 <Text style={styles.scheduleAuthor}>By: {item.createdBy?.firstName || 'Unknown'}</Text>
//               </TouchableOpacity>
//             ))
//           )}
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scheduleSection: {
//     backgroundColor: '#fff',
//     marginTop: 12,
//     padding: 16,
//   },
//   scheduleTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 16,
//   },
//   emptySchedule: {
//     alignItems: 'center',
//     paddingVertical: 40,
//   },
//   emptyText: {
//     fontSize: 14,
//     color: '#999',
//     marginBottom: 16,
//   },
//   createButton: {
//     backgroundColor: '#007bff',
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     borderRadius: 8,
//   },
//   createButtonText: {
//     color: '#fff',
//     fontWeight: '600',
//   },
//   scheduleCard: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//   },
//   scheduleHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   scheduleTime: {
//     fontSize: 12,
//     color: '#666',
//   },
//   platformBadge: {
//     backgroundColor: '#e7f3ff',
//     paddingHorizontal: 8,
//     paddingVertical: 4,
//     borderRadius: 4,
//   },
//   platformBadgeText: {
//     fontSize: 11,
//     color: '#007bff',
//     textTransform: 'capitalize',
//   },
//   scheduleTitle: {
//     fontSize: 16,
//     fontWeight: '500',
//     marginBottom: 4,
//   },
//   scheduleAuthor: {
//     fontSize: 12,
//     color: '#999',
//   },
// });





















// app/(app)/content/calendar.jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import * as CalendarModule from 'expo-calendar';
import { useContent } from '../../../../../hooks/useContent';
import LoadingSpinner from '../../../../../components/content/LoadingSpinner';
import { useRouter } from 'expo-router';
import Header from '../../../../../components/common/Header';
import { Ionicons } from '@expo/vector-icons';

export default function ContentCalendar() {
  const router = useRouter();
  const { getContentCalendar, loading } = useContent();
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarData, setCalendarData] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const now = new Date();
    loadCalendar(now.getMonth() + 1, now.getFullYear());
  }, []);

  const loadCalendar = async (month, year) => {
    try {
      const data = await getContentCalendar(month, year);
      setCalendarData(data);
      
      const marked = {};
      Object.keys(data).forEach(date => {
        marked[date] = {
          marked: true,
          dotColor: '#007bff',
          selected: date === selectedDate,
        };
      });
      setMarkedDates(marked);
    } catch (error) {
      console.error('Failed to load calendar:', error);
    }
  };

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const getContentForDate = (date) => {
    return calendarData[date] || [];
  };

  const onRefresh = async () => {
    setRefreshing(true);
    const now = new Date();
    await loadCalendar(now.getMonth() + 1, now.getFullYear());
    setRefreshing(false);
  };

  const onMonthChange = (month) => {
    loadCalendar(month.month, month.year);
  };

  const scheduledContent = getContentForDate(selectedDate);

  return (
    <View style={styles.container}>
      <Header
        title="Content Calendar"
        showBack={true}
        rightComponent={
          <TouchableOpacity onPress={() => router.push('/content/create')}>
            <Ionicons name="add" size={24} color="#333" />
          </TouchableOpacity>
        }
      />
      
      <ScrollView
        style={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.calendarContainer}>
          {/* Calendar component would go here */}
          {/* Using a placeholder since we don't have the exact Calendar component */}
          <View style={styles.calendarPlaceholder}>
            <Text style={styles.calendarPlaceholderText}>Calendar View</Text>
            <Text style={styles.calendarSubtext}>Select a date to view scheduled content</Text>
          </View>
        </View>

        {selectedDate && (
          <View style={styles.scheduleSection}>
            <Text style={styles.scheduleTitle}>
              Scheduled for {new Date(selectedDate).toLocaleDateString()}
            </Text>
            
            {scheduledContent.length === 0 ? (
              <View style={styles.emptySchedule}>
                <Text style={styles.emptyText}>No content scheduled for this day</Text>
                <TouchableOpacity
                  style={styles.createButton}
                  onPress={() => router.push('/content/create')}
                >
                  <Text style={styles.createButtonText}>Create Content</Text>
                </TouchableOpacity>
              </View>
            ) : (
              scheduledContent.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.scheduleCard}
                  onPress={() => router.push(`/content/${item.id}`)}
                >
                  <View style={styles.scheduleHeader}>
                    <Text style={styles.scheduleTime}>{item.time || 'All day'}</Text>
                    <View style={styles.platformBadge}>
                      <Text style={styles.platformBadgeText}>{item.platform}</Text>
                    </View>
                  </View>
                  <Text style={styles.scheduleCardTitle}>{item.title}</Text>
                  <Text style={styles.scheduleAuthor}>By: {item.createdBy?.firstName || 'Unknown'}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flex: 1,
  },
  calendarContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  calendarPlaceholder: {
    height: 350,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  calendarPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  calendarSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  scheduleSection: {
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  emptySchedule: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  scheduleCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleTime: {
    fontSize: 12,
    color: '#666',
  },
  platformBadge: {
    backgroundColor: '#e7f3ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  platformBadgeText: {
    fontSize: 11,
    color: '#007bff',
    textTransform: 'capitalize',
  },
  scheduleCardTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  scheduleAuthor: {
    fontSize: 12,
    color: '#999',
  },
});