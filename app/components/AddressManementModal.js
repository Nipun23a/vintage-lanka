import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URL for API calls - replace with your actual API base URL
const API_BASE_URL = 'http://192.168.8.151:5000/api/users';

const AddressManagementModal = ({ visible, onClose }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    _id: null
  });

  // Load user ID and addresses on component mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsedUserData = JSON.parse(userData);
          setUserId(parsedUserData.userId);
          if (visible) {
            fetchAddresses(parsedUserData.userId);
          }
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };

    loadUserData();
  }, [visible]);

  // Fetch addresses from API
  const fetchAddresses = async (userId) => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Using hardcoded API endpoint as requested
      const response = await axios.get(`${API_BASE_URL}/${userId}/addresses`);
      setAddresses(response.data);
    } catch (error) {
      console.log('Error fetching addresses:', error);
      Alert.alert('Error', 'Failed to load addresses. Please try again.');
      
      // For demo purposes: use mock data if API fails
      setAddresses([
        { _id: '1', street: '123 Main St', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
        { _id: '2', street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', zipCode: '90001', country: 'USA' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new address
  const createAddress = async () => {
    if (!validateAddress()) return;
    
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/${userId}/addresses`, currentAddress);
      fetchAddresses(userId);
      resetForm();
      Alert.alert('Success', 'Address created successfully');
    } catch (error) {
      console.log('Error creating address:', error);
      Alert.alert('Error', 'Failed to create address. Please try again.');
      
      // For demo purposes: simulate success if API fails
      const newAddress = { ...currentAddress, _id: Date.now().toString() };
      setAddresses([...addresses, newAddress]);
      resetForm();
    } finally {
      setLoading(false);
    }
  };

  // Update an existing address
  const updateAddress = async () => {
    if (!validateAddress() || !currentAddress._id) return;
    
    setLoading(true);
    try {
      await axios.put(`${API_BASE_URL}/${userId}/addresses/${currentAddress._id}`, currentAddress);
      fetchAddresses(userId);
      resetForm();
      Alert.alert('Success', 'Address updated successfully');
    } catch (error) {
      console.log('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address. Please try again.');
      
      // For demo purposes: simulate success if API fails
      const updatedAddresses = addresses.map(addr => 
        addr._id === currentAddress._id ? currentAddress : addr
      );
      setAddresses(updatedAddresses);
      resetForm();
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  // Delete an address
  const deleteAddress = async (addressId) => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              await axios.delete(`${API_BASE_URL}/${userId}/addresses/${addressId}`);
              fetchAddresses(userId);
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.log('Error deleting address:', error);
              Alert.alert('Error', 'Failed to delete address. Please try again.');
              
              // For demo purposes: simulate success if API fails
              const filteredAddresses = addresses.filter(addr => addr._id !== addressId);
              setAddresses(filteredAddresses);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  // Handle editing an address
  const handleEditAddress = (address) => {
    setCurrentAddress(address);
    setEditMode(true);
  };

  // Validate address form
  const validateAddress = () => {
    const { street, city, state, zipCode, country } = currentAddress;
    if (!street || !city || !state || !zipCode || !country) {
      Alert.alert('Error', 'All fields are required');
      return false;
    }
    return true;
  };

  // Reset form
  const resetForm = () => {
    setCurrentAddress({
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      _id: null
    });
    setEditMode(false);
  };

  // Render address card
  const renderAddressItem = ({ item }) => (
    <View style={styles.addressCard}>
      <View style={styles.addressContent}>
        <Text style={styles.addressText}>{item.street}</Text>
        <Text style={styles.addressText}>{item.city}, {item.state} {item.zipCode}</Text>
        <Text style={styles.addressText}>{item.country}</Text>
      </View>
      <View style={styles.addressActions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => handleEditAddress(item)}
        >
          <FontAwesome name="pencil" size={16} color="#3498db" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => deleteAddress(item._id)}
        >
          <FontAwesome name="trash" size={16} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Manage Addresses</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <FontAwesome name="times" size={20} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Form for adding/editing address */}
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>
              {editMode ? 'Edit Address' : 'Add New Address'}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={currentAddress.street}
              onChangeText={(text) => setCurrentAddress({...currentAddress, street: text})}
            />
            
            <TextInput
              style={styles.input}
              placeholder="City"
              value={currentAddress.city}
              onChangeText={(text) => setCurrentAddress({...currentAddress, city: text})}
            />
            
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="State"
                value={currentAddress.state}
                onChangeText={(text) => setCurrentAddress({...currentAddress, state: text})}
              />
              
              <TextInput
                style={[styles.input, styles.inputHalf]}
                placeholder="Zip Code"
                value={currentAddress.zipCode}
                onChangeText={(text) => setCurrentAddress({...currentAddress, zipCode: text})}
                keyboardType="numeric"
              />
            </View>
            
            <TextInput
              style={styles.input}
              placeholder="Country"
              value={currentAddress.country}
              onChangeText={(text) => setCurrentAddress({...currentAddress, country: text})}
            />
            
            <View style={styles.formActions}>
              {editMode && (
                <TouchableOpacity 
                  style={[styles.button, styles.cancelButton]} 
                  onPress={resetForm}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={editMode ? updateAddress : createAddress}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.saveButtonText}>
                    {editMode ? 'Update' : 'Add Address'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* List of addresses */}
          <Text style={styles.sectionTitle}>Your Addresses</Text>
          
          {loading && !editMode ? (
            <ActivityIndicator size="large" color="#3498db" style={styles.loader} />
          ) : addresses.length > 0 ? (
            <FlatList
              data={addresses}
              renderItem={renderAddressItem}
              keyExtractor={(item) => item._id.toString()}
              style={styles.addressList}
            />
          ) : (
            <View style={styles.emptyState}>
              <FontAwesome name="map-marker" size={40} color="#ccc" />
              <Text style={styles.emptyStateText}>No addresses added yet</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Montserrat_Bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
  },
  formTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_Medium',
    marginBottom: 12,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 12,
    fontSize: 14,
    fontFamily: 'Montserrat_Regular',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputHalf: {
    width: '48%',
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    minWidth: 100,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#3498db',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Montserrat_Medium',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Montserrat_Medium',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Montserrat_Bold',
    marginBottom: 12,
    color: '#333',
  },
  addressList: {
    maxHeight: 200,
  },
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addressContent: {
    flex: 1,
  },
  addressText: {
    fontSize: 14,
    fontFamily: 'Montserrat_Regular',
    color: '#444',
    marginBottom: 2,
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  emptyStateText: {
    marginTop: 10,
    color: '#999',
    fontSize: 14,
    fontFamily: 'Montserrat_Regular',
  },
  loader: {
    marginVertical: 20,
  },
});

export default AddressManagementModal;