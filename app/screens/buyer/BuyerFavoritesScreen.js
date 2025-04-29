import { StatusBar } from 'expo-status-bar';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Alert,
    ActivityIndicator
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/Header";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

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

export default function BuyerFavoritesScreen() {
    const navigation = useNavigation();
    const [favourites,setFavourites] = useState([]);
    const [loading,setLoading] = useState(true);
    useEffect(() => {

        const fetchFavorites = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (!userData){
                    Alert.alert('Error','User data is not found. Please log in again');
                    return;
                }
                const parsedUserData = JSON.parse(userData);
                const userId = parsedUserData.userId;

                const response = await axios.get(`http://192.168.8.151:5000/api/users/${userId}/favourites`)
                setFavourites(response.data.favourites);
            }catch (error){
                console.error('Error fetching favorites:', error);
            }finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const handleRemoveFavorite = async (productId) => {
        try {
            const userDataString = await AsyncStorage.getItem('userData');
            if (!userDataString) {
                Alert.alert('Error', 'User not found. Please log in again.');
                return;
            }
    
            const { userId } = JSON.parse(userDataString);
    
            const response = await axios.delete(`http://192.168.8.151:5000/api/users/${userId}/favourites/${productId}`);
            if (response.status === 200) {
                const updatedFavourites = favourites.filter(fav => fav._id !== productId);
                setFavourites(updatedFavourites);
    
                // Optional: Update AsyncStorage if you're storing them there
                const parsedUserData = JSON.parse(userDataString);
                parsedUserData.userFavourites = JSON.stringify(updatedFavourites.map(f => f._id));
                await AsyncStorage.setItem('userData', JSON.stringify(parsedUserData));
            }
        } catch (error) {
            console.error('Error removing from favorites:', error);
            Alert.alert('Error', 'Failed to remove item from favorites.');
        }
    };
    // Determine if we should show empty state or favorites list
    const showFavorites = favourites.length > 0;

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#000" />
            </SafeAreaView>
        );
    }

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
                            {favourites.map(item => (
                                <FavoriteItem
                                key={item._id}
                                item={{
                                    id: item._id,
                                    name: item.title,
                                    price: item.price.toFixed(2),
                                    imageUri: item.mainImage,
                                    condition: item.condition || 'N/A',
                                }}
                                    onRemove={() => handleRemoveFavorite(item._id)}
                                    onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
                                />
                            ))}
                        </View>
                    </>
                ) : (
                    <EmptyState />
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