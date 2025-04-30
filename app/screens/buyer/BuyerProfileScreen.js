import { StatusBar } from 'expo-status-bar';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    View,
    Alert,
    ActivityIndicator
} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import Header from "../../components/Header";
import {useNavigation} from "@react-navigation/native";
import PasswordUpdateModal from "../../components/PasswordUpdateModal";
import PersonalInfoUpdateModal from "../../components/PersonalInfoUpdateModal";
import AddressManagementModal from "../../components/AddressManementModal"; // Import the AddressManagementModal
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useUser} from "../../config/useUser";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

// Profile Section Component
const ProfileSection = ({ title, icon, onPress }) => {
    return (
        <TouchableOpacity style={styles.profileSection} onPress={onPress}>
            <View style={styles.profileSectionLeft}>
                <FontAwesome name={icon} size={20} color="#666" style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <FontAwesome name="chevron-right" size={16} color="#999" />
        </TouchableOpacity>
    );
};

// Personal Information Section
const PersonalInfoSection = ({ user, onEdit }) => {
    return (
        <View style={styles.infoContainer}>
            <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>Personal Information</Text>
                <TouchableOpacity onPress={onEdit}>
                    <Text style={styles.editText}>Edit</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Full Name</Text>
                <Text style={styles.infoValue}>{user.userFullName}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.userEmail}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.userPhoneNumber}</Text>
            </View>
        </View>
    );
};

export default function BuyerProfileScreen({navigation, onLogout}) {
    const [user, setUser] = useState({
        userFullName: '',
        userEmail: '',
        userId: '',
        userRole: '',
        userPhoneNumber: '',
        userAddresses: [],
        userCart: []
    });
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);
    const [addressModalVisible, setAddressModalVisible] = useState(false); // Add state for address modal
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Get user data from AsyncStorage
                const userData = await AsyncStorage.getItem('userData');

                if (userData) {
                    const parsedUserData = JSON.parse(userData);

                    setUser({
                        userId: parsedUserData.userId,
                        userRole: parsedUserData.userRole,
                        userFullName: parsedUserData.userFullName,
                        userEmail: parsedUserData.userEmail,
                        userPhoneNumber: parsedUserData.userPhoneNumber,
                        userAddresses: JSON.parse(parsedUserData.userAddresses || '[]'),
                        userCart: JSON.parse(parsedUserData.userCart || '[]')
                    });
                } else {
                    // Handle case where user data is not found
                    console.log('User data not found in AsyncStorage');
                    // Redirect to login if needed
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }
            } catch (error) {
                console.log('Error loading user data:', error);
                Alert.alert(
                    'Error',
                    'Failed to load user data. Please log in again.'
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadUserData();
    }, [navigation]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleEditProfile = () => {
        setPersonalInfoModalVisible(true);
    }

    const handleSavePersonalInfo = async (updatedInfo) => {
        try {
            const updatedUser = {
                ...user,
                ...updatedInfo
            };

            setUser(updatedUser);

            // Update AsyncStorage with new user data
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const parsedUserData = JSON.parse(userData);
                const updatedUserData = {
                    ...parsedUserData,
                    userFullName: updatedInfo.userFullName || parsedUserData.userFullName,
                    userPhoneNumber: updatedInfo.userPhoneNumber || parsedUserData.userPhoneNumber,
                    // Add other fields that might be updated
                };

                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
                Alert.alert("Success", "Personal information updated successfully");
            }
        } catch (error) {
            console.log('Error updating user data:', error);
            Alert.alert(
                'Error',
                'Failed to update personal information. Please try again.'
            );
        }
    }

    const handleTransactions = () => {
        navigation.navigate('TransactionHistory')
    }

    // Add handler for managing addresses
    const handleManageAddresses = () => {
        setAddressModalVisible(true);
    }

    const handleLogout = async () => {
        if (isLoggingOut) return; // Prevent multiple logout attempts

        setIsLoggingOut(true);

        try {
            // Keys to be removed from AsyncStorage
            const keysToRemove = [
                'userData'
            ];

            // Clear all authentication-related data from AsyncStorage
            await AsyncStorage.multiRemove(keysToRemove);

            // Call the onLogout function from props to update auth state
            if (typeof onLogout === 'function') {
                onLogout();
            } else {
                console.warn('onLogout is not a function');
                // Fallback navigation if onLogout is not provided
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                });
            }
        } catch (error) {
            console.log('Logout Failed', error);
            Alert.alert(
                'Error',
                'Failed to log out. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsLoggingOut(false);
        }
    };

    const handlePrivacySecurity = () => {
        setPasswordModalVisible(true);
    }

    if (isLoading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading profile...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Using the reusable Header component - with back button */}
            <Header
                title="My Profile"
                showBackButton={true}
                onBackPress={handleBackPress}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.profileHeader}>
                    <Text style={styles.profileName}>{user.userFullName}</Text>
                    <Text style={styles.profileEmail}>{user.userEmail}</Text>
                </View>

                <PersonalInfoSection user={user} onEdit={handleEditProfile} />

                <View style={styles.sectionsContainer}>
                    <Text style={styles.sectionGroupTitle}>Account</Text>

                    <ProfileSection
                        title="Transaction History"
                        icon="history"
                        onPress={handleTransactions}
                    />

                    <ProfileSection
                        title="My Favorites"
                        icon="heart"
                        onPress={() => navigation.navigate('Favorites')}
                    />

                    {/* Add the Manage Addresses option */}
                    <ProfileSection
                        title="Manage Addresses"
                        icon="map-marker"
                        onPress={handleManageAddresses}
                    />
                </View>

                <View style={styles.sectionsContainer}>
                    <Text style={styles.sectionGroupTitle}>Settings</Text>

                    <ProfileSection
                        title="Notifications"
                        icon="bell"
                        onPress={() => Alert.alert('Info',"Stay Tuned")}
                    />

                    <ProfileSection
                        title="Privacy & Security"
                        icon="lock"
                        onPress={handlePrivacySecurity}
                    />

                    <TouchableOpacity style={styles.signOutButton} onPress={handleLogout}>
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer} />

                {/* Modals */}
                <PasswordUpdateModal
                    visible={passwordModalVisible}
                    onClose={() => setPasswordModalVisible(false)}
                />

                <PersonalInfoUpdateModal
                    visible={personalInfoModalVisible}
                    onClose={() => setPersonalInfoModalVisible(false)}
                    userData={user}
                    onSave={handleSavePersonalInfo}
                />

                {/* Add the AddressManagementModal */}
                <AddressManagementModal
                    visible={addressModalVisible}
                    onClose={() => setAddressModalVisible(false)}
                />

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        marginTop: 10,
        paddingBottom: 8,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat_Bold',
    },
    cartButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#f5f5f5',
    },
    profileName: {
        fontSize: 24,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    infoContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
    },
    infoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    infoTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
    },
    editText: {
        fontSize: 14,
        color: '#3498db',
        fontFamily: 'Montserrat_SemiBold',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    infoLabel: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    infoValue: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    sectionsContainer: {
        marginHorizontal: 16,
        marginTop: 24,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
    },
    sectionGroupTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 12,
    },
    profileSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileSectionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionIcon: {
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_Regular',
    },
    signOutButton: {
        marginTop: 24,
        padding: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        alignItems: 'center',
    },
    signOutText: {
        fontSize: 16,
        color: '#e74c3c',
        fontFamily: 'Montserrat_SemiBold',
    },
    footer: {
        height: 20,
    },
});