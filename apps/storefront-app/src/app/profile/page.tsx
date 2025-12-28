'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button, Input } from '@repo/ui-library';

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { userProfile, setUserProfile, addAddress, removeAddress, setDefaultAddress } =
    useCartStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'wishlist'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [loading, setLoading] = useState(false);

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    phone: userProfile?.phone || '',
  });

  // Address form state
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // Check authentication
  useEffect(() => {
    if (!userProfile) {
      router.push('/login');
    }
  }, [userProfile, router]);

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // TODO: Call API to update profile
      setUserProfile({
        ...userProfile,
        ...profileData,
      });
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
      alert('Please fill in all address fields');
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to add address
      const address: Address = {
        id: Math.random().toString(36).substr(2, 9),
        street: newAddress.street!,
        city: newAddress.city!,
        state: newAddress.state!,
        zip: newAddress.zip!,
        country: newAddress.country || 'USA',
      };

      addAddress(address);
      setNewAddress({ street: '', city: '', state: '', zip: '', country: '' });
      setIsAddingAddress(false);
      alert('Address added successfully!');
    } catch (error) {
      console.error('Failed to add address:', error);
      alert('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-600 mt-1">Welcome, {userProfile.name}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
              <nav className="flex flex-col">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-left font-medium transition ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`px-6 py-4 text-left font-medium transition ${
                    activeTab === 'addresses'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  📍 Addresses
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`px-6 py-4 text-left font-medium transition ${
                    activeTab === 'wishlist'
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  ❤️ Wishlist
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      Edit Profile
                    </Button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Full Name</p>
                        <p className="text-lg font-semibold text-gray-900">{userProfile.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Email</p>
                        <p className="text-lg font-semibold text-gray-900">{userProfile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Phone</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {userProfile.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Account ID</p>
                        <p className="text-lg font-semibold text-gray-900">{userProfile.id}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        value={profileData.name}
                        onChange={(e: any) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e: any) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e: any) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button onClick={handleSaveProfile} disabled={loading} className="flex-1">
                        {loading ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        onClick={() => {
                          setIsEditing(false);
                          setProfileData({
                            name: userProfile.name,
                            email: userProfile.email,
                            phone: userProfile.phone || '',
                          });
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
                  {!isAddingAddress && (
                    <Button onClick={() => setIsAddingAddress(true)}>+ Add Address</Button>
                  )}
                </div>

                {isAddingAddress && (
                  <div className="mb-8 p-6 bg-gray-50 rounded-lg border-2 border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
                    <div className="space-y-4">
                      <Input
                        type="text"
                        placeholder="Street Address"
                        value={newAddress.street || ''}
                        onChange={(e: any) =>
                          setNewAddress({ ...newAddress, street: e.target.value })
                        }
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="City"
                          value={newAddress.city || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                        />
                        <Input
                          type="text"
                          placeholder="State"
                          value={newAddress.state || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          type="text"
                          placeholder="ZIP Code"
                          value={newAddress.zip || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, zip: e.target.value })
                          }
                        />
                        <Input
                          type="text"
                          placeholder="Country"
                          value={newAddress.country || ''}
                          onChange={(e: any) =>
                            setNewAddress({ ...newAddress, country: e.target.value })
                          }
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button onClick={handleAddAddress} disabled={loading} className="flex-1">
                          {loading ? 'Adding...' : 'Add Address'}
                        </Button>
                        <Button
                          onClick={() => setIsAddingAddress(false)}
                          variant="outline"
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {userProfile.addresses && userProfile.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userProfile.addresses.map((address: Address) => (
                      <div key={address.id} className="p-4 border-2 border-gray-200 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-900">{address.street}</p>
                            <p className="text-gray-600 text-sm">
                              {address.city}, {address.state} {address.zip}
                            </p>
                            <p className="text-gray-600 text-sm">{address.country}</p>
                          </div>
                          {address.isDefault && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              Default
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2 pt-3 border-t">
                          {!address.isDefault && (
                            <button
                              onClick={() => setDefaultAddress(address.id)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              Set as Default
                            </button>
                          )}
                          <button
                            onClick={() => removeAddress(address.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium ml-auto"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No addresses saved yet</p>
                    <Button onClick={() => setIsAddingAddress(true)}>Add Your First Address</Button>
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Wishlist</h2>
                <div className="text-center py-12 text-gray-600">
                  <p className="mb-4">Wishlist feature coming soon!</p>
                  <p>View and manage your favorite products here.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
