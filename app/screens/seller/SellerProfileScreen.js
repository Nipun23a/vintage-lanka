import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Switch } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from 'react';

// Header Component
const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="chevron-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
                <TouchableOpacity style={styles.settingsButton} onPress={() => console.log('Settings Clicked')}>
                    <FontAwesome name="cog" size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Profile Header Component
const ProfileHeader = () => {
    return (
        <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2940&auto=format&fit=crop' }}
                    style={styles.profileImage}
                />
                <TouchableOpacity style={styles.editProfileImageButton}>
                    <FontAwesome name="camera" size={16} color="#fff" />
                </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileUsername}>@johndoesells</Text>
                <View style={styles.profileStatus}>
                    <Text style={styles.profileStatusText}>Verified Seller</Text>
                    <FontAwesome name="check-circle" size={14} color="#2ecc71" style={{ marginLeft: 5 }} />
                </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

// Store Stats Component
const StoreStats = () => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>256</Text>
                <Text style={styles.statLabel}>Items Sold</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
                <Text style={styles.statNumber}>35</Text>
                <Text style={styles.statLabel}>Reviews</Text>
            </View>
        </View>
    );
};

// Store Information Component
const StoreInformation = () => {
    return (
        <View style={styles.storeInfoContainer}>
            <Text style={styles.storeInfoLabel}>Store Information</Text>
            <View style={styles.storeInfoContent}>
                <Text style={styles.storeName}>Vintage Treasures</Text>
                <Text style={styles.storeDescription}>
                    Specializing in authentic vintage collectibles, cameras, and home decor from the 60s-90s.
                    Every item has a story to tell!
                </Text>
                <TouchableOpacity style={styles.viewStoreButton}>
                    <Text style={styles.viewStoreText}>View My Store</Text>
                    <FontAwesome name="external-link" size={14} color="#3498db" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Settings Section Component
const SettingsSection = ({ title, icon, toggleEnabled, onToggle, hasChevron, onPress }) => {
    return (
        <TouchableOpacity
            style={styles.settingsSection}
            onPress={onPress}
            disabled={toggleEnabled !== undefined}
        >
            <View style={styles.settingsSectionLeft}>
                <View style={styles.settingsIconContainer}>
                    <FontAwesome name={icon} size={18} color="#3498db" />
                </View>
                <Text style={styles.settingsSectionTitle}>{title}</Text>
            </View>
            {toggleEnabled !== undefined ? (
                <Switch
                    value={toggleEnabled}
                    onValueChange={onToggle}
                    trackColor={{ false: '#d0d0d0', true: '#a0cfff' }}
                    thumbColor={toggleEnabled ? '#3498db' : '#f4f4f4'}
                />
            ) : (
                hasChevron && <FontAwesome name="chevron-right" size={16} color="#999" />
            )}
        </TouchableOpacity>
    );
};

// Account Settings Component
const AccountSettings = () => {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);
    const navigation = useNavigation();

    return (
        <View style={styles.accountSettingsContainer}>
            <Text style={styles.sectionTitle}>Account</Text>

            <SettingsSection
                title="Personal Information"
                icon="user"
                hasChevron={true}
                onPress={() => console.log('Navigate to Personal Info')}
            />

            <SettingsSection
                title="Payment Methods"
                icon="credit-card"
                hasChevron={true}
                onPress={() => console.log('Navigate to Payment Methods')}
            />

            <SettingsSection
                title="Shipping Information"
                icon="truck"
                hasChevron={true}
                onPress={() => console.log('Navigate to Shipping Info')}
            />

            <SettingsSection
                title="Tax Information"
                icon="file-text"
                hasChevron={true}
                onPress={() => console.log('Navigate to Tax Info')}
            />

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Preferences</Text>

            <SettingsSection
                title="Notifications"
                icon="bell"
                toggleEnabled={notificationsEnabled}
                onToggle={setNotificationsEnabled}
            />

            <SettingsSection
                title="Dark Mode"
                icon="moon-o"
                toggleEnabled={darkModeEnabled}
                onToggle={setDarkModeEnabled}
            />

            <SettingsSection
                title="Language"
                icon="globe"
                hasChevron={true}
                onPress={() => console.log('Navigate to Language Settings')}
            />

            <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Help & Support</Text>

            <SettingsSection
                title="Help Center"
                icon="question-circle"
                hasChevron={true}
                onPress={() => console.log('Navigate to Help Center')}
            />

            <SettingsSection
                title="Contact Support"
                icon="envelope"
                hasChevron={true}
                onPress={() => console.log('Navigate to Contact Support')}
            />

            <SettingsSection
                title="About"
                icon="info-circle"
                hasChevron={true}
                onPress={() => console.log('Navigate to About')}
            />

            <TouchableOpacity style={styles.logoutButton} onPress={() => console.log('Logout')}>
                <FontAwesome name="sign-out" size={18} color="#e74c3c" />
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function SellerProfileScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark-content" backgroundColor="#fff" />
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                <ProfileHeader />
                <StoreStats />
                <StoreInformation />
                <AccountSettings />
                <View style={styles.footer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        marginTop:10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat_Bold',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileHeader: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    editProfileImageButton: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#3498db',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    profileInfo: {
        alignItems: 'center',
        marginBottom: 15,
    },
    profileName: {
        fontSize: 22,
        fontFamily: 'Montserrat_Bold',
        color: '#333',
    },
    profileUsername: {
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
        marginTop: 3,
    },
    profileStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#eafaf1',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 8,
    },
    profileStatusText: {
        color: '#2ecc71',
        fontSize: 12,
        fontFamily: 'Montserrat_Medium',
    },
    editProfileButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    editProfileText: {
        color: '#333',
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#f9f9f9',
        paddingVertical: 16,
        marginHorizontal: 16,
        marginTop: 20,
        borderRadius: 12,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontFamily: 'Montserrat_Bold',
        color: '#3498db',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e0e0e0',
    },
    storeInfoContainer: {
        marginTop: 20,
        paddingHorizontal: 16,
    },
    storeInfoLabel: {
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 10,
        color: '#333',
    },
    storeInfoContent: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 12,
    },
    storeName: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 8,
        color: '#333',
    },
    storeDescription: {
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
        lineHeight: 20,
    },
    viewStoreButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 15,
        alignSelf: 'flex-start',
    },
    viewStoreText: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
        color: '#3498db',
    },
    accountSettingsContainer: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 10,
        color: '#333',
    },
    settingsSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingsSectionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingsIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f0f7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingsSectionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        marginBottom: 10,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: '#fff0f0',
    },
    logoutText: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
        color: '#e74c3c',
        marginLeft: 8,
    },
    footer: {
        height: 20,
    },
});