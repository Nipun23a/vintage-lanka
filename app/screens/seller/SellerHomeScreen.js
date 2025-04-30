import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ActivityIndicator,Alert,ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [stats, setStats] = useState({
      totalRevenue: 0,
      productCount: 0,
      orderCount: 0,
    });
  
    useEffect(() => {
      const fetchStats = async () => {
        try {
          const storedUserData = await AsyncStorage.getItem('userData');
          const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
  
          if (parsedUserData && parsedUserData.userId) {
            const sellerId = parsedUserData.userId;
  
            const response = await axios.get(`http://192.168.8.151:5000/api/orders/summary/${sellerId}`);
  
            if (response.data && response.data.data) {
              setStats(response.data.data);
            }
          }
        } catch (error) {
          console.error('Failed to fetch seller stats:', error);
        }
      };
  
      fetchStats();
    }, []);
  
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>${stats.totalRevenue}</Text>
          <Text style={styles.statLabel}>This Month</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.productCount}</Text>
          <Text style={styles.statLabel}>Active Listings</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{stats.orderCount}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
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

// Quick Actions Component
const QuickActions = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.quickActionsContainer}>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <FontAwesome name="plus-circle" size={24} color="#e74c3c" />
                <Text style={styles.actionButtonText}>Add Listing</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Orders')}
            >
                <FontAwesome name="list-alt" size={24} color="#3498db" />
                <Text style={styles.actionButtonText}>Orders</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.actionButton}
                onPress={() => navigation.navigate('Inbox')}
            >
                <FontAwesome name="envelope" size={24} color="#9b59b6" />
                <Text style={styles.actionButtonText}>Messages</Text>
            </TouchableOpacity>
        </View>
    );
};

// Active Listings Component
const ActiveListings = () => {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (!userDataString) throw new Error('User data not found');

            const userData = JSON.parse(userDataString);
            const sellerId = userData.userId;

            const response = await axios.get(`http://192.168.8.151:5000/api/products/seller/${sellerId}`);

            const transformedProducts = response.data.map(product => ({
                id: product._id,
                title: product.title,
                price: product.discountPrice ? product.discountPrice.toString() : product.price.toString(),
                originalPrice: product.price.toString(),
                status: product.quantity > 0 ? 'Active' : 'Sold Out',
                image: product.mainImage,
                description: product.description,
                category: product.category.name,
                quantity: product.quantity,
                views: Math.floor(Math.random() * 100), // mock views
                likes: Math.floor(Math.random() * 30), // mock likes
                date: new Date(product.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            }));

            setListings(transformedProducts);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
            Alert.alert('Error', 'Failed to load your products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (listings.length === 0) {
        return <Text style={styles.emptyText}>No products found</Text>;
    }

    return (
        <View style={styles.listingsGrid}>
            {listings.map((listing, index) => (
                <ListingItem
                    key={index}
                    imageUri={listing.image}
                    title={listing.title}
                    price={listing.price}
                    status={listing.status}
                />
            ))}
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
                <SectionTitle title="Quick Actions" />
                <QuickActions/>
                <SectionTitle title="Your Listings" />
                <ActiveListings />
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
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
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