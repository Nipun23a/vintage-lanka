import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../../components/Header";

// Image Gallery Component
const ImageGallery = ({ images = [] }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    
    const handleScroll = (event) => {
        const slideWidth = event.nativeEvent.layoutMeasurement.width;
        const offset = event.nativeEvent.contentOffset.x;
        const index = Math.floor(offset / slideWidth);
        setActiveIndex(index);
    };

    return (
        <View style={styles.imageGalleryContainer}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imageGallery}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {images.length > 0 ? (
                    images.map((uri, index) => (
                        <Image
                            key={index}
                            source={{ uri }}
                            style={styles.productImage}
                        />
                    ))
                ) : (
                    <View style={[styles.productImage, styles.noImageContainer]}>
                        <FontAwesome name="image" size={64} color="#ccc" />
                        <Text style={styles.noImageText}>No image available</Text>
                    </View>
                )}
            </ScrollView>
            <View style={styles.imageDots}>
                {images.length > 0 && images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.imageDot,
                            activeIndex === index ? styles.imageDotActive : {}
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// Product Info Component
const ProductInfo = ({ title, price, discountPrice, seller, productId, isFavorite, onToggleFavorite, navigation }) => {
    // Add navigation to the props

    const handleContactPress = () => {
        if (!seller) return;
        
        navigation.navigate('Chat', {
            sellerId: seller._id,
            sellerName: seller.fullname || seller.name || "Seller",
            sellerImage: seller.profileImage || 'https://via.placeholder.com/50',
            productId: productId,
            productTitle: title
        });
    };

    return (
        <View style={styles.productInfoContainer}>
            <View style={styles.productTitleRow}>
                <Text style={styles.productTitle}>{title || "Product Title"}</Text>
                <View style={styles.actionContainer}>
                    <TouchableOpacity 
                        style={styles.favoriteButton} 
                        onPress={onToggleFavorite}
                    >
                        <FontAwesome 
                            name={isFavorite ? "heart" : "heart-o"} 
                            size={24} 
                            color={isFavorite ? "#e74c3c" : "#333"} 
                        />
                    </TouchableOpacity>
                    <View style={styles.priceContainer}>
                        {discountPrice && discountPrice < price ? (
                            <>
                                <Text style={styles.originalPrice}>${price?.toFixed(2)}</Text>
                                <Text style={styles.productPrice}>${discountPrice?.toFixed(2)}</Text>
                            </>
                        ) : (
                            <Text style={styles.productPrice}>${price?.toFixed(2)}</Text>
                        )}
                    </View>
                </View>
            </View>

            {seller && (
                <View style={styles.sellerContainer}>
                    <Image
                        source={{ uri: seller.profileImage || 'https://via.placeholder.com/50' }}
                        style={styles.sellerImage}
                    />
                    <View style={styles.sellerInfo}>
                        <Text style={styles.sellerName}>{seller.name || seller.fullname || "Seller"}</Text>
                        <View style={styles.ratingContainer}>
                            <FontAwesome name="star" size={16} color="#FFD700" />
                            <FontAwesome name="star" size={16} color="#FFD700" />
                            <FontAwesome name="star" size={16} color="#FFD700" />
                            <FontAwesome name="star" size={16} color="#FFD700" />
                            <FontAwesome name="star-half-o" size={16} color="#FFD700" />
                            <Text style={styles.ratingText}>({seller.rating || "4.5"})</Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.contactButton}
                        onPress={handleContactPress}
                    >
                        <Text style={styles.contactButtonText}>Contact</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

// Product Details Component
const ProductDetails = ({ category, description, quantity }) => {
    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Product Details</Text>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{category?.name || "Uncategorized"}</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Quantity</Text>
                <Text style={styles.detailValue}>{quantity || 0} in stock</Text>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
                {description || "No description available"}
            </Text>
        </View>
    );
};

// Similar Products Component
const SimilarProducts = ({ currentProductId, categoryId }) => {
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchSimilarProducts = async () => {
            if (!categoryId) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                const response = await axios.get('http://192.168.8.151:5000/api/products');
                
                if (response.data && response.data.products) {
                    // Filter products by the same category and exclude current product
                    const filtered = response.data.products.filter(
                        product => product._id !== currentProductId && 
                        product.category && 
                        product.category._id === categoryId
                    );
                    
                    // If no products in same category, just get some other products
                    if (filtered.length === 0) {
                        const otherProducts = response.data.products
                            .filter(product => product._id !== currentProductId)
                            .slice(0, 5);
                        setSimilarProducts(otherProducts);
                    } else {
                        setSimilarProducts(filtered.slice(0, 5)); // Limit to 5 similar products
                    }
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching similar products:', error);
                setLoading(false);
            }
        };

        fetchSimilarProducts();
    }, [currentProductId, categoryId]);

    if (loading) {
        return (
            <View style={styles.similarProductsContainer}>
                <Text style={styles.sectionTitle}>Similar Products</Text>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#e74c3c" />
                </View>
            </View>
        );
    }

    if (similarProducts.length === 0) {
        return null; // Don't show the section if no similar products
    }

    return (
        <View style={styles.similarProductsContainer}>
            <Text style={styles.sectionTitle}>Similar Products</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {similarProducts.map((product) => (
                    <TouchableOpacity 
                        key={product._id} 
                        style={styles.similarProductItem}
                        onPress={() => navigation.replace('ProductDetails', { productId: product._id })}
                    >
                        <Image 
                            source={{ uri: product.mainImage || (product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/180x140') }} 
                            style={styles.similarProductImage} 
                        />
                        <View style={styles.similarProductInfo}>
                            <Text style={styles.similarProductName} numberOfLines={1}>
                                {product.title}
                            </Text>
                            <View style={styles.similarProductPriceContainer}>
                                {product.discountPrice && product.discountPrice < product.price ? (
                                    <>
                                        <Text style={styles.similarProductOriginalPrice}>${product.price.toFixed(2)}</Text>
                                        <Text style={styles.similarProductPrice}>${product.discountPrice.toFixed(2)}</Text>
                                    </>
                                ) : (
                                    <Text style={styles.similarProductPrice}>${product.price.toFixed(2)}</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// Bottom Action Bar Component
const BottomActionBar = ({ quantity,addToCart}) => {
    return (
        <View style={styles.bottomBar}>
            <View style={styles.bottomBarContent}>
                <TouchableOpacity 
                    style={[styles.cartButton, quantity <= 0 && styles.disabledButton]}
                    disabled={quantity <= 0} onPress={addToCart}
                >
                    <FontAwesome name="shopping-cart" size={20} color="white" />
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>


            </View>
        </View>
    );
};

export default function ProductDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [userFavorites, setUserFavorites] = useState([]);

    const { productId } = route.params || {};


    

    useEffect(() => {
        const getUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    setUserId(userData.userId);
                    
                    // Parse favorites array from AsyncStorage
                    if (userData.userFavourites) {
                        const favorites = JSON.parse(userData.userFavourites);
                        setUserFavorites(favorites);
                        
                        // Check if current product is in favorites
                        if (productId && favorites.some(fav => fav._id === productId || fav === productId)) {
                            setIsFavorite(true);
                        }
                    }
                }
            } catch (error) {
                console.error('Error retrieving user data:', error);
            }
        };

        getUserData();
    }, [productId]);

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                setLoading(true);
                // Use your actual API endpoint here
                const response = await axios.get(`http://192.168.8.151:5000/api/products/${productId}`);
                setProduct(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching product data:', err);
                setError('Could not load product details');
                setLoading(false);
            }
        };

        if (productId) {
            fetchProductData();
        } else {
            setError('No product ID provided');
            setLoading(false);
        }
    }, [productId]);

    const handleToggleFavorite = async () => {
        if (!userId) {
            Alert.alert('Login Required', 'Please login to add items to favorites');
            return;
        }
    
        try {
            let response;
            const newFavoriteState = !isFavorite;
    
            if (newFavoriteState) {
                // Add to favorites (POST request)
                response = await axios.post(`http://192.168.8.151:5000/api/users/${userId}/favourites/${productId}`);
            } else {
                // Remove from favorites (DELETE request)
                response = await axios.delete(`http://192.168.8.151:5000/api/users/${userId}/favourites/${productId}`);
            }
    
            if (response.status === 200) {
                setIsFavorite(newFavoriteState);
    
                let updatedFavorites = [...userFavorites];
    
                if (newFavoriteState) {
                    // Add product
                    if (!updatedFavorites.some(fav => fav._id === productId || fav === productId)) {
                        updatedFavorites.push(productId);
                    }
                } else {
                    // Remove product
                    updatedFavorites = updatedFavorites.filter(fav =>
                        (fav._id !== productId) && (fav !== productId)
                    );
                }
    
                setUserFavorites(updatedFavorites);
    
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const userData = JSON.parse(userDataString);
                    userData.userFavourites = JSON.stringify(updatedFavorites);
                    await AsyncStorage.setItem('userData', JSON.stringify(userData));
                }
    
                Alert.alert(
                    newFavoriteState ? 'Added to Favorites' : 'Removed from Favorites',
                    newFavoriteState ? 'Product added to your favorites' : 'Product removed from your favorites'
                );
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error);
            Alert.alert('Error', 'Failed to update favorites. Please try again.');
        }
    };

    const handleAddToCart = async () => {
        try {
            const response = await axios.post(`http://192.168.8.151:5000/api/users/${userId}/cart`,{
                productId
            });
            if (response.status === 200){
                Alert.alert('Success','Product Added Sucessfully')
            }
        } catch (error) {
            console.log('Add to cart error',error);
            Alert.alert('Error','Failed to add product to cart');
        }
    }

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <Header
                    title="Product Details"
                    showBackButton={true}
                    onBackPress={() => navigation.goBack()}
                />
                <ActivityIndicator size="large" color="#e74c3c" />
                <Text style={styles.loadingText}>Loading product details...</Text>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.errorContainer}>
                <Header
                    title="Product Details"
                    showBackButton={true}
                    onBackPress={() => navigation.goBack()}
                />
                <FontAwesome name="exclamation-circle" size={64} color="#e74c3c" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.retryButtonText}>Go Back</Text>
                </TouchableOpacity>
            </SafeAreaView>
        );
    }

    // Prepare images array, ensuring mainImage is first
    const productImages = product ? 
        product.images ? 
            (product.images.length > 0 ? product.images : 
                (product.mainImage ? [product.mainImage] : [])) : 
            (product.mainImage ? [product.mainImage] : []) : 
        [];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header
                title="Product Details"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            {product && (
                <>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <ImageGallery images={productImages} />
                        <ProductInfo 
                            title={product.title} 
                            price={product.price} 
                            discountPrice={product.discountPrice}
                            seller={product.seller}
                            productId={product._id}
                            isFavorite={isFavorite}
                            onToggleFavorite={handleToggleFavorite}
                            navigation={navigation} // Pass navigation prop here
                        />
                        <ProductDetails 
                            category={product.category} 
                            description={product.description}
                            quantity={product.quantity}
                        />
                        <SimilarProducts 
                            currentProductId={product._id}
                            categoryId={product.category?._id}
                        />
                        <View style={styles.footer} />
                    </ScrollView>

                    <BottomActionBar quantity={product.quantity} addToCart={handleAddToCart} />
                </>
            )}
        </SafeAreaView>
    );
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 15,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
        color: '#333',
    },
    errorContainer: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        marginTop: 16,
        fontSize: 18,
        fontFamily: 'Montserrat_SemiBold',
        color: '#333',
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 24,
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: '#e74c3c',
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    imageGalleryContainer: {
        height: 300,
        position: 'relative',
    },
    imageGallery: {
        width: '100%',
        height: '100%',
    },
    productImage: {
        width: windowWidth,
        height: 300,
        resizeMode: 'cover',
    },
    noImageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    noImageText: {
        marginTop: 16,
        fontSize: 16,
        color: '#999',
        fontFamily: 'Montserrat_SemiBold',
    },
    imageDots: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
    },
    imageDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ddd',
        marginHorizontal: 4,
    },
    imageDotActive: {
        backgroundColor: '#000',
    },
    productInfoContainer: {
        padding: 16,
        borderBottomWidth: 8,
        borderBottomColor: '#f5f5f5',
    },
    productTitleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    productTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat_Bold',
        flex: 1,
        marginRight: 10,
    },
    actionContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end',
    },
    favoriteButton: {
        padding: 8,
        marginBottom: 8,
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    productPrice: {
        fontSize: 22,
        fontFamily: 'Montserrat_Bold',
        color: '#e74c3c',
    },
    originalPrice: {
        fontSize: 16,
        fontFamily: 'Montserrat_Regular',
        color: '#999',
        textDecorationLine: 'line-through',
        marginBottom: 4,
    },
    sellerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    sellerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    sellerInfo: {
        marginLeft: 12,
        flex: 1,
    },
    sellerName: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    ratingText: {
        marginLeft: 4,
        color: '#666',
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
    },
    contactButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
    },
    contactButtonText: {
        fontFamily: 'Montserrat_SemiBold',
        color: '#333',
    },
    detailsContainer: {
        padding: 16,
        borderBottomWidth: 8,
        borderBottomColor: '#f5f5f5',
    },
    sectionTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 12,
        marginTop: 4,
    },
    detailRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    detailLabel: {
        width: 100,
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    detailValue: {
        flex: 1,
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    description: {
        fontSize: 16,
        lineHeight: 24,
        color: '#333',
        fontFamily: 'Montserrat_Regular',
    },
    similarProductsContainer: {
        padding: 16,
    },
    similarProductItem: {
        width: 180,
        marginRight: 16,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    similarProductImage: {
        width: '100%',
        height: 140,
    },
    similarProductInfo: {
        padding: 12,
    },
    similarProductName: {
        fontSize: 15,
        fontFamily: 'Montserrat_SemiBold',
        marginBottom: 4,
    },
    similarProductPriceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    similarProductPrice: {
        fontSize: 14,
        color: '#e74c3c',
        fontFamily: 'Montserrat_Bold',
    },
    similarProductOriginalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
        marginRight: 5,
        fontFamily: 'Montserrat_Regular',
    },
    loadingContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomBar: {
        backgroundColor: '#fff',
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    bottomBarContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cartButton: {
        flex: 1,
        backgroundColor: '#FF0000',
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        marginRight: 10,
    },
    buyNowButton: {
        flex: 1,
        backgroundColor: '#e74c3c',
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        marginLeft: 10,
    },
    disabledButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
        marginLeft: 8,
    },
    footer: {
        height: 20,
    },
});