import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { initStripe, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Section Title Component
const SectionTitle = ({ title }) => {
    return (
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
};

// Address Display Component - Simplified to only show addresses
const AddressDisplay = ({ addresses, selectedAddress, onSelect }) => {
    return (
        <View style={styles.addressContainer}>
            {addresses.map((address, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.addressCard,
                        selectedAddress === index ? styles.addressCardSelected : null
                    ]}
                    onPress={() => onSelect(index)}
                >
                    <View style={styles.addressHeader}>
                        <Text style={styles.addressName}>{address.name}</Text>
                        {address.isDefault && (
                            <View style={styles.defaultBadge}>
                                <Text style={styles.defaultBadgeText}>Default</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.addressText}>{address.street}</Text>
                    <Text style={styles.addressText}>{address.city}, {address.state} {address.zip}</Text>
                    <Text style={styles.addressText}>{address.phone}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// Payment Method Component
const PaymentMethod = ({ methods, selectedMethod, onSelect }) => {
    return (
        <View style={styles.paymentMethodContainer}>
            {methods.map((method, index) => (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.paymentMethodCard,
                        selectedMethod === index ? styles.paymentMethodSelected : null
                    ]}
                    onPress={() => onSelect(index)}
                >
                    <View style={styles.paymentMethodLeft}>
                        <View style={styles.paymentIcon}>
                            <FontAwesome name={method.icon} size={20} color="#333" />
                        </View>
                        <View>
                            <Text style={styles.paymentMethodTitle}>{method.name}</Text>
                            {method.lastDigits && (
                                <Text style={styles.paymentMethodDetails}>
                                    {method.type} ending in {method.lastDigits}
                                </Text>
                            )}
                        </View>
                    </View>

                    <View style={styles.radioButton}>
                        {selectedMethod === index && <View style={styles.radioButtonInner} />}
                    </View>
                </TouchableOpacity>
            ))}
        </View>
    );
};

// Order Summary Component
const OrderSummary = ({ items, subtotal, shipping, discount, total }) => {
    return (
        <View style={styles.orderSummaryContainer}>
            <Text style={styles.orderSummaryTitle}>Order Summary</Text>

            {items.map((item, index) => (
                <View key={index} style={styles.orderItem}>
                    <Image source={{ uri: item.image }} style={styles.orderItemImage} />
                    <View style={styles.orderItemDetails}>
                        <Text style={styles.orderItemName}>{item.name}</Text>
                        <Text style={styles.orderItemVariant}>{item.variant}</Text>
                        <View style={styles.orderItemPriceRow}>
                            <Text style={styles.orderItemPrice}>${item.price.toFixed(2)}</Text>
                            <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                        </View>
                    </View>
                </View>
            ))}

            <View style={styles.summaryDivider} />

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

export default function CheckoutScreen({ navigation, route }) {
    // Stripe initialization
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);
    const [paymentSheetEnabled, setPaymentSheetEnabled] = useState(false);
    
    // User data state
    const [userId, setUserId] = useState(null);
    const [userData, setUserData] = useState(null);
    
    // Cart state
    const [cartItems, setCartItems] = useState([]);
    
    // Address state
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(0);

    // Payment methods
    const [paymentMethods, setPaymentMethods] = useState([
        {
            name: 'Credit Card (Stripe)',
            type: 'Card',
            icon: 'credit-card'
        },
        {
            name: 'Cash on Delivery',
            icon: 'money'
        }
    ]);

    // State for selections
    const [selectedPayment, setSelectedPayment] = useState(0);
    const [specialInstructions, setSpecialInstructions] = useState('');

    // API URL base - replace with your actual backend URL
    const API_URL = 'http://192.168.8.151:5000';

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 10.00;
    const discount = 0;
    const total = subtotal + shipping - discount;

    // Load user data and cart on component mount
    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch user data from AsyncStorage
    const fetchUserData = async () => {
        try {
            const userDataStr = await AsyncStorage.getItem('userData');
            if (userDataStr) {
                const parsedUserData = JSON.parse(userDataStr);
                setUserData(parsedUserData);
                setUserId(parsedUserData.userId);
                
                // Parse addresses from user data
                if (parsedUserData.userAddresses) {
                    try {
                        const userAddresses = JSON.parse(parsedUserData.userAddresses);
                        
                        // Format addresses to match the expected format
                        const formattedAddresses = userAddresses.map(addr => ({
                            name: parsedUserData.userFullName || 'User',
                            street: addr.street || '',
                            city: addr.city || '',
                            state: addr.state || '',
                            zip: addr.zip || '',
                            phone: parsedUserData.userPhoneNumber || '',
                            isDefault: addr.isDefault || false
                        }));
                        
                        setAddresses(formattedAddresses.length > 0 ? formattedAddresses : []);
                    } catch (e) {
                        console.error('Error parsing addresses:', e);
                        setAddresses([]);
                    }
                }
                
                // Fetch cart items
                fetchCartItems(parsedUserData.userId);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            Alert.alert('Error', 'Failed to load user data');
        }
    };

    // Fetch cart items from API
    const fetchCartItems = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/users/${userId}/cart`);
            
            if (response.status === 200) {
                // Check if response.data.cart exists and is an array
                if (response.data.cart && Array.isArray(response.data.cart)) {
                    // Format cart items to match the expected structure
                    const formattedCartItems = response.data.cart.map(item => ({
                        id: item.product._id,
                        name: item.product.title || 'Unnamed Product', // Use title instead of name
                        image: item.product.mainImage || 'https://via.placeholder.com/150', // Use mainImage instead of imageUrl
                        price: item.product.price,
                        variant: item.product.category || 'Standard',
                        quantity: item.quantity
                    }));
                    
                    setCartItems(formattedCartItems);
                } else {
                    // If cart is empty or not in expected format, set empty array
                    console.warn('Cart is empty or in unexpected format:', response.data);
                    setCartItems([]);
                    Alert.alert('Info', 'Your cart is empty');
                }
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            Alert.alert('Error', 'Failed to load cart items');
        } finally {
            setLoading(false);
        }
    };

    // Initialize Stripe
    useEffect(() => {
        const initializeStripe = async () => {
            await initStripe({
                publishableKey: 'pk_test_51RJoQe2c3BXHFyvAaXEGMcUbLtpYtDxPK5wvFty3FSa3057oH24jOmP4BBqpLhqZIh1e6j3tenmCmLKPpRQzuLVB00mbiKvnZ9',
                merchantIdentifier: 'merchant.com.vintageCollectibles',
            });
        };
        
        initializeStripe();
    }, []);

    // Initialize payment sheet when cart or total changes
    useEffect(() => {
        if (cartItems.length > 0 && total > 0) {
            initializePaymentSheet();
        }
    }, [cartItems, total]);

    // Function to fetch payment intent from your backend
    const fetchPaymentSheetParams = async () => {
        try {
            // Make the actual API request to your backend
            const response = await axios.post(`${API_URL}/create-payment-intent`, {
                amount: total, // The backend will convert to cents
            });
            
            // Return the client secret from your backend
            return {
                clientSecret: response.data.clientSecret,
            };
        } catch (error) {
            console.error('Error fetching payment intent:', error);
            Alert.alert('Payment Error', 'Failed to prepare payment. Please try again.');
            throw error;
        }
    };

    const initializePaymentSheet = async () => {
        try {
            setLoading(true);

            // Get the payment intent client secret from your server
            const { clientSecret } = await fetchPaymentSheetParams();

            // Initialize the Payment Sheet
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Vintage Collectibles',
                allowsDelayedPaymentMethods: true,
                defaultBillingDetails: {
                    name: userData?.userFullName || '',
                    address: addresses.length > 0 ? {
                        city: addresses[selectedAddress].city,
                        country: 'US',
                        line1: addresses[selectedAddress].street,
                        postalCode: addresses[selectedAddress].zip,
                        state: addresses[selectedAddress].state,
                    } : undefined,
                }
            });

            if (!error) {
                setPaymentSheetEnabled(true);
            } else {
                console.error('Error initializing payment sheet:', error.message);
                Alert.alert('Error', `Unable to initialize payment: ${error.message}`);
                setPaymentSheetEnabled(false);
            }
        } catch (error) {
            console.error('Payment setup error:', error);
            Alert.alert('Error', 'Payment setup failed. Please try again.');
            setPaymentSheetEnabled(false);
        } finally {
            setLoading(false);
        }
    };

    // Handle payment using Stripe
    const handleStripePayment = async () => {
        try {
            setLoading(true);
            
            // Present the payment sheet
            const { error } = await presentPaymentSheet();
            
            if (error) {
                console.error('Payment error:', error.message);
                Alert.alert('Payment failed', error.message);
                return false;
            } else {
                // Payment successful
                console.log('Payment successful!');
                return true;
            }
        } catch (error) {
            console.error('Stripe payment process error:', error);
            Alert.alert('Error', 'Payment process failed. Please try again.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Handle back button press
    const handleBackPress = () => {
        navigation.goBack();
    };

    // Handle place order
    const handlePlaceOrder = async () => {
        if (cartItems.length === 0) {
            Alert.alert('Error', 'Your cart is empty');
            return;
        }
        
        if (addresses.length === 0) {
            Alert.alert('Error', 'Please add a shipping address');
            return;
        }
        
        try {
            // If selected payment is Card (Stripe)
            if (selectedPayment === 0) {
                // Process Stripe payment
                const paymentSuccessful = await handleStripePayment();
                
                if (paymentSuccessful) {
                    const orderId = await processOrder('Credit Card (Stripe)');
                    navigateToThankYou('Credit Card (Stripe)', orderId);
                }
            } else {
                // For cash on delivery
                const orderId = await processOrder('Cash on Delivery');
                navigateToThankYou('Cash on Delivery', orderId);
            }
        } catch (error) {
            console.error('Order placement failed:', error);
            // Alert was already shown in processOrder
        }
    };

    const processOrder = async (paymentMethodName) => {
        try {
            setLoading(true);
            
            // Format shipping address according to the shippingAddressSchema
            const formattedAddress = {
                street: addresses[selectedAddress].street,
                city: addresses[selectedAddress].city,
                state: addresses[selectedAddress].state,
                zipCode: addresses[selectedAddress].zip || 123456,
                country: "US" // Adding required country field
            };
            
            // Create order object matching the orderSchema structure
            const orderData = {
                buyer: userId,
                orderItems: cartItems.map(item => ({
                    product: item.id, // This is the MongoDB ObjectId of the product
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: formattedAddress,
                totalAmount: total,
                paymentStatus: paymentMethodName === 'Cash on Delivery' ? 'Pending' : 'Paid',
                orderStatus: 'Pending'
                // Note: specialInstructions is not in your schema, so removed it
            };
            
            // Log the data being sent for debugging
            console.log('Sending order data:', JSON.stringify(orderData, null, 2));
            
            // Send order to your backend
            const response = await axios.post(`${API_URL}/api/orders`, orderData);
            
            if (response.status === 201 || response.status === 200) {
                console.log('Order created successfully:', response.data);
                // Clear cart after successful order creation
                await axios.delete(`${API_URL}/api/users/${userId}/cart`);
                // Return the order ID from the response
                return response.data.order?._id || generateOrderId();
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            // Log the full error response for debugging
            console.error('Error processing order:', error.response?.data || error.message);
            
            // Display specific error message if available
            if (error.response?.data?.message) {
                Alert.alert('Order Error', error.response.data.message);
            } else if (error.response?.data?.error) {
                Alert.alert('Order Error', error.response.data.error);
            } else {
                Alert.alert('Order Error', 'Could not process your order. Please try again.');
            }
            
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const generateOrderId = () => {
        return 'VL' + Math.floor(100000 + Math.random() * 900000);
    };

    const navigateToThankYou = (paymentMethodName, orderId = null) => {
        navigation.navigate('OrderThankYou', {
            orderId: orderId || generateOrderId(),
            total: total.toFixed(2),
            paymentMethod: paymentMethodName
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Using the reusable Header component with back button */}
            <Header
                title="Checkout"
                showBackButton={true}
                onBackPress={handleBackPress}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
                <SectionTitle title="Shipping Address" />
                {addresses.length > 0 ? (
                    <AddressDisplay
                        addresses={addresses}
                        selectedAddress={selectedAddress}
                        onSelect={setSelectedAddress}
                    />
                ) : (
                    <View style={styles.noAddressContainer}>
                        <Text style={styles.noAddressText}>No addresses found</Text>
                        <TouchableOpacity 
                            style={styles.addAddressButton}
                            onPress={() => navigation.navigate('AddressBook')}
                        >
                            <Text style={styles.addAddressButtonText}>Add Address</Text>
                        </TouchableOpacity>
                    </View>
                )}

                <SectionTitle title="Payment Method" />
                <PaymentMethod
                    methods={paymentMethods}
                    selectedMethod={selectedPayment}
                    onSelect={setSelectedPayment}
                />
                <OrderSummary
                    items={cartItems}
                    subtotal={subtotal}
                    shipping={shipping}
                    discount={discount}
                    total={total}
                />

                <View style={styles.footer} />
            </ScrollView>

            <View style={styles.placeOrderContainer}>
                <TouchableOpacity
                    style={[
                        styles.placeOrderButton,
                        (loading || addresses.length === 0 || cartItems.length === 0) && styles.placeOrderButtonDisabled
                    ]}
                    onPress={handlePlaceOrder}
                    disabled={loading || addresses.length === 0 || cartItems.length === 0}
                >
                    <Text style={styles.placeOrderButtonText}>
                        {loading ? 'Processing...' : 'Place Order'}
                    </Text>
                    <View style={styles.orderTotalContainer}>
                        <Text style={styles.orderTotalText}>${total.toFixed(2)}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    // Section Title Styles
    sectionTitleContainer: {
        marginTop: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    // Address Styles
    addressContainer: {
        marginBottom: 16,
    },
    addressCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    addressCardSelected: {
        borderColor: '#5b7cfc',
        borderWidth: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    defaultBadge: {
        backgroundColor: '#5b7cfc',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    defaultBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    addressText: {
        fontSize: 14,
        color: '#555',
        marginBottom: 2,
    },
    noAddressContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    noAddressText: {
        fontSize: 16,
        color: '#777',
        marginBottom: 10,
    },
    addAddressButton: {
        backgroundColor: '#5b7cfc',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
    },
    addAddressButtonText: {
        color: '#fff',
        fontWeight: '500',
    },
    // Payment Method Styles
    paymentMethodContainer: {
        marginBottom: 16,
    },
    paymentMethodCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    paymentMethodSelected: {
        borderColor: '#5b7cfc',
        borderWidth: 2,
    },
    paymentMethodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paymentMethodTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    paymentMethodDetails: {
        fontSize: 14,
        color: '#777',
        marginTop: 2,
    },
    radioButton: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#5b7cfc',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioButtonInner: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#5b7cfc',
    },
    // Special Instructions Styles
    specialInstructionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    specialInstructionsInput: {
        height: 80,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#333',
    },
    // Order Summary Styles
    orderSummaryContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
    },
    orderSummaryTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        marginBottom: 12,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderItemImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 12,
    },
    orderItemDetails: {
        flex: 1,
    },
    orderItemName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 2,
    },
    orderItemVariant: {
        fontSize: 14,
        color: '#777',
        marginBottom: 4,
    },
    orderItemPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    orderItemPrice: {
        fontSize: 15,
        fontWeight: '500',
        color: '#333',
    },
    orderItemQuantity: {
        fontSize: 14,
        color: '#777',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 12,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#777',
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
    },
    discountValue: {
        color: '#4caf50',
    },
    totalRow: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    totalValue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
    },
    // Footer
    footer: {
        height: 80,
    },
    // Place Order Button
    placeOrderContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    placeOrderButton: {
        backgroundColor: '#5b7cfc',
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
    },
    placeOrderButtonDisabled: {
        backgroundColor: '#b6c2f5',
    },
    placeOrderButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    orderTotalContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    orderTotalText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});