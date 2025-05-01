import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    TouchableWithoutFeedback,
    Keyboard,
    Alert
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PasswordUpdateModal = ({ visible, onClose }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        };

        // Validate current password
        if (!currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required';
            isValid = false;
        }

        // Validate new password
        if (!newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
            isValid = false;
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
            isValid = false;
        }

        // Validate confirm password
        if (!confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your new password';
            isValid = false;
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        // Retrieve user data from AsyncStorage
        const userData = await AsyncStorage.getItem('userData');

        if (!userData) {
            Alert.alert("Error", "User data not found. Please log in again.");
            return;
        }

        const parsedUserData = JSON.parse(userData);
        const userId = parsedUserData.userId;  // Get the userId from the saved data

        if (validateForm()) {
            try {
                // Send a request to update the password
                const response = await axios.patch(`https://vintage-lanka-backend-f1fa6938e3e3.herokuapp.com/api/users/${userId}/password`, {
                    oldPassword:currentPassword,
                    newPassword
                });

                if (response.status === 200) {
                    // If password update is successful
                    Alert.alert(
                        "Success",
                        "Your password has been updated successfully!",
                        [{ text: "OK", onPress: handleClose }]
                    );
                }
            } catch (error) {
                if (error.response && error.response.data) {
                    Alert.alert("Error", error.response.data.message || "Failed to update password");
                } else {
                    Alert.alert("Error", "Something went wrong. Please try again.");
                }
            }
        }
    };

    const handleClose = () => {
        // Reset form
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={handleClose}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Update Password</Text>
                            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                                <FontAwesome name="times" size={20} color="#999" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalBody}>
                            {/* Current Password */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Current Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter current password"
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        secureTextEntry={!showCurrentPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                                    >
                                        <FontAwesome
                                            name={showCurrentPassword ? "eye-slash" : "eye"}
                                            size={18}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.currentPassword ? (
                                    <Text style={styles.errorText}>{errors.currentPassword}</Text>
                                ) : null}
                            </View>

                            {/* New Password */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>New Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Enter new password"
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        secureTextEntry={!showNewPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setShowNewPassword(!showNewPassword)}
                                    >
                                        <FontAwesome
                                            name={showNewPassword ? "eye-slash" : "eye"}
                                            size={18}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.newPassword ? (
                                    <Text style={styles.errorText}>{errors.newPassword}</Text>
                                ) : null}
                                <Text style={styles.passwordHint}>
                                    Password must be at least 8 characters
                                </Text>
                            </View>

                            {/* Confirm Password */}
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Confirm Password</Text>
                                <View style={styles.passwordContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        secureTextEntry={!showConfirmPassword}
                                    />
                                    <TouchableOpacity
                                        style={styles.eyeIcon}
                                        onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        <FontAwesome
                                            name={showConfirmPassword ? "eye-slash" : "eye"}
                                            size={18}
                                            color="#666"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {errors.confirmPassword ? (
                                    <Text style={styles.errorText}>{errors.confirmPassword}</Text>
                                ) : null}
                            </View>
                        </View>

                        <View style={styles.modalFooter}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={handleClose}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.updateButton}
                                onPress={handleSubmit}
                            >
                                <Text style={styles.updateButtonText}>Update Password</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        width: '90%',
        maxWidth: 400,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBody: {
        padding: 20,
    },
    inputContainer: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontFamily: 'Montserrat_SemiBold',
        marginBottom: 8,
        color: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        backgroundColor: '#f9f9f9',
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontFamily: 'Montserrat_Regular',
    },
    eyeIcon: {
        padding: 12,
    },
    errorText: {
        fontSize: 12,
        color: '#e74c3c',
        fontFamily: 'Montserrat_Regular',
        marginTop: 4,
    },
    passwordHint: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
        marginTop: 4,
    },
    modalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontFamily: 'Montserrat_SemiBold',
        color: '#666',
    },
    updateButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#3498db',
        minWidth: 160,
        alignItems: 'center',
    },
    updateButtonText: {
        fontFamily: 'Montserrat_SemiBold',
        color: '#fff',
    },
});

export default PasswordUpdateModal;