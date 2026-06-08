import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Save, Loader2, X, AlertTriangle, RotateCcw } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { getUserProfile, updateUserProfile, requestAccountDeletion, cancelAccountDeletion, getDeletionStatus } from '../../services/api';

export function ProfilePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  
  // Account deletion state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletionStatus, setDeletionStatus] = useState(null);
  const [deletionLoading, setDeletionLoading] = useState(false);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/signin');
          return;
        }

        const currentUser = JSON.parse(userData);
        
        // Fetch full user profile from backend
        const profile = await getUserProfile(currentUser.userId);
        
        setUser(profile);
        setFormData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          address: profile.address || '',
        });
        
        // Check deletion status
        try {
          const status = await getDeletionStatus();
          if (status.status === 'PENDING') {
            setDeletionStatus(status);
          }
        } catch (err) {
          // Ignore if no pending deletion
        }
      } catch (error) {
        toast.error(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const userData = localStorage.getItem('user');
      const currentUser = JSON.parse(userData);

      // Don't send password in update
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        role: user.role, // Keep the same role
      };

      const updatedProfile = await updateUserProfile(currentUser.userId, updateData);
      
      // Update localStorage with new user data (keeping token)
      const updatedUser = {
        ...currentUser,
        name: updatedProfile.name,
        email: updatedProfile.email,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      window.dispatchEvent(new Event('userLogin'));

      setUser(updatedProfile);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
    });
    setEditing(false);
  };

  const handleDeleteAccount = async () => {
    if (!deleteReason.trim()) {
      toast.error('Please provide a reason for deletion');
      return;
    }

    setDeletionLoading(true);
    try {
      const result = await requestAccountDeletion(deleteReason);
      setDeletionStatus(result);
      setShowDeleteModal(false);
      setDeleteReason('');
      toast.success('Account deletion requested. Your account will be deleted in 5 days.');
    } catch (error) {
      toast.error(error.message || 'Failed to request account deletion');
    } finally {
      setDeletionLoading(false);
    }
  };

  const handleCancelDeletion = async () => {
    setDeletionLoading(true);
    try {
      await cancelAccountDeletion();
      setDeletionStatus(null);
      toast.success('Account deletion has been cancelled');
    } catch (error) {
      toast.error(error.message || 'Failed to cancel deletion');
    } finally {
      setDeletionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-gray-600 mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center">
                    <User className="h-10 w-10 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">{user?.name || 'User'}</h1>
                    <p className="text-blue-100 mt-1">{user?.email}</p>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500 text-white">
                        {user?.role || 'BUYER'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate(-1)}
                  className="p-2 hover:bg-blue-500 rounded-full transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Full Name
                      </div>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        editing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email Address
                      </div>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        editing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Phone Number
                      </div>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!editing}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        editing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Address
                      </div>
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!editing}
                      rows="3"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        editing ? 'bg-white border-gray-300' : 'bg-gray-50 border-gray-200'
                      }`}
                    />
                  </div>

                  {/* Role (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Type
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="font-medium text-gray-900">{user?.role || 'BUYER'}</span>
                    </div>
                  </div>

                  {/* User ID (Read-only) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User ID
                    </label>
                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <span className="font-mono text-sm text-gray-600">{user?.userId}</span>
                    </div>
                  </div>
                </div>

              {/* Account Deletion Warning */}
              {deletionStatus && deletionStatus.status === 'PENDING' && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-red-800">
                        Your account is scheduled for deletion
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        Your account will be permanently deleted on{' '}
                        <strong>{new Date(deletionStatus.scheduledDeletionDate).toLocaleDateString()}</strong>.
                        You can cancel this request at any time before then.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={handleCancelDeletion}
                      disabled={deletionLoading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Cancel Deletion
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {editing && (
                <div className="mt-8 flex gap-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
              </form>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> Your password is securely encrypted and cannot be viewed. 
              To change your password, please contact support or use the password reset feature.
            </p>
          </div>

          {/* Danger Zone */}
          {!deletionStatus && (
            <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden border border-red-200">
              <div className="bg-red-50 px-6 py-4 border-b border-red-200">
                <h2 className="text-lg font-semibold text-red-800">Danger Zone</h2>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Delete Account</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Permanently delete your account and all associated data. This action cannot be undone after 5 days.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
                  <p className="text-sm text-gray-500">This action will schedule your account for deletion</p>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-3">
                  Your account will be <strong>permanently deleted after 5 days</strong>. During this period, you can cancel the deletion request by logging in and visiting this page.
                </p>
                <p className="text-sm text-gray-600">
                  Please provide a reason for leaving (optional):
                </p>
              </div>

              <textarea
                value={deleteReason}
                onChange={(e) => setDeleteReason(e.target.value)}
                placeholder="Tell us why you're leaving (optional)"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />

              <div className="mt-6 flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={deletionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deletionLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm Deletion'
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteReason('');
                  }}
                  disabled={deletionLoading}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
