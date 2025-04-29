import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import { useEffect, useState } from 'react';
import axios from 'axios';

// API URL for products
const API_URL = 'http://192.168.8.151:5000/api/products';

// Search Bar Component
const SearchBar = () => {
    return (
        <View style={styles.searchContainer}>
            <FontAwesome name='search' size={20} color="#999" style={styles.searchIcon}/>
            <TextInput
                placeholder={"Search Something ..."}
                style={styles.searchInput}
                autoFocus={true}
            />
            <TouchableOpacity>
                <FontAwesome name={'sliders'} size={20} color="#999"/>
            </TouchableOpacity>
        </View>
    );
};

// Category Selector Component
const CategorySelector = () => {
    const [categories, setCategories] = useState([{ name: 'All' }]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://192.168.8.151:5000/api/category');
                // Handle the response structure where categories are in response.data.categories
                if (response.data && response.data.categories && Array.isArray(response.data.categories)) {
                    setCategories([{ name: 'All' }, ...response.data.categories]);
                }
            } catch (error) {
                console.error('Error fetching categories', error);
            }
        };
        fetchCategories();
    }, []);

    const handleCategoryPress = (index) => {
        setActiveIndex(index);
        // If you want, you can also trigger a function here when a category is selected
    };

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categorySelectorContainer}
        >
            {categories.map((category, index) => (
                <TouchableOpacity
                    key={category._id || index}
                    style={[
                        styles.categoryButton,
                        index === activeIndex ? styles.categoryButtonActive : null
                    ]}
                    onPress={() => handleCategoryPress(index)}
                >
                    <Text
                        style={[
                            styles.categoryButtonText,
                            index === activeIndex ? styles.categoryButtonTextActive : null
                        ]}
                    >
                        {category.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
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

// Category Banners Component
const CategoryBanners = () => {
    return (
        <View style={styles.categoryBanners}>
            <View style={styles.categoryItem}>
                <Image
                    source={{ uri: 'https://plus.unsplash.com/premium_photo-1682125776589-e899882259c3?q=80&w=1942&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.categoryImage}
                />
                <Text style={styles.categoryLabel}>Collectibles</Text>
            </View>
            <View style={styles.categoryItem}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.categoryImage}
                />
                <Text style={styles.categoryLabel}>Electronics</Text>
            </View>
            <View style={styles.categoryItem}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1419640303358-44f0d27f48e7?q=80&w=1985&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                    style={styles.categoryImage}
                />
                <Text style={styles.categoryLabel}>Furniture</Text>
            </View>
        </View>
    );
};

// Product Item Component
const ProductItem = ({ product }) => {
    const navigation = useNavigation();
    
    return (
        <TouchableOpacity 
            style={styles.productItem} 
            onPress={() => navigation.navigate('ProductDetails', { productId: product._id })}
        >
            <Image
                source={{ uri: product.mainImage }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>{product.title}</Text>
                <Text style={styles.productPrice}>
                    {product.discountPrice ? `$${product.discountPrice.toFixed(2)}` : `$${product.price.toFixed(2)}`}
                </Text>
                {product.discountPrice && (
                    <Text style={styles.originalPrice}>${product.price.toFixed(2)}</Text>
                )}
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
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(API_URL);
                
                if (response.data && response.data.products) {
                    setProducts(response.data.products);
                }
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setError('Failed to load products');
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Loading products...</Text>
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
        <View style={styles.productGrid}>
            {products.map((product) => (
                <ProductItem key={product._id} product={product} />
            ))}
        </View>
    );
};

export default function BuyerSearchScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header
                title="All Products"
                showBackButton={false}
                onBackPress={() => navigation.goBack()}
            />
            <SearchBar />
            <ScrollView showsVerticalScrollIndicator={false}>
                <SectionTitle title="Popular Categories" />
                <CategorySelector />
                <CategoryBanners />

                <SectionTitle title="All Items" />
                <ProductGrid />

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
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginHorizontal: 16,
        marginBottom: 16,
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
    sectionTitleContainer: {
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 22,
        color: '#333',
        fontFamily: 'Montserrat_Bold',
    },
    categorySelectorContainer: {
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    categoryButtonActive: {
        backgroundColor: '#000',
    },
    categoryButtonText: {
        fontSize: 14,
        color: '#333',
        fontFamily: 'Montserrat_Regular',
    },
    categoryButtonTextActive: {
        color: '#fff',
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
        position: 'relative',
    },
    categoryImage: {
        width: '100%',
        height: '100%',
    },
    categoryLabel: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: 6,
        textAlign: 'center',
        fontFamily: 'Montserrat_SemiBold',
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
    productPrice: {
        fontSize: 14,
        color: '#e74c3c',
        fontFamily: 'Montserrat_Bold',
    },
    originalPrice: {
        fontSize: 12,
        color: '#999',
        textDecorationLine: 'line-through',
        marginTop: 2,
        fontFamily: 'Montserrat_Regular',
    },
    footer: {
        height: 20,
    },
    loaderContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorContainer: {
        padding: 20,
        alignItems: 'center',
    },
    errorText: {
        color: '#e74c3c',
        fontFamily: 'Montserrat_Regular',
    }
});