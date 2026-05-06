// // src/stores/businessStore.js
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import BusinessApi from '../services/businessApi';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// export const useBusinessStore = create(
//   persist(
//     (set, get) => ({
//       businesses: [],
//       currentBusiness: null,
//       aiLearning: null,
//       loading: false,
//       error: null,

//       setLoading: (loading) => set({ loading }),
//       setError: (error) => set({ error }),
//       clearError: () => set({ error: null }),

//       loadBusinesses: async () => {
//         try {
//           set({ loading: true, error: null });
//           const response = await BusinessApi.getBusinesses();
//           set({ businesses: response.businesses, loading: false });
          
//           // Load saved current business
//           const savedBusinessId = await AsyncStorage.getItem('currentBusinessId');
//           if (savedBusinessId && response.businesses.length > 0) {
//             const business = response.businesses.find(b => b._id === savedBusinessId);
//             if (business) {
//               await get().loadBusiness(business._id);
//             }
//           }
//         } catch (error) {
//           set({ 
//             error: error.response?.data?.message || 'Failed to load businesses',
//             loading: false 
//           });
//         }
//       },

//       loadBusiness: async (businessId) => {
//         try {
//           set({ loading: true, error: null });
//           const response = await BusinessApi.getBusiness(businessId);
//           set({ 
//             currentBusiness: response.business,
//             aiLearning: response.aiLearning,
//             loading: false 
//           });
//           await AsyncStorage.setItem('currentBusinessId', businessId);
//         } catch (error) {
//           set({ 
//             error: error.response?.data?.message || 'Failed to load business',
//             loading: false 
//           });
//         }
//       },

//       createBusiness: async (data) => {
//         try {
//           set({ loading: true, error: null });
//           const response = await BusinessApi.createBusiness(data);
//           set(state => ({ 
//             businesses: [...state.businesses, response.business],
//             loading: false 
//           }));
//           return response;
//         } catch (error) {
//           set({ 
//             error: error.response?.data?.message || 'Failed to create business',
//             loading: false 
//           });
//           throw error;
//         }
//       },

//       updateBusiness: async (businessId, data) => {
//         try {
//           set({ loading: true, error: null });
//           const response = await BusinessApi.updateBusiness(businessId, data);
//           set(state => ({
//             businesses: state.businesses.map(b => 
//               b._id === businessId ? response.business : b
//             ),
//             currentBusiness: state.currentBusiness?._id === businessId 
//               ? response.business 
//               : state.currentBusiness,
//             loading: false
//           }));
//           return response;
//         } catch (error) {
//           set({ 
//             error: error.response?.data?.message || 'Failed to update business',
//             loading: false 
//           });
//           throw error;
//         }
//       },

//       deleteBusiness: async (businessId) => {
//         try {
//           set({ loading: true, error: null });
//           await BusinessApi.deleteBusiness(businessId);
//           set(state => ({
//             businesses: state.businesses.filter(b => b._id !== businessId),
//             currentBusiness: state.currentBusiness?._id === businessId 
//               ? null 
//               : state.currentBusiness,
//             loading: false
//           }));
//           await AsyncStorage.removeItem('currentBusinessId');
//         } catch (error) {
//           set({ 
//             error: error.response?.data?.message || 'Failed to delete business',
//             loading: false 
//           });
//           throw error;
//         }
//       },

//       switchBusiness: async (businessId) => {
//         try {
//           await BusinessApi.switchBusiness(businessId);
//           await get().loadBusiness(businessId);
//         } catch (error) {
//           set({ 
//             error: error.response?.data?.message || 'Failed to switch business'
//           });
//           throw error;
//         }
//       },

//       reset: () => {
//         set({
//           businesses: [],
//           currentBusiness: null,
//           aiLearning: null,
//           loading: false,
//           error: null,
//         });
//       },
//     }),
//     {
//       name: 'business-storage',
//       getStorage: () => AsyncStorage,
//       partialize: (state) => ({
//         businesses: state.businesses,
//         currentBusiness: state.currentBusiness,
//       }),
//     }
//   )
// );





