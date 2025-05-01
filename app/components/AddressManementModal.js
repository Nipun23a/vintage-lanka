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

// Base URL for API calls - ensure this matches your server configuration
const API_BASE_URL = 'https://vintage-lanka-backend-f1fa6938e3e3.herokuapp.com/api/users';

const AddressManagementModal = ({ visible, onClose }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    _id: null
  });

  // Load user data from AsyncStorage on component mount or when modal visibility changes
  useEffect(() => {
    if (visible) {
      loadUserData();
    }
  }, [visible]);

  // Load user data from AsyncStorage
  const loadUserData = async () => {
    try {
      setLoading(true);
      const storedUserData = await AsyncStorage.getItem('userData');
      if (storedUserData) {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
        
        // Parse addresses from AsyncStorage
        if (parsedUserData.userAddresses) {
          const parsedAddresses = JSON.parse(parsedUserData.userAddresses);
          setAddresses(parsedAddresses);
        }
      }
    } catch (error) {
      console.log('Error loading user data:', error);
      Alert.alert('Error', 'Failed to load user data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update AsyncStorage with new address data
  const updateAsyncStorage = async (updatedAddresses) => {
    try {
      if (!userData) return;
      
      // Create updated userData object
      const updatedUserData = {
        ...userData,
        userAddresses: JSON.stringify(updatedAddresses)
      };
      
      // Update AsyncStorage
      await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      
      // Update local state
      setUserData(updatedUserData);
      setAddresses(updatedAddresses);

      console.log('AsyncStorage updated successfully');
    } catch (error) {
      console.log('Error updating AsyncStorage:', error);
    }
  };

  // Create a new address
  const createAddress = async () => {
    if (!validateAddress() || !userData?.userId) return;
    
    setLoading(true);
    try {
      console.log(`Calling API: ${API_BASE_URL}/${userData.userId}/addresses`);
      // Call the API to create address
      const response = await axios.post(
        `${API_BASE_URL}/${userData.userId}/addresses`, 
        currentAddress
      );
      
      // Get the new address with its ID from response
      const newAddress = response.data.address;
      
      // Update addresses array
      const updatedAddresses = [...addresses, newAddress];
      
      // Update AsyncStorage
      await updateAsyncStorage(updatedAddresses);
      
      // Reset form
      resetForm();
      Alert.alert('Success', 'Address added successfully');
    } catch (error) {
      console.log('Error creating address:', error);
      Alert.alert('Error', 'Failed to create address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update an existing address
  const updateAddress = async () => {
    if (!validateAddress() || !currentAddress._id || !userData?.userId) return;
    
    setLoading(true);
    try {
      console.log(`Updating address: ${API_BASE_URL}/${userData.userId}/addresses/${currentAddress._id}`);
      console.log('Address data:', JSON.stringify(currentAddress));
      
      // Call the API to update address
      const response = await axios.patch(
        `${API_BASE_URL}/${userData.userId}/addresses/${currentAddress._id}`, 
        {
          street: currentAddress.street,
          city: currentAddress.city,
          state: currentAddress.state,
          zipCode: currentAddress.zipCode,
          country: currentAddress.country
        }
      );
      
      // Get the updated address from response
      const updatedAddress = response.data.address;
      
      // Update addresses array
      const updatedAddresses = addresses.map(addr => 
        addr._id === currentAddress._id ? updatedAddress : addr
      );
      
      // Update AsyncStorage
      await updateAsyncStorage(updatedAddresses);
      
      // Reset form
      resetForm();
      Alert.alert('Success', 'Address updated successfully');
    } catch (error) {
      console.log('Error updating address:', error);
      Alert.alert('Error', 'Failed to update address. Please try again.');
    } finally {
      setLoading(false);
      setEditMode(false);
    }
  };

  // Delete an address
  const deleteAddress = async (addressId) => {
    if (!userData?.userId) return;
    
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
              console.log(`Deleting address: ${API_BASE_URL}/${userData.userId}/addresses/${addressId}`);
              
              // Call the API to delete address
              await axios.delete(`${API_BASE_URL}/${userData.userId}/addresses/${addressId}`);
              
              console.log('Address deleted successfully on server');
              
              // Update addresses array
              const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
              
              // Update AsyncStorage
              await updateAsyncStorage(updatedAddresses);
              
              Alert.alert('Success', 'Address deleted successfully');
            } catch (error) {
              console.log('Error deleting address:', error);
              
              // If server fails but we want to update UI anyway (fallback)
              if (error.response && error.response.status === 500) {
                console.log('Server error, updating local state anyway');
                const updatedAddresses = addresses.filter(addr => addr._id !== addressId);
                await updateAsyncStorage(updatedAddresses);
                Alert.alert('Note', 'Address removed from your device, but server update failed');
              } else {
                Alert.alert('Error', 'Failed to delete address. Please try again.');
              }
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalView: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 5
  },
  formContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 20
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputHalf: {
    width: '48%'
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10
  },
  button: {
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10
  },
  saveButton: {
    backgroundColor: '#3498db'
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#f1f1f1'
  },
  cancelButtonText: {
    color: '#333'
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10
  },
  addressList: {
    maxHeight: 300
  },
  addressCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#3498db'
  },
  addressContent: {
    flex: 1
  },
  addressText: {
    fontSize: 14,
    marginBottom: 2
  },
  addressActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  actionButton: {
    padding: 8,
    marginLeft: 5
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  emptyStateText: {
    marginTop: 10,
    color: '#888',
    fontSize: 16
  },
  loader: {
    marginVertical: 20
  }
});

export default AddressManagementModal;