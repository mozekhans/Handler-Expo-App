// src/hooks/useTeamMembers.js
import { useState, useEffect, useCallback, useMemo } from 'react';
import BusinessApi from '../../services/businessApi';

/**
 * Hook for managing team members of a business
 * @param {string} businessId - The ID of the business
 * @returns {Object} Team members data and operations
 */
export const useTeamMembers = (businessId) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);
  const [invitingEmail, setInvitingEmail] = useState(null);

  // Load team members
  const loadTeamMembers = useCallback(async () => {
    if (!businessId) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await BusinessApi.getTeamMembers(businessId);
      setTeamMembers(response.teamMembers || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  // Invite team member
  const inviteMember = useCallback(async (email, role, permissions = []) => {
    try {
      setInvitingEmail(email);
      setError(null);
      
      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Check if already a member
      const existingMember = teamMembers.find(
        m => m.user?.email?.toLowerCase() === email.toLowerCase()
      );
      if (existingMember) {
        throw new Error('This user is already a team member');
      }
      
      const response = await BusinessApi.inviteTeamMember(businessId, {
        email,
        role,
        permissions,
      });
      
      await loadTeamMembers();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to invite team member');
      throw err;
    } finally {
      setInvitingEmail(null);
    }
  }, [businessId, teamMembers, loadTeamMembers]);

  // Update team member
  const updateMember = useCallback(async (memberId, data) => {
    try {
      setError(null);
      const response = await BusinessApi.updateTeamMember(businessId, memberId, data);
      await loadTeamMembers();
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update team member');
      throw err;
    }
  }, [businessId, loadTeamMembers]);

  // Remove team member
  const removeMember = useCallback(async (memberId) => {
    try {
      setError(null);
      await BusinessApi.removeTeamMember(businessId, memberId);
      await loadTeamMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove team member');
      throw err;
    }
  }, [businessId, loadTeamMembers]);

  // Bulk remove team members
  const bulkRemoveMembers = useCallback(async (memberIds) => {
    try {
      setError(null);
      const promises = memberIds.map(id => 
        BusinessApi.removeTeamMember(businessId, id)
      );
      await Promise.all(promises);
      await loadTeamMembers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove team members');
      throw err;
    }
  }, [businessId, loadTeamMembers]);

  // Get member by ID
  const getMemberById = useCallback((memberId) => {
    return teamMembers.find(m => m.user?._id === memberId || m._id === memberId);
  }, [teamMembers]);

  // Filter and sort members
  const filteredMembers = useMemo(() => {
    let filtered = [...teamMembers];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(member => {
        const user = member.user || {};
        return (
          user.firstName?.toLowerCase().includes(query) ||
          user.lastName?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          member.role?.toLowerCase().includes(query)
        );
      });
    }

    // Apply role filter
    if (filterRole) {
      filtered = filtered.filter(member => member.role === filterRole);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(member => member.status === filterStatus);
    }

    return filtered;
  }, [teamMembers, searchQuery, filterRole, filterStatus]);

  // Get team statistics
  const getStats = useMemo(() => {
    const total = teamMembers.length;
    const active = teamMembers.filter(m => m.status === 'active').length;
    const pending = teamMembers.filter(m => m.status === 'pending').length;
    const inactive = teamMembers.filter(m => m.status === 'inactive').length;
    
    const byRole = {
      admin: teamMembers.filter(m => m.role === 'admin').length,
      editor: teamMembers.filter(m => m.role === 'editor').length,
      viewer: teamMembers.filter(m => m.role === 'viewer').length,
    };

    return {
      total,
      active,
      pending,
      inactive,
      byRole,
    };
  }, [teamMembers]);

  // Get available roles
  const getAvailableRoles = useCallback(() => {
    return [
      { 
        value: 'admin', 
        label: 'Administrator', 
        description: 'Full access to all features including team management, settings, and billing' 
      },
      { 
        value: 'editor', 
        label: 'Editor', 
        description: 'Can create, edit, and schedule content. Cannot manage team or settings' 
      },
      { 
        value: 'viewer', 
        label: 'Viewer', 
        description: 'View-only access to content and analytics' 
      },
    ];
  }, []);

  // Clear filters
  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterRole(null);
    setFilterStatus(null);
  }, []);

  // Load on mount and when businessId changes
  useEffect(() => {
    if (businessId) {
      loadTeamMembers();
    }
  }, [businessId, loadTeamMembers]);

  return {
    teamMembers: filteredMembers,
    allTeamMembers: teamMembers,
    loading,
    error,
    
    // Stats
    stats: getStats,
    
    // Filters
    searchQuery,
    filterRole,
    filterStatus,
    setSearchQuery,
    setFilterRole,
    setFilterStatus,
    clearFilters,
    
    // CRUD Operations
    loadTeamMembers,
    inviteMember,
    updateMember,
    removeMember,
    bulkRemoveMembers,
    
    // Utilities
    getMemberById,
    getAvailableRoles,
    invitingEmail,
  };
};

export default useTeamMembers;