import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Image, View, Alert} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import {useState} from "react";
import Header from "../../components/Header";
import {useNavigation} from "@react-navigation/native";
import PasswordUpdateModal from "../../components/PasswordUpdateModal";
import PersonalInfoUpdateModal from "../../components/PersonalInfoUpdateModal";

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
                <Text style={styles.infoValue}>{user.name}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{user.phone}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>{user.location}</Text>
            </View>
        </View>
    );
};

export default function BuyerProfileScreen({navigation}) {
    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+94 77 213 4567',
        location: 'Colombo, Sri Lanka',
        profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGVyc29ufGVufDB8fDB8fHww'
    });

    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [personalInfoModalVisible, setPersonalInfoModalVisible] = useState(false);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleEditProfile = () => {
        setPersonalInfoModalVisible(true);
    }

    const handleSavePersonalInfo = (updatedInfo) => {
        setUser({
            ...user,
            ...updatedInfo
        });
        Alert.alert("Success", "Personal information updated successfully");
    }

    const handleTransactions = () => {
        navigation.navigate('TransactionHistory')
    }

    const handleSignOut = () => {
        console.log('Sign out pressed');
    }

    const handlePrivacySecurity = () => {
        setPasswordModalVisible(true);
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
                    <Image
                        source={{ uri: user.profileImage }}
                        style={styles.profileImage}
                    />
                    <Text style={styles.profileName}>{user.name}</Text>
                    <Text style={styles.profileEmail}>{user.email}</Text>
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

                    <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
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