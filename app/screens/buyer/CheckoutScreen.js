import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import Header from "../../components/Header";
import { initStripe, useStripe } from '@stripe/stripe-react-native';

// Section Title Component
const SectionTitle = ({ title }) => {
    return (
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
        </View>
    );
};

// Address Selection Component
const AddressSelect = ({ addresses, selectedAddress, onSelect }) => {
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

                    <View style={styles.addressActions}>
                        <TouchableOpacity style={styles.addressAction}>
                            <FontAwesome name="pencil" size={14} color="#666" />
                            <Text style={styles.addressActionText}>Edit</Text>
                        </TouchableOpacity>

                        {!address.isDefault && (
                            <TouchableOpacity style={styles.addressAction}>
                                <FontAwesome name="trash" size={14} color="#666" />
                                <Text style={styles.addressActionText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.addAddressButton}>
                <FontAwesome name="plus" size={16} color="#3498db" />
                <Text style={styles.addAddressText}>Add New Address</Text>
            </TouchableOpacity>
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

            <TouchableOpacity style={styles.addPaymentButton}>
                <FontAwesome name="plus" size={16} color="#3498db" />
                <Text style={styles.addPaymentText}>Add Payment Method</Text>
            </TouchableOpacity>
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

    // Mock data for addresses
    const [addresses, setAddresses] = useState([
        {
            name: 'John Doe',
            street: '123 Vintage Lane',
            city: 'Colombo',
            state: 'Western Province',
            zip: '10100',
            phone: '+94 77 123 4567',
            isDefault: true
        },
        {
            name: 'John Doe',
            street: '456 Antique Street',
            city: 'Kandy',
            state: 'Central Province',
            zip: '20000',
            phone: '+94 77 890 1234',
            isDefault: false
        }
    ]);

    // Mock data for payment methods
    const [paymentMethods, setPaymentMethods] = useState([
        {
            name: 'Credit Card (Stripe)',
            type: 'Visa',
            lastDigits: '4567',
            icon: 'credit-card'
        },
        {
            name: 'Cash on Delivery',
            icon: 'money'
        }
    ]);

    // Mock data for cart items
    const [cartItems, setCartItems] = useState([
        {
            id: '1',
            name: 'Vintage Typewriter',
            image: 'https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3',
            price: 125.00,
            variant: 'Black, 1960s Model',
            quantity: 1
        },
        {
            id: '2',
            name: 'Antique Camera',
            image: 'https://images.unsplash.com/photo-1630012974522-7e683def2ae5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3',
            price: 89.50,
            variant: 'Brown, Film Camera',
            quantity: 2
        }
    ]);

    // State for selections
    const [selectedAddress, setSelectedAddress] = useState(0);
    const [selectedPayment, setSelectedPayment] = useState(0);
    const [specialInstructions, setSpecialInstructions] = useState('');

    // Calculate totals
    const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = 10.00;
    const discount = 0;
    const total = subtotal + shipping - discount;

    // Initialize Stripe payment sheet
    useEffect(() => {
        initializePaymentSheet();
    }, []);

    // Function to fetch payment intent from your backend
    const fetchPaymentSheetParams = async () => {
        // This would normally be an API call to your backend
        // For demo purposes, we'll simulate a response

        // In a real app, you'd replace this with an actual API call:
        // const response = await fetch(`your-backend-url/create-payment-intent`, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ amount: total * 100 }) // Convert to cents
        // });
        // const { paymentIntent, ephemeralKey, customer } = await response.json();

        // Mocked response
        return {
            paymentIntent: 'pi_mock_payment_intent_id',
            ephemeralKey: 'ek_mock_ephemeral_key',
            customer: 'cus_mock_customer_id',
            publishableKey: 'pk_test_your_publishable_key',
        };
    };

    const initializePaymentSheet = async () => {
        try {
            setLoading(true);

            // Fetch payment sheet parameters from your backend
            const { paymentIntent, ephemeralKey, customer, publishableKey } =
                await fetchPaymentSheetParams();

            // Initialize Stripe
            await initStripe({
                publishableKey: publishableKey,
                merchantIdentifier: 'merchant.com.yourdomain.app',
                // Only include this if you need it for Apple Pay
                // stripeAccountId: 'acct_12345678',
            });

            // Initialize the Payment Sheet
            const { error } = await initPaymentSheet({
                paymentIntentClientSecret: paymentIntent,
                customerEphemeralKeySecret: ephemeralKey,
                customerId: customer,
                merchantDisplayName: 'Vintage Collectibles',
                applePay: true,
                googlePay: true,
                style: 'alwaysLight',
                testEnv: true, // Remove for production
            });

            if (error) {
                console.error('Error initializing payment sheet:', error);
                Alert.alert('Error', 'Unable to initialize payment. Please try again.');
            }
        } catch (error) {
            console.error('Payment setup error:', error);
            Alert.alert('Error', 'Payment setup failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBackPress = () => {
        // Handle navigation back to cart
        console.log('Back button pressed');
        navigation.goBack();
    };

    const handlePlaceOrder = async () => {
        // If selected payment is Card (Stripe)
        if (selectedPayment === 0) {
            try {
                setLoading(true);
                // Present the payment sheet
                const { error } = await presentPaymentSheet();

                if (error) {
                    console.error('Payment error:', error);
                    Alert.alert('Payment failed', error.message);
                } else {
                    // Payment successful
                    processOrder();
                    // Navigate to order confirmation
                    navigation.navigate('OrderThankYou', {
                        orderId: 'VL' + Math.floor(100000 + Math.random() * 900000),
                        total: total.toFixed(2)
                    });
                }
            } catch (error) {
                console.error('Payment process error:', error);
                Alert.alert('Error', 'Payment process failed. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            // For cash on delivery
            processOrder();
            // Navigate to order confirmation
            navigation.navigate('OrderThankYou', {
                orderId: 'VL' + Math.floor(100000 + Math.random() * 900000),
                total: total.toFixed(2),
                paymentMethod: 'Cash on Delivery'
            });
        }
    };

    const processOrder = () => {
        // Process the order details (would normally send to backend)
        console.log('Order placed');
        console.log('Selected address:', addresses[selectedAddress]);
        console.log('Selected payment:', paymentMethods[selectedPayment]);
        console.log('Special instructions:', specialInstructions);
        console.log('Total amount:', total.toFixed(2));
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
                <AddressSelect
                    addresses={addresses}
                    selectedAddress={selectedAddress}
                    onSelect={setSelectedAddress}
                />

                <SectionTitle title="Payment Method" />
                <PaymentMethod
                    methods={paymentMethods}
                    selectedMethod={selectedPayment}
                    onSelect={setSelectedPayment}
                />

                <SectionTitle title="Special Instructions" />
                <View style={styles.specialInstructionsContainer}>
                    <TextInput
                        style={styles.specialInstructionsInput}
                        value={specialInstructions}
                        onChangeText={setSpecialInstructions}
                        placeholder="Add any special instructions for delivery"
                        multiline={true}
                        numberOfLines={3}
                    />
                </View>

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
                    style={styles.placeOrderButton}
                    onPress={handlePlaceOrder}
                    disabled={loading}
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
    sectionTitleContainer: {
        paddingHorizontal: 16,
        marginTop: 24,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
        color: '#333',
    },
    addressContainer: {
        paddingHorizontal: 16,
    },
    addressCard: {
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    addressCardSelected: {
        borderColor: '#3498db',
        backgroundColor: '#f0f7fd',
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    addressName: {
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    defaultBadge: {
        backgroundColor: '#3498db',
        borderRadius: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
    },
    defaultBadgeText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Montserrat_SemiBold',
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        fontFamily: 'Montserrat_Regular',
    },
    addressActions: {
        flexDirection: 'row',
        marginTop: 12,
    },
    addressAction: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    addressActionText: {
        marginLeft: 4,
        color: '#666',
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    addAddressText: {
        marginLeft: 8,
        color: '#3498db',
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    paymentMethodContainer: {
        paddingHorizontal: 16,
    },
    paymentMethodCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    paymentMethodSelected: {
        borderColor: '#3498db',
        backgroundColor: '#f0f7fd',
    },
    paymentMethodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    paymentIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    paymentMethodTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    paymentMethodDetails: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#3498db',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioButtonInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#3498db',
    },
    addPaymentButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        borderStyle: 'dashed',
        marginBottom: 16,
    },
    addPaymentText: {
        marginLeft: 8,
        color: '#3498db',
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    specialInstructionsContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    specialInstructionsInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 12,
        fontSize: 16,
        height: 100,
        textAlignVertical: 'top',
        fontFamily: 'Montserrat_Regular',
    },
    orderSummaryContainer: {
        marginHorizontal: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 80,
    },
    orderSummaryTitle: {
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    orderItemImage: {
        width: 70,
        height: 70,
        borderRadius: 8,
        marginRight: 12,
    },
    orderItemDetails: {
        flex: 1,
        justifyContent: 'space-between',
    },
    orderItemName: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
    },
    orderItemVariant: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    orderItemPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    orderItemPrice: {
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
        color: '#e74c3c',
    },
    orderItemQuantity: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
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
        borderTopWidth: 1,
        borderTopColor: '#eee',
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
    placeOrderContainer: {
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
    placeOrderButton: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    placeOrderButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
    },
    orderTotalContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    orderTotalText: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    footer: {
        height: 20,
    },
});