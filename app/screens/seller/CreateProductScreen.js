import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase'; // Make sure to create this file (see below)

export default function CreateProductScreen({ navigation }) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [images, setImages] = useState([]);
  const [imageUris, setImageUris] = useState([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  // Conditions for product
  const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

  useEffect(() => {
    // Request permission to access the camera roll
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'We need camera roll permission to upload images.');
        }
      }
    })();

    // Fetch categories from your API
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://192.168.8.151:5000/api/category');
      if (response.data && response.data.categories) {
        setCategories(response.data.categories);
      } else {
        throw new Error('Invalid category data format');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      Alert.alert('Error', 'Failed to load categories. Please try again.');
    }
  };

  const pickImages = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        // Limit to max 5 images
        const newImages = result.assets.slice(0, 5 - images.length);
        
        // Add the selected images to the state
        setImages([...images, ...newImages]);
        setImageUris([...imageUris, ...newImages.map(img => img.uri)]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert('Error', 'Failed to pick images. Please try again.');
    }
  };

  const removeImage = (index) => {
    const newImages = [...images];
    const newImageUris = [...imageUris];
    newImages.splice(index, 1);
    newImageUris.splice(index, 1);
    setImages(newImages);
    setImageUris(newImageUris);
    
    // Adjust mainImageIndex if needed
    if (mainImageIndex === index) {
      // Set to first image or -1 if no images left
      setMainImageIndex(newImages.length > 0 ? 0 : -1);
    } else if (mainImageIndex > index) {
      // Adjust index if a preceding image was removed
      setMainImageIndex(mainImageIndex - 1);
    }
  };
  
  const setAsMainImage = (index) => {
    setMainImageIndex(index);
  };

  const uploadImageToFirebase = async (uri) => {
    try {
      // Convert uri to blob
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Create a unique filename
      const filename = `items/${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
      const storageRef = ref(storage, filename);
      
      // Upload to Firebase Storage
      const uploadTask = uploadBytesResumable(storageRef, blob);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Track upload progress if needed
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            // Handle error
            console.error('Upload error:', error);
            reject(error);
          },
          async () => {
            // Upload completed successfully, get the download URL
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const uploadAllImages = async () => {
    try {
      const uploadPromises = imageUris.map(uri => uploadImageToFirebase(uri));
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  };

  const handleSubmit = async (isDraft = false) => {
    try {
      if (!title || !description || !price || !category || !quantity) {
        Alert.alert('Validation Error', 'Please fill in all required fields.');
        return;
      }

      if (images.length === 0) {
        Alert.alert('Validation Error', 'Please add at least one image.');
        return;
      }
      
      if (mainImageIndex === -1) {
        Alert.alert('Validation Error', 'Please select a main image.');
        return;
      }

      // Start loading state
      setLoading(true);

      // Get the user ID from AsyncStorage
      const userDataString = await AsyncStorage.getItem('userData');
      if (!userDataString) {
        throw new Error('User data not found');
      }
      const userData = JSON.parse(userDataString);
      const sellerId = userData.userId;

      // Upload all images to Firebase
      const imageUrls = await uploadAllImages();

      // Prepare the product data
      const productData = {
        title,
        description,
        category,
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : undefined,
        quantity: parseInt(quantity, 10),
        condition,
        images: imageUrls,
        mainImage: imageUrls[mainImageIndex], // Use the selected main image
        seller: sellerId,
        status: isDraft ? 'Draft' : 'Active'
      };

      // Send the data to your API
      const response = await axios.post(
        'http://192.168.8.151:5000/api/products',
        productData
      );

      // Handle success
      Alert.alert(
        'Success',
        `Product ${isDraft ? 'saved as draft' : 'published'} successfully!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );

    } catch (error) {
      console.error('Error creating product:', error);
      Alert.alert('Error', 'Failed to create product. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const renderCategoryItem = (item) => (
    <TouchableOpacity
      key={item._id}
      style={styles.categoryItem}
      onPress={() => {
        setCategory(item._id);
        setShowCategoryModal(false);
      }}
    >
      <Text style={styles.categoryText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const getCategoryName = () => {
    const selectedCategory = categories.find(cat => cat._id === category);
    return selectedCategory ? selectedCategory.name : 'Select Category';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>
          {uploadProgress > 0 
            ? `Uploading images: ${Math.round(uploadProgress)}%` 
            : 'Creating product...'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Listing</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Image Upload Section */}
        <View style={styles.imageSection}>
          <TouchableOpacity 
            style={styles.imageUpload} 
            onPress={pickImages}
            disabled={images.length >= 5}
          >
            <FontAwesome name="camera" size={30} color={images.length >= 5 ? "#ccc" : "#999"} />
            <Text style={[styles.uploadText, images.length >= 5 && {color: '#ccc'}]}>
              {images.length > 0 
                ? `${images.length}/5 images selected${images.length >= 5 ? ' (max reached)' : ''}` 
                : 'Add Photos (max 5)'}
            </Text>
          </TouchableOpacity>
          
          {images.length > 0 && (
            <View style={styles.imageInstructions}>
              <FontAwesome name="info-circle" size={14} color="#3498db" />
              <Text style={styles.imageInstructionText}>
                Tap "Set as Main" to select your product's primary image
              </Text>
            </View>
          )}
          
          {images.length > 0 && (
            <ScrollView 
              horizontal 
              style={styles.imagePreviewScroll}
              showsHorizontalScrollIndicator={false}
            >
              {images.map((image, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                  <TouchableOpacity 
                    style={styles.removeImageBtn}
                    onPress={() => removeImage(index)}
                  >
                    <FontAwesome name="times-circle" size={20} color="#e74c3c" />
                  </TouchableOpacity>
                  
                  {index === mainImageIndex ? (
                    <View style={styles.mainImageBadge}>
                      <Text style={styles.mainImageText}>Main</Text>
                    </View>
                  ) : (
                    <TouchableOpacity 
                      style={styles.setMainBtn}
                      onPress={() => setAsMainImage(index)}
                    >
                      <Text style={styles.setMainText}>Set as Main</Text>
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Product Details Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Title *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter product title"
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Description *</Text>
            <TextInput
              style={[styles.textInput, { height: 100 }]}
              placeholder="Describe your item"
              multiline={true}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.inputLabel}>Price ($) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={price}
                onChangeText={setPrice}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Discount Price ($)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00"
                keyboardType="decimal-pad"
                value={discountPrice}
                onChangeText={setDiscountPrice}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Quantity *</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter quantity"
              keyboardType="number-pad"
              value={quantity}
              onChangeText={setQuantity}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Category *</Text>
            <TouchableOpacity 
              style={styles.selectInput}
              onPress={() => setShowCategoryModal(true)}
            >
              <Text style={styles.selectText}>{getCategoryName()}</Text>
              <FontAwesome name="chevron-down" size={14} color="#666" />
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Condition</Text>
            <View style={styles.conditionOptions}>
              {conditions.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.conditionOption,
                    condition === item && styles.conditionOptionActive
                  ]}
                  onPress={() => setCondition(item)}
                >
                  <Text style={[
                    styles.conditionText,
                    condition === item && styles.conditionTextActive
                  ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.draftButton]}
              onPress={() => handleSubmit(true)}
            >
              <Text style={styles.draftButtonText}>Save as Draft</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.publishButton]}
              onPress={() => handleSubmit(false)}
            >
              <Text style={styles.publishButtonText}>Publish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Category Selection Modal */}
      {showCategoryModal && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <FontAwesome name="times" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {categories.map(renderCategoryItem)}
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  scrollView: {
    flex: 1,
  },
  imageSection: {
    padding: 16,
  },
  imageUpload: {
    height: 150,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
  },
  imageInstructions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 5,
  },
  imageInstructionText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#3498db',
    flex: 1,
  },
  imagePreviewScroll: {
    marginTop: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 12,
  },
  mainImageBadge: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(46, 204, 113, 0.8)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainImageText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 16,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  selectInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#666',
  },
  conditionOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  conditionOption: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  conditionOptionActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  conditionText: {
    color: '#666',
  },
  conditionTextActive: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  draftButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e74c3c',
    marginRight: 8,
  },
  draftButtonText: {
    color: '#e74c3c',
    fontWeight: '600',
  },
  publishButton: {
    backgroundColor: '#e74c3c',
    marginLeft: 8,
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    maxHeight: '70%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  categoryItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryText: {
    fontSize: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});