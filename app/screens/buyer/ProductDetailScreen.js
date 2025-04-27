import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";



// Image Gallery Component
const ImageGallery = () => {
    const images = [
        'https://images.unsplash.com/photo-1630012974522-7e683def2ae5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1656870916547-9e6a8a17f6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1601854266103-c1dd42130633?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];

    return (
        <View style={styles.imageGalleryContainer}>
            <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={styles.imageGallery}
            >
                {images.map((uri, index) => (
                    <Image
                        key={index}
                        source={{ uri }}
                        style={styles.productImage}
                    />
                ))}
            </ScrollView>
            <View style={styles.imageDots}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.imageDot,
                            index === 0 ? styles.imageDotActive : {}
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

// Product Info Component
const ProductInfo = () => {
    return (
        <View style={styles.productInfoContainer}>
            <View style={styles.productTitleRow}>
                <Text style={styles.productTitle}>Vintage Typewriter 1950s</Text>
                <Text style={styles.productPrice}>$225.00</Text>
            </View>

            <View style={styles.sellerContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3' }}
                    style={styles.sellerImage}
                />
                <View style={styles.sellerInfo}>
                    <Text style={styles.sellerName}>Sarah Johnson</Text>
                    <View style={styles.ratingContainer}>
                        <FontAwesome name="star" size={16} color="#FFD700" />
                        <FontAwesome name="star" size={16} color="#FFD700" />
                        <FontAwesome name="star" size={16} color="#FFD700" />
                        <FontAwesome name="star" size={16} color="#FFD700" />
                        <FontAwesome name="star-half-o" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}>(4.5)</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.contactButton}>
                    <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Product Details Component
const ProductDetails = () => {
    return (
        <View style={styles.detailsContainer}>
            <Text style={styles.sectionTitle}>Product Details</Text>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Condition</Text>
                <Text style={styles.detailValue}>Very Good</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Brand</Text>
                <Text style={styles.detailValue}>Royal</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Year</Text>
                <Text style={styles.detailValue}>1957</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>Collectibles</Text>
            </View>

            <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Location</Text>
                <Text style={styles.detailValue}>Colombo, Sri Lanka</Text>
            </View>

            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
                Beautiful vintage Royal typewriter from the 1950s. This rare collectors' piece is in excellent working condition and comes with the original case. The keys are responsive, and the ribbon has been recently replaced. Perfect for collectors, writers, or as a decorative piece in your home or office.
            </Text>
        </View>
    );
};

// Similar Products Component
const SimilarProducts = () => {
    const products = [
        'https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1603706580932-6befcf7d8044?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
        'https://images.unsplash.com/photo-1585155784229-aff921ccfa10?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3',
    ];

    return (
        <View style={styles.similarProductsContainer}>
            <Text style={styles.sectionTitle}>Similar Products</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {products.map((uri, index) => (
                    <TouchableOpacity key={index} style={styles.similarProductItem}>
                        <Image source={{ uri }} style={styles.similarProductImage} />
                        <View style={styles.similarProductInfo}>
                            <Text style={styles.similarProductName}>Vintage Item</Text>
                            <Text style={styles.similarProductPrice}>$195.00</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

// Bottom Action Bar Component
const BottomActionBar = () => {
    return (
        <View style={styles.bottomBar}>
            <View style={styles.bottomBarContent}>
                <TouchableOpacity style={styles.cartButton}>
                    <FontAwesome name="shopping-cart" size={20} color="white" />
                    <Text style={styles.buttonText}>Add to Cart</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.buyNowButton}>
                    <Text style={styles.buttonText}>Buy Now</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default function ProductDetailScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header
                title="Product Details"
                showBackButton={true}
                onBackPress={() => navigation.goBack()}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageGallery />
                <ProductInfo />
                <ProductDetails />
                <SimilarProducts />
                <View style={styles.footer} />
            </ScrollView>

            <BottomActionBar />
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
    },
    productPrice: {
        fontSize: 22,
        fontFamily: 'Montserrat_Bold',
        color: '#e74c3c',
        marginLeft: 8,
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
    similarProductPrice: {
        fontSize: 14,
        color: '#e74c3c',
        fontFamily: 'Montserrat_Bold',
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
        backgroundColor: '#333',
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