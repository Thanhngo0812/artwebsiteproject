import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './css/ProfilePage.css';

export default function ProfilePage() {
  const { user, logout, updateUser } = useContext(useAuth);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Tabs management
  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);
  
  // Profile editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  // Address management
  const [addresses, setAddresses] = useState([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addressForm, setAddressForm] = useState({
    isDefault: false,
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    postalCode: '',
    phone: ''
  });

  // Orders
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

  useEffect(() => {
    if (user) {
      // Parse full name to firstName and lastName
      const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
      setProfileForm({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      });
      
      // Fetch data
      if (activeTab === 'orders') {
        fetchOrders();
      } else {
        fetchAddresses();
      }
    }
  }, [user, activeTab]);

  const fetchAddresses = async () => {
    setLoadingAddresses(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8888/api/addresses/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error('Error fetching addresses:', error);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8888/api/orders/user/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/profile?tab=${tab}`);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEditProfile = () => {
    setIsEditingProfile(false);
    const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
    setProfileForm({
      firstName: nameParts[0] || '',
      lastName: nameParts.slice(1).join(' ') || '',
      email: user.email || ''
    });
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const fullName = `${profileForm.firstName} ${profileForm.lastName}`.trim();
      
      const response = await fetch(`http://localhost:8888/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          fullName,
          email: profileForm.email
        })
      });

      if (response.ok) {
        updateUser({ fullName, email: profileForm.email });
        setIsEditingProfile(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleAddAddress = () => {
    setIsAddingAddress(true);
  };

  const handleCancelAddAddress = () => {
    setIsAddingAddress(false);
    setAddressForm({
      isDefault: false,
      firstName: '',
      lastName: '',
      address: '',
      apartment: '',
      city: '',
      postalCode: '',
      phone: ''
    });
  };

  const handleSaveAddress = async () => {
    try {
      const token = localStorage.getItem('token');
      const fullAddress = [
        addressForm.address,
        addressForm.apartment,
        addressForm.city,
        addressForm.postalCode
      ].filter(Boolean).join(', ');

      const response = await fetch(`http://localhost:8888/api/addresses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          addressName: `${addressForm.firstName} ${addressForm.lastName}`,
          address: fullAddress,
          phoneNumber: addressForm.phone,
          isDefault: addressForm.isDefault
        })
      });

      if (response.ok) {
        fetchAddresses();
        handleCancelAddAddress();
        alert('Address added successfully!');
      } else {
        alert('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Error adding address');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="profile-page">
      {/* Header Navigation */}
      <div className="profile-header">
        <div className="profile-header-left">
          <Link to="/" className="profile-logo">
            <img src="/logo.png" alt="Logo" />
          </Link>
          
          <nav className="profile-nav">
            <Link to="/" className="profile-nav-item">Shop</Link>
            <button 
              className={`profile-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => handleTabChange('orders')}
            >
              Orders
            </button>
            <button 
              className={`profile-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabChange('profile')}
            >
              Profile
            </button>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Log out
        </button>
      </div>

      <div className="profile-container">
        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>Orders</h2>
            {loadingOrders ? (
              <div className="loading">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="empty-state">
                <p>You haven't placed any orders yet.</p>
                <Link to="/products" className="shop-now-btn">Shop now</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-number">Order #{order.id}</span>
                        <span className="order-date">{formatDate(order.createdAt)}</span>
                      </div>
                      <span className={`order-status ${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="order-items">
                      {order.items?.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={item.thumbnail} alt={item.productName} />
                          <div className="order-item-details">
                            <h4>{item.productName}</h4>
                            <p>Size: {item.dimensions}</p>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                          <span className="order-item-price">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="order-total">
                      Total: <strong>{formatPrice(order.totalAmount)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="profile-section">
            <h2>Profile</h2>
            
            {/* Profile Info Card */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Name</h3>
                <button className="edit-btn" onClick={handleEditProfile}>
                  ✏️
                </button>
              </div>
              <div className="card-content">
                <p className="label">Email</p>
                <p className="value">{user?.email}</p>
              </div>
            </div>

            {/* Addresses Card */}
            <div className="profile-card">
              <div className="card-header">
                <h3>Addresses</h3>
                <button className="add-btn" onClick={handleAddAddress}>
                  + Add
                </button>
              </div>
              <div className="card-content">
                {loadingAddresses ? (
                  <div className="loading">Loading addresses...</div>
                ) : addresses.length === 0 ? (
                  <div className="empty-state">
                    <span className="info-icon">ℹ️</span>
                    <span>No addresses added</span>
                  </div>
                ) : (
                  <div className="addresses-list">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="address-item">
                        <div className="address-details">
                          <strong>{addr.addressName}</strong>
                          <p>{addr.address}</p>
                          <p>{addr.phoneNumber}</p>
                        </div>
                        {addr.isDefault && <span className="badge">Default</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="modal-overlay" onClick={handleCancelEditProfile}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit profile</h2>
              <button className="close-btn" onClick={handleCancelEditProfile}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="First name"
                  value={profileForm.firstName}
                  onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={profileForm.lastName}
                  onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                  className="form-input"
                  disabled
                />
                <small>This email is used for sign-in and order updates.</small>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCancelEditProfile}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveProfile}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="modal-overlay" onClick={handleCancelAddAddress}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add address</h2>
              <button className="close-btn" onClick={handleCancelAddAddress}>✕</button>
            </div>
            <div className="modal-body">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                />
                <span>This is my default address</span>
              </label>

              <div className="form-group">
                <label>Country/region</label>
                <select className="form-input" disabled>
                  <option>Vietnam</option>
                </select>
              </div>

              <div className="form-row">
                <input
                  type="text"
                  placeholder="First name"
                  value={addressForm.firstName}
                  onChange={(e) => setAddressForm({...addressForm, firstName: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Last name"
                  value={addressForm.lastName}
                  onChange={(e) => setAddressForm({...addressForm, lastName: e.target.value})}
                  className="form-input"
                />
              </div>

              <input
                type="text"
                placeholder="Address"
                value={addressForm.address}
                onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                className="form-input full-width"
              />

              <input
                type="text"
                placeholder="Apartment, suite, etc (optional)"
                value={addressForm.apartment}
                onChange={(e) => setAddressForm({...addressForm, apartment: e.target.value})}
                className="form-input full-width"
              />

              <div className="form-row">
                <input
                  type="text"
                  placeholder="City"
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                  className="form-input"
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  value={addressForm.postalCode}
                  onChange={(e) => setAddressForm({...addressForm, postalCode: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <div className="phone-input">
                  <span className="flag">🇻🇳</span>
                  <span className="code">+84</span>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCancelAddAddress}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveAddress}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}