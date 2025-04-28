import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, Image, View, Alert} from 'react-native';
import {FontAwesome} from "@expo/vector-icons";
import Header from "../../components/Header";
import {useEffect, useState} from "react";



// Cart Item Component
const CartItem = ({ item, onRemove, onIncrement, onDecrement }) => {
    return (
        <View style={styles.cartItem}>
            <Image source={{ uri: item.image }} style={styles.cartItemImage} />

            <View style={styles.cartItemDetails}>
                <View style={styles.cartItemTop}>
                    <Text style={styles.cartItemName}>{item.name}</Text>
                    <TouchableOpacity onPress={() => onRemove(item.id)}>
                        <FontAwesome name="trash" size={18} color="#e74c3c" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>

                <View style={styles.cartItemBottom}>
                    <Text style={styles.cartItemVariant}>{item.variant}</Text>

                    <View style={styles.quantityControl}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => onDecrement(item.id)}
                            disabled={item.quantity <= 1}
                        >
                            <FontAwesome name="minus" size={12} color={item.quantity <= 1 ? "#ccc" : "#333"} />
                        </TouchableOpacity>

                        <Text style={styles.quantityText}>{item.quantity}</Text>

                        <TouchableOpacity
                            style={styles.quantityButton}
                            onPress={() => onIncrement(item.id)}
                        >
                            <FontAwesome name="plus" size={12} color="#333" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

// Promo Code Component
const PromoCode = ({ promoCode, setPromoCode, onApply }) => {
    return (
        <View style={styles.promoContainer}>
            <Text style={styles.promoTitle}>Promo Code</Text>
            <View style={styles.promoInputContainer}>
                <TextInput
                    style={styles.promoInput}
                    value={promoCode}
                    onChangeText={setPromoCode}
                    placeholder="Enter promo code"
                />
                <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                    <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};


// Order Summary Component
const OrderSummary = ({ subtotal, shipping, discount, total }) => {
    return (
        <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Order Summary</Text>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
            </View>

            <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>${shipping.toFixed(2)}</Text>
            </View>

            {discount > 0 && (
                <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text style={[styles.summaryValue, styles.discountValue]}>-${discount.toFixed(2)}</Text>
                </View>
            )}

            <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
            </View>
        </View>
    );
};

// Import TextInput for promo code
import { TextInput } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CartScreen({ navigation }) {
    const [cartItems, setCartItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    // Calculate cart totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 0 ? 10.00 : 0.00;
    const total = subtotal + shipping - discount;

    // Load cart items from AsyncStorage when component mounts
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                setIsLoading(true);
                const userData = await AsyncStorage.getItem('userData');

                if (userData) {
                    const parsedUserData = JSON.parse(userData);
                    if (parsedUserData.userCart) {
                        const userCart = JSON.parse(parsedUserData.userCart);
                        setCartItems(userCart);
                    }
                }
            } catch (error) {
                console.log('Error loading cart items:', error);
                Alert.alert('Error', 'Failed to load your cart items.');
            } finally {
                setIsLoading(false);
            }
        };

        loadCartItems();
    }, []);

    // Update cart in AsyncStorage whenever cart items change
    const updateCartInStorage = async (updatedCart) => {
        try {
            const userData = await AsyncStorage.getItem('userData');

            if (userData) {
                const parsedUserData = JSON.parse(userData);
                const updatedUserData = {
                    ...parsedUserData,
                    userCart: JSON.stringify(updatedCart)
                };

                await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
            }
        } catch (error) {
            console.log('Error updating cart in storage:', error);
            Alert.alert('Error', 'Failed to update your cart.');
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleRemoveItem = (itemId) => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        setCartItems(updatedCart);
        updateCartInStorage(updatedCart);
    };

    const handleIncrement = (itemId) => {
        const updatedCart = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item
        );
        setCartItems(updatedCart);
        updateCartInStorage(updatedCart);
    };

    const handleDecrement = (itemId) => {
        const updatedCart = cartItems.map(item =>
            item.id === itemId && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        );
        setCartItems(updatedCart);
        updateCartInStorage(updatedCart);
    };

    const handleApplyPromo = () => {
        // Simple promo code logic - replace with your actual implementation
        if (promoCode.toUpperCase() === 'VINTAGE20') {
            const discountAmount = subtotal * 0.2;
            setDiscount(discountAmount);
            Alert.alert('Success', 'Promo code applied successfully!');
        } else if (promoCode) {
            Alert.alert('Error', 'Invalid promo code');
            setDiscount(0);
        }
    };

    const handleCheckout = () => {
        // Navigate to checkout screen
        navigation.navigate('Checkout');
    };

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header
                    title="My Cart"
                    showBackButton={true}
                    onBackPress={handleBackPress}
                />
                <View style={styles.loadingContainer}>
                    <FontAwesome name="spinner" size={40} color="#333" />
                    <Text style={styles.loadingText}>Loading your cart...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Using the reusable Header component with back button */}
            <Header
                title="My Cart"
                showBackButton={true}
                onBackPress={handleBackPress}
            />

            {cartItems.length > 0 ? (
                <>
                    <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                        <View style={styles.cartItemsContainer}>
                            {cartItems.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onRemove={handleRemoveItem}
                                    onIncrement={handleIncrement}
                                    onDecrement={handleDecrement}
                                />
                            ))}
                        </View>

                        <PromoCode
                            promoCode={promoCode}
                            setPromoCode={setPromoCode}
                            onApply={handleApplyPromo}
                        />

                        <OrderSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            discount={discount}
                            total={total}
                        />

                        <View style={styles.footer} />
                    </ScrollView>

                    <View style={styles.checkoutContainer}>
                        <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                            <View style={styles.checkoutPriceContainer}>
                                <Text style={styles.checkoutPrice}>${total.toFixed(2)}</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.emptyCartContainer}>
                    <FontAwesome name="shopping-cart" size={80} color="#ddd" />
                    <Text style={styles.emptyCartText}>Your cart is empty</Text>
                    <Text style={styles.emptyCartSubtext}>Add items to your cart to start shopping</Text>

                    <TouchableOpacity
                        style={styles.continueShoppingButton}
                        onPress={() => {
                            navigation.navigate('BuyerTabs', { screen: 'Home' });
                        }}
                    >
                        <Text style={styles.continueShoppingText}>Continue Shopping</Text>
                    </TouchableOpacity>
                </View>
            )}
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
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Montserrat_Bold',
    },
    content: {
        flex: 1,
    },
    cartItemsContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    cartItem: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    cartItemImage: {
        width: 100,
        height: 100,
        borderRadius: 10,
        marginRight: 16,
    },
    cartItemDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    cartItemTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    cartItemName: {
        fontSize: 18,
        fontFamily: 'Montserrat_SemiBold',
        width: '80%',
    },
    cartItemPrice: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
        color: '#e74c3c',
        marginVertical: 8,
    },
    cartItemBottom: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cartItemVariant: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
    },
    quantityButton: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityText: {
        paddingHorizontal: 12,
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    promoContainer: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        marginHorizontal: 16,
        borderRadius: 12,
        marginVertical: 16,
    },
    promoTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 12,
    },
    promoInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    promoInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginRight: 12,
        fontSize: 16,
        fontFamily: 'Montserrat_Regular',
        backgroundColor: '#fff',
    },
    applyButton: {
        backgroundColor: '#000',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
    },
    applyButtonText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    summaryContainer: {
        padding: 16,
        backgroundColor: '#f9f9f9',
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 80,
    },
    summaryTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    summaryLabel: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    summaryValue: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    discountValue: {
        color: '#27ae60',
    },
    totalRow: {
        borderBottomWidth: 0,
        marginTop: 8,
        paddingTop: 12,
    },
    totalLabel: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
    },
    totalValue: {
        fontSize: 20,
        fontFamily: 'Montserrat_Bold',
        color: '#e74c3c',
    },
    checkoutContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 24,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    checkoutButton: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    checkoutButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
    },
    checkoutPriceContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    checkoutPrice: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    emptyCartContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    emptyCartText: {
        fontSize: 24,
        fontFamily: 'Montserrat_Bold',
        marginTop: 24,
        marginBottom: 8,
    },
    emptyCartSubtext: {
        fontSize: 16,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
    },
    continueShoppingButton: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        width: '80%',
    },
    continueShoppingText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    footer: {
        height: 20,
    },
});