import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";

// Section Title Component
const SectionTitle = ({ title, actionText, onAction }) => {
    return (
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {actionText && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={styles.actionText}>{actionText}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Empty State Component
const EmptyState = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.emptyStateContainer}>
            <FontAwesome name="heart" size={80} color="#e0e0e0" />
            <Text style={styles.emptyStateTitle}>No favorites yet</Text>
            <Text style={styles.emptyStateText}>
                Items you favorite will appear here for easy access
            </Text>
            <TouchableOpacity
                style={styles.browseButton}
                onPress={() => navigation.navigate('Home')}
            >
                <Text style={styles.browseButtonText}>Browse Products</Text>
            </TouchableOpacity>
        </View>
    );
};

// Favorite Item Component
const FavoriteItem = ({ item, onRemove, onPress }) => {
    return (
        <TouchableOpacity style={styles.favoriteItem} onPress={onPress}>
            <Image source={{ uri: item.imageUri }} style={styles.favoriteImage} />
            <View style={styles.favoriteInfo}>
                <Text style={styles.favoriteName}>{item.name}</Text>
                <Text style={styles.favoritePrice}>${item.price}</Text>
                <Text style={styles.favoriteCondition}>{item.condition}</Text>
            </View>
            <View style={styles.favoriteActions}>
                <TouchableOpacity style={styles.favoriteActionButton} onPress={onRemove}>
                    <FontAwesome name="heart" size={22} color="#e74c3c" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.favoriteActionButton}>
                    <FontAwesome name="shopping-cart" size={22} color="#333" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

// Recently Viewed Item Component
const RecentlyViewedItem = ({ item, onPress, onFavorite }) => {
    return (
        <TouchableOpacity style={styles.recentItem} onPress={onPress}>
            <Image source={{ uri: item.imageUri }} style={styles.recentImage} />
            <View style={styles.recentInfo}>
                <Text style={styles.recentName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.recentPrice}>${item.price}</Text>
            </View>
            <TouchableOpacity
                style={styles.recentFavoriteButton}
                onPress={onFavorite}
            >
                <FontAwesome
                    name={item.isFavorite ? "heart" : "heart-o"}
                    size={18}
                    color={item.isFavorite ? "#e74c3c" : "#666"}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default function BuyerFavoritesScreen() {
    const navigation = useNavigation();

    // Sample data for favorites
    const favorites = [
        {
            id: '1',
            name: 'Vintage Typewriter 1950s',
            price: '225.00',
            condition: 'Very Good',
            imageUri: 'https://images.unsplash.com/photo-1630012974522-7e683def2ae5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
            id: '2',
            name: 'Antique Camera Collection',
            price: '350.00',
            condition: 'Excellent',
            imageUri: 'https://images.unsplash.com/photo-1679973957366-2f926a250629?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
            id: '3',
            name: 'Vintage Record Player',
            price: '175.00',
            condition: 'Good',
            imageUri: 'https://images.unsplash.com/photo-1656870916547-9e6a8a17f6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
        }
    ];

    // Sample data for recently viewed
    const recentlyViewed = [
        {
            id: '4',
            name: 'Antique Wooden Chair',
            price: '135.00',
            isFavorite: false,
            imageUri: 'https://images.unsplash.com/photo-1601854266103-c1dd42130633?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
            id: '5',
            name: 'Classic Pocket Watch',
            price: '95.00',
            isFavorite: true,
            imageUri: 'https://images.unsplash.com/photo-1603706580932-6befcf7d8044?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
        },
        {
            id: '6',
            name: 'Vintage Leather Suitcase',
            price: '210.00',
            isFavorite: false,
            imageUri: 'https://images.unsplash.com/photo-1585155784229-aff921ccfa10?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3'
        }
    ];

    // Determine if we should show empty state or favorites list
    const showFavorites = favorites.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            <Header
                title="My Favorites"
                showBackButton={false}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
                {showFavorites ? (
                    <>
                        <SectionTitle
                            title="Favorite Items"
                            actionText="Clear All"
                            onAction={() => console.log('Clear favorites')}
                        />

                        <View style={styles.favoritesContainer}>
                            {favorites.map(item => (
                                <FavoriteItem
                                    key={item.id}
                                    item={item}
                                    onRemove={() => console.log('Remove from favorites', item.id)}
                                    onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                                />
                            ))}
                        </View>
                    </>
                ) : (
                    <EmptyState />
                )}

                {recentlyViewed.length > 0 && (
                    <>
                        <SectionTitle
                            title="Recently Viewed"
                            actionText="View All"
                            onAction={() => console.log('View all recently viewed')}
                        />

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.recentlyViewedContainer}
                        >
                            {recentlyViewed.map(item => (
                                <RecentlyViewedItem
                                    key={item.id}
                                    item={item}
                                    onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
                                    onFavorite={() => console.log('Toggle favorite', item.id)}
                                />
                            ))}
                        </ScrollView>
                    </>
                )}

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
    scrollView: {
        flex: 1,
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 16,
    },
    sectionTitle: {
        fontSize: 22,
        color: '#333',
        fontFamily: 'Montserrat_Bold',
    },
    actionText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat_SemiBold',
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        marginTop: 60,
    },
    emptyStateTitle: {
        fontSize: 22,
        fontFamily: 'Montserrat_Bold',
        marginTop: 24,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 24,
        fontFamily: 'Montserrat_Regular',
    },
    browseButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    browseButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    favoritesContainer: {
        paddingHorizontal: 16,
    },
    favoriteItem: {
        flexDirection: 'row',
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    favoriteImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
    favoriteInfo: {
        flex: 1,
        marginLeft: 16,
        justifyContent: 'center',
    },
    favoriteName: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    favoritePrice: {
        fontSize: 16,
        color: '#e74c3c',
        marginTop: 4,
        fontFamily: 'Montserrat_Bold',
    },
    favoriteCondition: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
        fontFamily: 'Montserrat_Regular',
    },
    favoriteActions: {
        justifyContent: 'space-around',
        marginLeft: 8,
    },
    favoriteActionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 6,
    },
    recentlyViewedContainer: {
        paddingLeft: 16,
        marginBottom: 24,
    },
    recentItem: {
        width: 160,
        marginRight: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        position: 'relative',
    },
    recentImage: {
        width: '100%',
        height: 140,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
    },
    recentInfo: {
        padding: 12,
    },
    recentName: {
        fontSize: 14,
        fontFamily: 'Montserrat_SemiBold',
    },
    recentPrice: {
        fontSize: 14,
        color: '#e74c3c',
        marginTop: 4,
        fontFamily: 'Montserrat_Bold',
    },
    recentFavoriteButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        height: 20,
    },
});