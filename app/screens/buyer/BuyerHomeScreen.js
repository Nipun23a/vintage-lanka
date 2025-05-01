import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API config
const API_URL = 'http://192.168.8.151:5000/api/products';
const PREFERENCES_API_URL = 'http://192.168.8.151:5000/api/products/preferences'; // Base preferences URL

const Header = () => {
    const navigation = useNavigation();
    return(
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View>
                    <Text style={styles.headerGreeting}>Hello,</Text>
                    <Text style={styles.headerTitle}>Welcome Back! <Text>👋</Text></Text>
                </View>
                <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
                    <FontAwesome name="shopping-cart" size={24} color="black"/>
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
                <FontAwesome name='search' size={20} color="#999" style={styles.searchIcon}/>
                <TextInput placeholder={"Search Something ..."} style={styles.searchInput}/>
                <TouchableOpacity>
                    <FontAwesome name={'sliders'} size={20} color="#999"/>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Hero Banner Component
const HeroBanner = () => {
    return(
        <View style={styles.heroBanner}>
            <Text style={styles.bannerText}>
                Vintage Lanka - Discover, Buy & Sell Pre-Loved Treasures!
            </Text>
        </View>
    );
};

// Feature Banners Components
const FeaturedBanners = () => {
    return (
        <View style={styles.featuredContainer}>
            <View style={styles.featuredMain}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1443884590026-2e4d21aee71c?q=80&w=2043&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.featuredMainImage}
                />
            </View>
            <View style={styles.featuredSecondary}>
                <Image
                    source={{ uri: 'https://plus.unsplash.com/premium_photo-1702226632131-076a24d03c13?q=80&w=2018&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.featuredSecondaryImage}
                />
            </View>
        </View>
    );
};

// Category Banners Component
const CategoryBanners = () => {
    return (
        <View style={styles.categoryBanners}>
            <View style={styles.categoryItem}>
                <Image
                    source={{ uri: 'https://plus.unsplash.com/premium_photo-1682125776589-e899882259c3?q=80&w=1942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.categoryImage}
                />
            </View>
            <View style={styles.categoryItem}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.categoryImage}
                />
            </View>
            <View style={styles.categoryItem}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1419640303358-44f0d27f48e7?q=80&w=1985&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.categoryImage}
                />
            </View>
        </View>
    );
};

// Section Title Component
const SectionTitle = ({ title }) => {
    return (
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
};

// Product Item Component
const ProductItem = ({ product }) => {
    const navigation = useNavigation();
    
    // Handle product press - navigate to product details
    const handleProductPress = () => {
        navigation.navigate('ProductDetails', { productId: product._id });
    };
    
    return (
        <TouchableOpacity style={styles.productItem} onPress={handleProductPress}>
            <Image
                source={{ uri: product.mainImage }}
                style={styles.productImage}
                resizeMode="cover"
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>{product.title}</Text>
                <View style={styles.priceContainer}>
                    {product.discountPrice ? (
                        <>
                            <Text style={styles.productDiscountPrice}>${product.discountPrice}</Text>
                            <Text style={styles.productOriginalPrice}>${product.price}</Text>
                        </>
                    ) : (
                        <Text style={styles.productPrice}>${product.price}</Text>
                    )}
                </View>
                <View style={styles.ratingContainer}>
                    <FontAwesome name="star" size={12} color="#FFD700" />
                    <Text style={styles.ratingText}>
                        {product.reviews && product.reviews.length > 0 
                            ? (product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length).toFixed(1)
                            : "New"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Recommendation Banner Component
const RecommendationBanner = ({ title, product }) => {
    const navigation = useNavigation();
    
    const handlePress = () => {
        navigation.navigate('ProductDetails', { productId: product._id });
    };
    
    return (
        <TouchableOpacity style={styles.recommendationBanner} onPress={handlePress}>
            <Image
                source={{ uri: product.mainImage }}
                style={styles.recommendationImage}
                resizeMode="cover"
            />
            <View style={styles.recommendationOverlay}>
                <View style={styles.recommendationContent}>
                    <Text style={styles.recommendationLabel}>{title}</Text>
                    <Text style={styles.recommendationTitle} numberOfLines={2}>{product.title}</Text>
                    <View style={styles.recommendationPrice}>
                        {product.discountPrice ? (
                            <Text style={styles.recommendationDiscountPrice}>${product.discountPrice}</Text>
                        ) : (
                            <Text style={styles.recommendationPriceText}>${product.price}</Text>
                        )}
                    </View>
                    <TouchableOpacity style={styles.viewButton} onPress={handlePress}>
                        <Text style={styles.viewButtonText}>View Item</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

// Product Grid Component
const ProductGrid = ({ products }) => {
    if (!products || products.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No products available</Text>
            </View>
        );
    }

    return (
        <View style={styles.productGrid}>
            {products.map((product) => (
                <ProductItem key={product._id} product={product} />
            ))}
        </View>
    );
};

export default function BuyerHomeScreen() {
    const [productsData, setProductsData] = useState([]);
    const [preferences, setPreferences] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);

    // Get user ID from AsyncStorage
    useEffect(() => {
        const getUserId = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('userId');
                if (storedUserId) {
                    setUserId(storedUserId);
                }
            } catch (err) {
                console.error('Error getting user ID from storage:', err);
            }
        };

        getUserId();
    }, []);

    // Fetch products and user preferences
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch all products
                const productsResponse = await axios.get(API_URL);
                setProductsData(productsResponse.data.products);
                
                // Fetch user preferences if userId is available
                if (userId) {
                    try {
                        const preferencesResponse = await axios.get(`${PREFERENCES_API_URL}/${userId}`);
                        setPreferences(preferencesResponse.data);
                    } catch (prefErr) {
                        console.log('No preferences found or error fetching preferences, using default data');
                        // If no preferences found, we'll use the default data in the next fetch
                        const defaultPreferencesResponse = await axios.get(API_URL);
                        if (defaultPreferencesResponse.data.products && defaultPreferencesResponse.data.products.length >= 2) {
                            // Create a mock preferences object with the first two products
                            setPreferences({
                                favoriteProduct: defaultPreferencesResponse.data.products[0],
                                leastFavoriteProduct: defaultPreferencesResponse.data.products[1]
                            });
                        }
                    }
                } else {
                    // If no userId, use default data
                    if (productsResponse.data.products && productsResponse.data.products.length >= 2) {
                        setPreferences({
                            favoriteProduct: productsResponse.data.products[0],
                            leastFavoriteProduct: productsResponse.data.products[1]
                        });
                    }
                }
                
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load data. Please try again later.');
                setLoading(false);
            }
        };

        fetchData();
    }, [userId]);

    // Render user recommendations section
    const renderRecommendations = () => {
        if (!preferences) return null;
        
        return (
            <View style={styles.recommendationsSection}>
                <RecommendationBanner 
                    title="Based on your favorites" 
                    product={preferences.favoriteProduct} 
                />
                
                <View style={styles.spacer} />
                
                <RecommendationBanner 
                    title="You might also like" 
                    product={preferences.leastFavoriteProduct} 
                />
            </View>
        );
    };

    // Get new arrivals (most recent products)
    const getNewArrivals = () => {
        if (!productsData || productsData.length === 0) return [];
        
        // Sort products by creation date (newest first) and take first 4
        return [...productsData]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 4);
    };

    // Get featured items (products with reviews)
    const getFeaturedItems = () => {
        if (!productsData || productsData.length === 0) return [];
        
        // Filter products that have reviews and sort by rating
        return [...productsData]
            .filter(product => product.reviews && product.reviews.length > 0)
            .sort((a, b) => {
                const aRating = a.reviews.reduce((sum, review) => sum + review.rating, 0) / a.reviews.length;
                const bRating = b.reviews.reduce((sum, review) => sum + review.rating, 0) / b.reviews.length;
                return bRating - aRating;
            })
            .slice(0, 4);
    };

    // Render loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loaderText}>Loading products...</Text>
                </View>
            </SafeAreaView>
        );
    }

    // Render error state
    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="dark-content" backgroundColor="#fff" />
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton} 
                        onPress={() => {
                            setLoading(true);
                            setError(null);
                            // Re-fetch data
                            fetchData();
                        }}
                    >
                        <Text style={styles.retryButtonText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <HeroBanner />
                
                {/* Personalized recommendations based on user preferences */}
                {renderRecommendations()}
                
                <FeaturedBanners />
                <CategoryBanners />
                
                {/* New Arrivals Section */}
                <SectionTitle title="New Arrivals" />
                <ProductGrid products={getNewArrivals()} />
                
                {/* Featured Items Section */}
                <SectionTitle title="Featured Items" />
                <ProductGrid products={getFeaturedItems()} />
                
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
    cartButton: {
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
    heroBanner: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#f9f9f9',
    },
    bannerText: {
        fontSize: 28,
        textAlign: 'center',
        fontFamily: 'Alatsi',
    },
    featuredContainer: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 16,
        height: 200,
    },
    featuredMain: {
        flex: 1,
        marginRight: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    featuredMainImage: {
        width: '100%',
        height: '100%',
    },
    featuredSecondary: {
        flex: 1,
        marginLeft: 8,
        borderRadius: 12,
        overflow: 'hidden',
    },
    featuredSecondaryImage: {
        width: '100%',
        height: '100%',
    },
    categoryBanners: {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginBottom: 24,
        height: 140,
    },
    categoryItem: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 8,
        overflow: 'hidden',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    sectionTitleContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 22,
        color: '#333',
        fontFamily: 'Montserrat_Bold',
    },
    loaderContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    loaderText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        textAlign: 'center',
        fontFamily: 'Montserrat_Regular',
    },
    retryButton: {
        marginTop: 10,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#000',
        borderRadius: 6,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontFamily: 'Montserrat_Bold',
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: 12,
        marginBottom: 24,
    },
    productItem: {
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
    productImage: {
        width: '100%',
        height: 160,
    },
    productInfo: {
        padding: 12,
    },
    productName: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
        fontFamily: 'Montserrat_SemiBold',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        color: '#e74c3c',
        fontFamily: 'Montserrat_Bold',
    },
    productDiscountPrice: {
        fontSize: 14,
        color: '#e74c3c',
        fontFamily: 'Montserrat_Bold',
        marginRight: 6,
    },
    productOriginalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
        fontFamily: 'Montserrat_Regular',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
        fontFamily: 'Montserrat_Regular',
    },
    footer: {
        height: 20,
    },
    recommendationsSection: {
        marginBottom: 20,
    },
    recommendationBanner: {
        marginHorizontal: 20,
        height: 180,
        borderRadius: 15,
        overflow: 'hidden',
        position: 'relative',
    },
    recommendationImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    recommendationOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    recommendationContent: {
        padding: 15,
    },
    recommendationLabel: {
        color: '#fff',
        fontSize: 12,
        marginBottom: 5,
        opacity: 0.9,
        fontFamily:'Montserrat_Regular'
    },
    recommendationTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        fontFamily:'Montserrat_Bold',
    },
    recommendationPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        fontFamily:'Montserrat_Bold',
    },
    recommendationPriceText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily:'Montserrat_Bold',
    },
    recommendationDiscountPrice: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    viewButton: {
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    viewButtonText: {
        color: '#000',
        fontWeight: '600',
        fontSize: 12,
    },
    spacer: {
        height: 15,
    },
});