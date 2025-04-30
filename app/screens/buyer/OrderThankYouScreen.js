import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View, Image, Share } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import Header from "../../components/Header";
import LottieView from 'lottie-react-native';
import { useEffect, useRef } from 'react';

export default function OrderThankYouScreen({ navigation, route }) {
    // Get order details from route params
    const { orderId, total, paymentMethod = 'Credit Card' } = route.params || {};
    const animationRef = useRef(null);

    useEffect(() => {
        // Auto-play animation when component mounts
        if (animationRef.current) {
            setTimeout(() => {
                animationRef.current.play();
            }, 100);
        }
    }, []);

    const handleContinueShopping = () => {
        navigation.navigate('BuyerTabs', {
            screen: 'Home',
        });
    };

    const handleTrackOrder = () => {
        // Navigate to order tracking screen
        navigation.navigate('OrderTracking', { orderId });
    };

    const handleShareOrder = async () => {
        try {
            await Share.share({
                message: `I just purchased some amazing vintage items from Vintage Collectibles! Order #${orderId} for $${total}`,
                title: 'My Vintage Purchase',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    // Get current date and estimated delivery date (7 days from now)
    const currentDate = new Date();
    const deliveryDate = new Date();
    deliveryDate.setDate(currentDate.getDate() + 7);

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            <Header
                title="Order Confirmation"
                showBackButton={false}
            />

            <View style={styles.content}>
                {/* Animation container */}
                <View style={styles.animationContainer}>
                    {/* Replace this View with Lottie animation in actual implementation */}
                    <View style={styles.animationPlaceholder}>
                        <FontAwesome name="check-circle" size={80} color="#27ae60" />
                    </View>
                    {/* Uncomment this when using Lottie
                    <LottieView
                        ref={animationRef}
                        source={require('../../assets/animations/order-success.json')}
                        style={styles.animation}
                        loop={false}
                    />
                    */}
                </View>

                <Text style={styles.thankYouTitle}>Thank You!</Text>
                <Text style={styles.thankYouSubtitle}>Your order has been placed successfully</Text>

                <View style={styles.orderInfoContainer}>
                    <View style={styles.orderInfoRow}>
                        <Text style={styles.orderInfoLabel}>Order Number:</Text>
                        <Text style={styles.orderInfoValue}>{orderId}</Text>
                    </View>

                    <View style={styles.orderInfoRow}>
                        <Text style={styles.orderInfoLabel}>Date:</Text>
                        <Text style={styles.orderInfoValue}>{formatDate(currentDate)}</Text>
                    </View>

                    <View style={styles.orderInfoRow}>
                        <Text style={styles.orderInfoLabel}>Payment Method:</Text>
                        <Text style={styles.orderInfoValue}>{paymentMethod}</Text>
                    </View>

                    <View style={styles.orderInfoRow}>
                        <Text style={styles.orderInfoLabel}>Total Amount:</Text>
                        <Text style={[styles.orderInfoValue, styles.totalValue]}>${total}</Text>
                    </View>

                    <View style={styles.orderInfoRow}>
                        <Text style={styles.orderInfoLabel}>Estimated Delivery:</Text>
                        <Text style={styles.orderInfoValue}>{formatDate(deliveryDate)}</Text>
                    </View>
                </View>

                <View style={styles.noteContainer}>
                    <FontAwesome name="info-circle" size={16} color="#3498db" style={styles.noteIcon} />
                    <Text style={styles.noteText}>
                        You will receive an email confirmation shortly with your order details
                    </Text>
                </View>

                <View style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.primaryButton} onPress={handleTrackOrder}>
                        <Text style={styles.primaryButtonText}>Track Order</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.secondaryButton} onPress={handleContinueShopping}>
                        <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.shareButton} onPress={handleShareOrder}>
                        <FontAwesome name="share-alt" size={18} color="#3498db" />
                        <Text style={styles.shareButtonText}>Share</Text>
                    </TouchableOpacity>
                </View>
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
    content: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    animationContainer: {
        width: 150,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    animation: {
        width: '100%',
        height: '100%',
    },
    animationPlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f7fd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    thankYouTitle: {
        fontSize: 28,
        fontFamily: 'Montserrat_Bold',
        color: '#333',
        marginBottom: 8,
    },
    thankYouSubtitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
        marginBottom: 24,
        textAlign: 'center',
    },
    orderInfoContainer: {
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 24,
    },
    orderInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    orderInfoLabel: {
        fontSize: 16,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
    },
    orderInfoValue: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
        color: '#333',
    },
    totalValue: {
        color: '#e74c3c',
        fontFamily: 'Montserrat_Bold',
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f0f7fd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 24,
        width: '100%',
    },
    noteIcon: {
        marginRight: 8,
    },
    noteText: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
        color: '#3498db',
    },
    actionsContainer: {
        width: '100%',
    },
    primaryButton: {
        backgroundColor: '#000',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Montserrat_Bold',
    },
    secondaryButton: {
        backgroundColor: '#f5f5f5',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginBottom: 12,
    },
    secondaryButtonText: {
        color: '#333',
        fontSize: 18,
        fontFamily: 'Montserrat_SemiBold',
    },
    shareButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
    },
    shareButtonText: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
        color: '#3498db',
        marginLeft: 8,
    },
});