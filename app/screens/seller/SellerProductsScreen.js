import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    FlatList,
    ActivityIndicator,
    Alert
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

export default function SellerProductsScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [filterActive, setFilterActive] = useState('All');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            
            // Get seller ID from AsyncStorage
            const userDataString = await AsyncStorage.getItem('userData');
            if (!userDataString) {
                throw new Error('User data not found');
            }
            
            const userData = JSON.parse(userDataString);
            const sellerId = userData.userId;
            
            // Make API request
            const response = await axios.get(`https://vintage-lanka-backend-f1fa6938e3e3.herokuapp.com/api/products/seller/${sellerId}`);
            
            // Transform data to match our component structure
            const transformedProducts = response.data.map(product => ({
                id: product._id,
                title: product.title,
                price: product.discountPrice ? product.discountPrice.toString() : product.price.toString(),
                originalPrice: product.price.toString(),
                status: product.quantity > 0 ? 'Active' : 'Sold Out',
                image: product.mainImage,
                images: product.images,
                description: product.description,
                category: product.category.name,
                quantity: product.quantity,
                views: Math.floor(Math.random() * 100), // Mock data for views
                likes: Math.floor(Math.random() * 30), // Mock data for likes
                date: new Date(product.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                })
            }));
            
            setProducts(transformedProducts);
            setError(null);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
            Alert.alert('Error', 'Failed to load your products. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Filter products based on active filter
    const filteredProducts = filterActive === 'All'
        ? products
        : products.filter(product => product.status === filterActive);

    // Header Component
    const Header = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Listings</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="search" size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="sort-amount-desc" size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Filter Component
    const FilterTabs = () => {
        const filters = ['All', 'Active', 'Sold Out', 'Draft'];

        return (
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterTab,
                                filterActive === filter && styles.filterTabActive
                            ]}
                            onPress={() => setFilterActive(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                filterActive === filter && styles.filterTextActive
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    // Product Item Component
    const ProductItem = ({ item }) => {
        const getStatusColor = (status) => {
            switch(status) {
                case 'Active': return '#2ecc71';
                case 'Sold Out': return '#3498db';
                case 'Draft': return '#95a5a6';
                default: return '#95a5a6';
            }
        };

        return (
            <TouchableOpacity style={styles.productCard}>
                <View style={styles.productImageContainer}>
                    <Image 
                        source={{ uri: item.image }} 
                        style={styles.productImage} 
                        resizeMode="cover"
                    />
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.productPrice}>
                        ${item.price}
                        {item.originalPrice && item.price !== item.originalPrice && (
                            <Text style={styles.originalPrice}> ${item.originalPrice}</Text>
                        )}
                    </Text>

                    <View style={styles.productMetaContainer}>
                        <View style={styles.productMeta}>
                            <FontAwesome name="eye" size={14} color="#666" />
                            <Text style={styles.metaText}>{item.views}</Text>
                        </View>
                        <View style={styles.productMeta}>
                            <FontAwesome name="heart" size={14} color="#666" />
                            <Text style={styles.metaText}>{item.likes}</Text>
                        </View>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <FontAwesome name="ellipsis-v" size={18} color="#333" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };
    // Floating Action Button
    const FloatingActionButton = () => {
        const navigation = useNavigation();
    
        return (
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddProduct')}
            >
                <FontAwesome name="plus" size={24} color="#fff" />
            </TouchableOpacity>
        );
    };

    // Loading component
    const LoadingComponent = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#e74c3c" />
            <Text style={styles.loadingText}>Loading your listings...</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <Header />
            <FilterTabs />

            {loading ? (
                <LoadingComponent />
            ) : error ? (
                <View style={styles.emptyState}>
                    <FontAwesome name="exclamation-circle" size={50} color="#e74c3c" />
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity 
                        style={styles.retryButton}
                        onPress={fetchProducts}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : filteredProducts.length > 0 ? (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => <ProductItem item={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.productList}
                    refreshing={loading}
                    onRefresh={fetchProducts}
                />
            ) : (
                <View style={styles.emptyState}>
                    <FontAwesome name="inbox" size={50} color="#ddd" />
                    <Text style={styles.emptyText}>No {filterActive !== 'All' ? filterActive : ''} listings found</Text>
                </View>
            )}

            <FloatingActionButton />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerActions: {
        flexDirection: 'row',
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    filterContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filterTab: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    filterTabActive: {
        backgroundColor: '#000',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
    },
    filterTextActive: {
        color: '#fff',
    },
    productList: {
        padding: 12,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImageContainer: {
        width: 100,
        height: 100,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productInfo: {
        flex: 1,
        padding: 12,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 8,
    },
    originalPrice: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#999',
        textDecorationLine: 'line-through',
    },
    productMetaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 4,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
    errorText: {
        fontSize: 16,
        color: '#e74c3c',
        marginTop: 12,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: 16,
        paddingVertical: 8,
        paddingHorizontal: 24,
        backgroundColor: '#e74c3c',
        borderRadius: 20,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingBottom: 30,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageUpload: {
        height: 180,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    uploadText: {
        marginTop: 8,
        fontSize: 16,
        color: '#999',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    selectInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectText: {
        fontSize: 16,
        color: '#999',
    },
    conditionOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    conditionOption: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    conditionText: {
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 30,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    draftButton: {
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    publishButton: {
        backgroundColor: '#e74c3c',
        marginLeft: 8,
    },
    draftButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    publishButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
});