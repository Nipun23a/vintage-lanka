import React, { useState } from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AuthLayout from "../../layout/AuthLayout";
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../config/firebase'; 
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function RegisterScreen({ navigation, route }) {
    // Get user type from route params if available
    const userType = route.params?.userType || 'buyer';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    // Function to pick an image from the device's library
    const pickImage = async () => {
        // Request permission to access the media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Permission to access camera roll is required!');
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    // Function to upload the image to Firebase Storage
    const uploadImageToFirebase = async () => {
        if (!profileImage) return null;

        try {
            setImageUploading(true);
            
            // Create a blob from the image URI
            const response = await fetch(profileImage);
            if (!response.ok) {
                throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
            }
            
            const blob = await response.blob();
            
            // Generate a unique filename with proper structure
            // Ensure the directory exists in Firebase Storage
            const timestamp = new Date().getTime();
            const safeEmail = email ? email.replace(/[^a-zA-Z0-9]/g, '_') : 'anonymous';
            const filename = `profile-images/${timestamp}_${safeEmail}.jpg`;
            
            // Create storage reference
            const storageRef = ref(storage, filename);
            
            // Log before upload for debugging
            console.log("Uploading to path:", filename);
            console.log("Blob size:", blob.size);
            
            // Upload with metadata
            const metadata = {
                contentType: 'image/jpeg',
            };
            
            // Upload the blob to firebase storage
            const uploadResult = await uploadBytes(storageRef, blob, metadata);
            console.log("Upload successful:", uploadResult.ref.fullPath);
            
            // Get the download URL
            const downloadURL = await getDownloadURL(uploadResult.ref);
            console.log("Download URL:", downloadURL);
            
            setImageUploading(false);
            return downloadURL;
        } catch (error) {
            console.error("Error uploading image: ", error);
            // More detailed error logging
            if (error.code) {
                console.error("Firebase error code:", error.code);
            }
            if (error.serverResponse) {
                console.error("Server response:", error.serverResponse);
            }
            
            setImageUploading(false);
            
            // More descriptive error message
            let errorMessage = 'Failed to upload profile image';
            if (error.code === 'storage/unauthorized') {
                errorMessage = 'You don\'t have permission to upload images';
            } else if (error.code === 'storage/canceled') {
                errorMessage = 'Upload was cancelled';
            } else if (error.code === 'storage/unknown') {
                errorMessage = 'Network issue or Firebase Storage permissions error';
            }
            
            Alert.alert('Upload Failed', errorMessage);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        
        try {
            setIsLoading(true);
            
            // Upload image if user is a seller and has selected an image
            let profileImageUrl = null;
            if (userType === 'seller' && profileImage) {
                profileImageUrl = await uploadImageToFirebase();
                if (!profileImageUrl && userType === 'seller') {
                    Alert.alert('Warning', 'Failed to upload profile image. Continue without it?', [
                        {
                            text: 'Cancel',
                            onPress: () => {
                                setIsLoading(false);
                                return;
                            },
                            style: 'cancel',
                        },
                        {
                            text: 'Continue',
                            onPress: () => { /* Continue with registration */ },
                        },
                    ]);
                    return;
                }
            }
            
            const addresses = [];

            const response = await axios.post('https://vintage-lanka-backend-f1fa6938e3e3.herokuapp.com/api/users/register', {
                fullname: fullName,
                email,
                password,
                confirmPassword,
                phoneNumber,
                addresses,
                role: userType,
                profileImage: profileImageUrl // Add the profile image URL to the request
            });
            
            if (response.status === 201) {
                Alert.alert('Success', 'User Account Created Successfully');
                navigation.navigate('Login');
            }
        } catch (error) {
            if (error.response) {
                Alert.alert(error.response.data.message || 'Error registering');
            } else if (error.request) {
                Alert.alert('Network Error', 'Error Occurred');
            } else {
                Alert.alert('Error occurred', 'Error Occurred');
            }
            console.log('Registration Failed', error);
        } finally {
            setIsLoading(false);
        }
    }

    const validateForm = () => {
        if (!fullName || !email || !password || !userType || !phoneNumber) {
            Alert.alert('Error', "All fields must be filled");
            return false;
        }
        
        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return false;
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', "Please enter a valid email address");
            return false;
        }

        // Phone Number Validation
        const phoneRegex = /^[0-9]{10}$/; // Assumes 10-digit phone numbers only
        if (!phoneRegex.test(phoneNumber)) {
            Alert.alert('Error', "Please enter a valid 10-digit phone number");
            return false;
        }

        // Check if profile image is selected for sellers
        if (userType === 'seller' && !profileImage) {
            Alert.alert('Warning', 'Profile image is recommended for sellers. Continue without it?', [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => false,
                },
                {
                    text: 'Continue',
                    onPress: () => true,
                },
            ]);
            return false; // This will be overridden by the alert callbacks
        }

        return true;
    }

    return (
        <AuthLayout
            title={`Create ${userType === 'seller' ? 'Seller' : 'Buyer'} Account`}
            subtitle="Join our community to explore great deals on second-hand treasures!"
        >
            {/* Profile Image Upload (Only for Sellers) */}
            {userType === 'seller' && (
                <View style={styles.profileImageContainer}>
                    <Text style={styles.label}>Profile Image {userType === 'seller' && <Text style={styles.recommended}>(Recommended)</Text>}</Text>
                    <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <View style={styles.placeholderContainer}>
                                <FontAwesome name="camera" size={28} color="#666" />
                                <Text style={styles.placeholderText}>Tap to select image</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            )}

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    placeholder="Enter your phone number"
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Create a password"
                    secureTextEntry
                />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                />
            </View>

            {/* Register Button */}
            <TouchableOpacity 
                style={[styles.registerButton, (isLoading || imageUploading) && styles.disabledButton]} 
                onPress={handleSubmit}
                disabled={isLoading || imageUploading}
            >
                <Text style={styles.registerButtonText}>
                    {isLoading || imageUploading ? 'Creating Account...' : 'Create Account'}
                </Text>
            </TouchableOpacity>

            {/* Or continue with */}
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or Continue With</Text>
                <View style={styles.divider} />
            </View>

            {/* Social Register Options */}
            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="google" size={24} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Sign Up With Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="apple" size={24} color="#000" />
                    <Text style={styles.socialButtonText}>Sign Up With Apple</Text>
                </TouchableOpacity>
            </View>

            {/* Login Account */}
            <View style={styles.loginContainer}>
                <Text style={styles.alreadyMemberText}>Already a Member? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Sign In</Text>
                </TouchableOpacity>
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    profileImageContainer: {
        marginBottom: 24,
        alignItems: 'center',
    },
    imagePickerButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 8,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    placeholderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
    placeholderText: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        textAlign: 'center',
        fontFamily: 'Montserrat_Regular',
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "Montserrat_Regular"
    },
    required: {
        color: 'red',
    },
    recommended: {
        color: '#0066cc',
        fontSize: 14,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontFamily: 'Montserrat_Light'
    },
    registerButton: {
        backgroundColor: '#000',
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    disabledButton: {
        backgroundColor: '#666',
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'Montserrat_SemiBold'
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#666',
        fontFamily: 'Montserrat_SemiBold',
    },
    socialContainer: {
        gap: 16,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 4,
        gap: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    socialButtonText: {
        fontSize: 16,
        fontFamily: 'Montserrat_Regular'
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    alreadyMemberText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_SemiBold'
    },
    loginText: {
        fontSize: 16,
        color: 'red',
        fontFamily: 'Montserrat_SemiBold'
    },
});