// src/stores/businessStore.js
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import BusinessApi from '../services/businessApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useBusinessStore = create(
  persist(
    (set, get) => ({
      businesses: [],
      currentBusiness: null,
      aiLearning: null,
      loading: false,
      error: null,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      clearError: () => set({ error: null }),

      loadBusinesses: async () => {
        try {
          set({ loading: true, error: null });
          const response = await BusinessApi.getBusinesses();
          
          if (!response || !response.businesses) {
            throw new Error('Invalid response from server');
          }
          
          set({ businesses: response.businesses, loading: false });
          
          // Load saved current business
          try {
            const savedBusinessId = await AsyncStorage.getItem('currentBusinessId');
            if (savedBusinessId && response.businesses.length > 0) {
              const business = response.businesses.find(b => b._id === savedBusinessId);
              if (business) {
                await get().loadBusiness(business._id);
              } else {
                // Clear invalid saved business ID
                await AsyncStorage.removeItem('currentBusinessId');
              }
            }
          } catch (storageError) {
            console.warn('Failed to access AsyncStorage:', storageError);
            // Continue without saved business - non-critical error
          }
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to load businesses',
            loading: false 
          });
        }
      },

      loadBusiness: async (businessId) => {
        if (!businessId) {
          set({ error: 'Invalid business ID', loading: false });
          return;
        }
        
        try {
          set({ loading: true, error: null });
          const response = await BusinessApi.getBusiness(businessId);
          
          if (!response || !response.business) {
            throw new Error('Invalid business data received');
          }
          
          set({ 
            currentBusiness: response.business,
            aiLearning: response.aiLearning || null,
            loading: false 
          });
          
          try {
            await AsyncStorage.setItem('currentBusinessId', businessId);
          } catch (storageError) {
            console.warn('Failed to save current business to storage:', storageError);
            // Non-critical error, continue
          }
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to load business',
            loading: false 
          });
          throw error;
        }
      },

      createBusiness: async (data) => {
        try {
          set({ loading: true, error: null });
          const response = await BusinessApi.createBusiness(data);
          
          if (!response || !response.business) {
            throw new Error('Failed to create business');
          }
          
          set(state => ({ 
            businesses: [...state.businesses, response.business],
            loading: false 
          }));
          return response;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to create business',
            loading: false 
          });
          throw error;
        }
      },

      updateBusiness: async (businessId, data) => {
        try {
          set({ loading: true, error: null });
          const response = await BusinessApi.updateBusiness(businessId, data);
          
          if (!response || !response.business) {
            throw new Error('Failed to update business');
          }
          
          set(state => ({
            businesses: state.businesses.map(b => 
              b._id === businessId ? response.business : b
            ),
            currentBusiness: state.currentBusiness?._id === businessId 
              ? response.business 
              : state.currentBusiness,
            loading: false
          }));
          return response;
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to update business',
            loading: false 
          });
          throw error;
        }
      },

      deleteBusiness: async (businessId) => {
        try {
          set({ loading: true, error: null });
          await BusinessApi.deleteBusiness(businessId);
          
          set(state => {
            const newBusinesses = state.businesses.filter(b => b._id !== businessId);
            const newCurrentBusiness = state.currentBusiness?._id === businessId 
              ? null 
              : state.currentBusiness;
            
            return {
              businesses: newBusinesses,
              currentBusiness: newCurrentBusiness,
              loading: false
            };
          });
          
          try {
            const currentId = get().currentBusiness?._id;
            if (currentId) {
              await AsyncStorage.setItem('currentBusinessId', currentId);
            } else {
              await AsyncStorage.removeItem('currentBusinessId');
            }
          } catch (storageError) {
            console.warn('Failed to update storage after deletion:', storageError);
          }
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to delete business',
            loading: false 
          });
          throw error;
        }
      },

      switchBusiness: async (businessId) => {
        if (!businessId) {
          throw new Error('Business ID is required');
        }
        
        try {
          set({ loading: true, error: null });
          await BusinessApi.switchBusiness(businessId);
          await get().loadBusiness(businessId);
        } catch (error) {
          set({ 
            error: error.response?.data?.message || error.message || 'Failed to switch business',
            loading: false 
          });
          throw error;
        }
      },

      reset: () => {
        set({
          businesses: [],
          currentBusiness: null,
          aiLearning: null,
          loading: false,
          error: null,
        });
        // Clear storage on reset
        try {
          AsyncStorage.removeItem('currentBusinessId');
        } catch (error) {
          console.warn('Failed to clear storage on reset:', error);
        }
      },
    }),
    {
      name: 'business-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        businesses: state.businesses,
        currentBusiness: state.currentBusiness,
      }),
      onRehydrateStorage: () => (state) => {
        // Mark store as hydrated after rehydration
        if (state) {
          state.setHydrated();
        }
      },
    }
  )
);