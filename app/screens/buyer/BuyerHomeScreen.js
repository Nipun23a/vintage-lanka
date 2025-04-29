import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from 'expo-font';
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from 'react';
import axios from 'axios';

// API config
const API_URL = 'http://192.168.8.151:5000/api/products';

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

// Product Grid Component
const ProductGrid = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch products from API
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_URL);
                setProducts(response.data.products);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#000" />
                <Text style={styles.loaderText}>Loading products...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => {
                    setLoading(true);
                    setError(null);
                    fetchProducts();
                }}>
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch all products for different sections
        const fetchProducts = async () => {
            try {
                const response = await axios.get(API_URL);
                setProductsData(response.data.products);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Render different sections based on products
    const renderProductSections = () => {
        if (loading) {
            return (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loaderText}>Loading products...</Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            );
        }

        return (
            <>
                <SectionTitle title="New Arrivals" />
                <View style={styles.productGrid}>
                    {productsData.slice(0, 2).map((product) => (
                        <ProductItem key={product._id} product={product} />
                    ))}
                </View>

                <SectionTitle title="Featured Items" />
                <View style={styles.productGrid}>
                    {productsData.map((product) => (
                        <ProductItem key={product._id} product={product} />
                    ))}
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <HeroBanner />
                <FeaturedBanners />
                <CategoryBanners />
                {renderProductSections()}
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
});