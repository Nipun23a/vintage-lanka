import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";

// Header Component with Seller-specific greeting
const Header = () => {
    const navigation = useNavigation();
    return(
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View>
                    <Text style={styles.headerGreeting}>Hello Seller,</Text>
                    <Text style={styles.headerTitle}>Dashboard <Text>📊</Text></Text>
                </View>
                <TouchableOpacity style={styles.notificationButton} onPress={() => console.log('Notification Clicked')}>
                    <FontAwesome name="bell" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <FontAwesome name='search' size={20} color="#999" style={styles.searchIcon}/>
                <TextInput placeholder={"Search your listings..."} style={styles.searchInput}/>
                <TouchableOpacity>
                    <FontAwesome name={'sliders'} size={20} color="#999"/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Stats Component for Sales Overview
const StatsOverview = () => {
    return(
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>$1,245</Text>
                <Text style={styles.statLabel}>This Month</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>23</Text>
                <Text style={styles.statLabel}>Active Listings</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Orders</Text>
            </View>
        </View>
    );
};

// Quick Actions Component
const QuickActions = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.quickActionsContainer}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddListing')}
            >
                <FontAwesome name="plus-circle" size={24} color="#e74c3c" />
                <Text style={styles.actionButtonText}>Add Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('ManageOrders')}
            >
                <FontAwesome name="list-alt" size={24} color="#3498db" />
                <Text style={styles.actionButtonText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Analytics')}
            >
                <FontAwesome name="line-chart" size={24} color="#2ecc71" />
                <Text style={styles.actionButtonText}>Analytics</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Messages')}
            >
                <FontAwesome name="envelope" size={24} color="#9b59b6" />
                <Text style={styles.actionButtonText}>Messages</Text>
            </TouchableOpacity>
        </View>
    );
};

// Recent Activity Feed Component
const RecentActivity = () => {
    const activities = [
        { type: 'sale', message: 'Vintage Camera sold for $125', time: '2h ago' },
        { type: 'message', message: 'New message from buyer about antique clock', time: '5h ago' },
        { type: 'view', message: 'Your Record Player listing got 15 new views', time: '1d ago' },
        { type: 'review', message: 'You received a 5-star review', time: '2d ago' },
    ];

    return (
        <View style={styles.activityContainer}>
            {activities.map((activity, index) => (
                <View key={index} style={styles.activityItem}>
                    <View style={styles.activityIconContainer}>
                        <FontAwesome
                            name={
                                activity.type === 'sale' ? 'dollar' :
                                    activity.type === 'message' ? 'comment' :
                                        activity.type === 'view' ? 'eye' : 'star'
                            }
                            size={18}
                            color="#fff"
                        />
                    </View>
                    <View style={styles.activityContent}>
                        <Text style={styles.activityMessage}>{activity.message}</Text>
                        <Text style={styles.activityTime}>{activity.time}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
};

// Section Title Component
const SectionTitle = ({ title }) => {
    return (
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
        </View>
    );
};

// Product Item Component
const ListingItem = ({ imageUri, title, price, status }) => {
    return (
        <TouchableOpacity style={styles.listingItem}>
            <Image
                source={{ uri: imageUri }}
                style={styles.listingImage}
            />
            <View style={styles.listingInfo}>
                <Text style={styles.listingName}>{title}</Text>
                <Text style={styles.listingPrice}>${price}</Text>
                <View style={[styles.statusBadge,
                    status === 'Active' ? styles.statusActive :
                        status === 'Sold' ? styles.statusSold :
                            styles.statusDraft
                ]}>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Active Listings Component
const ActiveListings = () => {
    const listings = [
        {
            imageUri: 'https://images.unsplash.com/photo-1630012974522-7e683def2ae5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Vintage Radio',
            price: '145.00',
            status: 'Active'
        },
        {
            imageUri: 'https://images.unsplash.com/photo-1679973957366-2f926a250629?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Antique Clock',
            price: '225.00',
            status: 'Sold'
        },
        {
            imageUri: 'https://images.unsplash.com/photo-1656870916547-9e6a8a17f6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Record Player',
            price: '175.00',
            status: 'Active'
        },
        {
            imageUri: 'https://images.unsplash.com/photo-1601854266103-c1dd42130633?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            title: 'Vintage Camera',
            price: '125.00',
            status: 'Draft'
        },
    ];

    return (
        <View style={styles.listingsGrid}>
            {listings.map((listing, index) => (
                <ListingItem
                    key={index}
                    imageUri={listing.imageUri}
                    title={listing.title}
                    price={listing.price}
                    status={listing.status}
                />
            ))}
        </View>
    );
};

// Performance Chart Placeholder Component
const PerformanceChart = () => {
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Monthly Sales</Text>
                <View style={styles.chartPeriod}>
                    <Text style={styles.chartPeriodText}>Last 6 months</Text>
                    <FontAwesome name="chevron-down" size={14} color="#666" style={{marginLeft: 5}} />
                </View>
            </View>
            <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Performance chart will appear here</Text>
                {/* You would replace this with an actual chart library component */}
            </View>
        </View>
    );
};

export default function SellerHomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <StatsOverview />
                <QuickActions />

                <SectionTitle title="Recent Activity" />
                <RecentActivity />

                <SectionTitle title="Your Listings" />
                <ActiveListings />

                <SectionTitle title="Performance" />
                <PerformanceChart />

                <View style={styles.footer} />
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
    headerGreeting: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    headerTitle: {
        fontSize: 24,
        marginTop: 4,
        fontFamily: 'Montserrat_Bold',
    },
    notificationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        fontFamily: 'Montserrat_Regular',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 14,
        marginHorizontal: 4,
        elevation: 1,
    },
    statNumber: {
        fontSize: 22,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 4,
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
    },
    quickActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 20,
        marginTop: 10,
    },
    actionButton: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
    },
    actionButtonText: {
        marginTop: 6,
        fontSize: 12,
        textAlign: 'center',
        fontFamily: 'Montserrat_Medium',
    },
    activityContainer: {
        paddingHorizontal: 16,
        marginBottom: 20,
    },
    activityItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    activityIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    activityContent: {
        flex: 1,
    },
    activityMessage: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
        color: '#333',
    },
    activityTime: {
        fontSize: 12,
        fontFamily: 'Montserrat_Regular',
        color: '#999',
        marginTop: 2,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 20,
        color: '#333',
        fontFamily: 'Montserrat_Bold',
    },
    seeAllText: {
        fontSize: 14,
        color: '#3498db',
        fontFamily: 'Montserrat_Medium',
    },
    listingsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        marginBottom: 24,
    },
    listingItem: {
        width: '46%',
        margin: '2%',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    listingImage: {
        width: '100%',
        height: 160,
    },
    listingInfo: {
        padding: 12,
    },
    listingName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        fontFamily: 'Montserrat_SemiBold',
    },
    listingPrice: {
        fontSize: 14,
        color: '#e74c3c',
        fontFamily: 'Montserrat_Bold',
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusActive: {
        backgroundColor: 'rgba(46, 204, 113, 0.8)',
    },
    statusSold: {
        backgroundColor: 'rgba(52, 152, 219, 0.8)',
    },
    statusDraft: {
        backgroundColor: 'rgba(149, 165, 166, 0.8)',
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontFamily: 'Montserrat_Bold',
    },
    chartContainer: {
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    chartPeriod: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chartPeriodText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    chartPlaceholder: {
        height: 180,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartPlaceholderText: {
        color: '#999',
        fontFamily: 'Montserrat_Regular',
    },
    footer: {
        height: 20,
    },
});