import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useFonts } from 'expo-font';


const Header = () => {
    return(
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <View>
                    <Text style={styles.headerGreeting}>Hello,</Text>
                    <Text style={styles.headerTitle}>Welcome Back! <Text>👋</Text></Text>
                </View>
                <TouchableOpacity style={styles.cartButton}>
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

// Category Selector Component
const CategorySelector = () => {
    const categories = ['All', 'Cloth', 'Electronic', 'Home', 'Decor', 'Books'];

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categorySelectorContainer}
        >
            {categories.map((category, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.categoryButton,
                        index === 0 ? styles.categoryButtonActive : null
                    ]}
                >
                    <Text
                        style={[
                            styles.categoryButtonText,
                            index === 0 ? styles.categoryButtonTextActive : null
                        ]}
                    >
                        {category}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

// Product Item Component
const ProductItem = ({ imageUri }) => {
    return (
        <TouchableOpacity style={styles.productItem}>
            <Image
                source={{ uri: imageUri }}
                style={styles.productImage}
            />
            <View style={styles.productInfo}>
                <Text style={styles.productName}>Vintage Item</Text>
                <Text style={styles.productPrice}>$125.00</Text>
            </View>
        </TouchableOpacity>
    );
};

// Product Grid Component
const ProductGrid = () => {
    const products = [
        'https://images.unsplash.com/photo-1630012974522-7e683def2ae5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1679973957366-2f926a250629?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1656870916547-9e6a8a17f6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        'https://images.unsplash.com/photo-1601854266103-c1dd42130633?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ];

    return (
        <View style={styles.productGrid}>
            {products.map((uri, index) => (
                <ProductItem key={index} imageUri={uri} />
            ))}
        </View>
    );
};

export default function BuyerHomeScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <HeroBanner />
                <FeaturedBanners />
                <CategoryBanners />

                <SectionTitle title="New Arrival" />
                <CategorySelector />
                <ProductGrid />

                <SectionTitle title="Featured Items" />
                <ProductGrid />

                <SectionTitle title="Popular Collections" />
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
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        marginTop:10,
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
    footer: {
        height: 20,
    },
});