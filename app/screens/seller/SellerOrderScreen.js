import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    FlatList,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function SellerOrdersScreen() {
    const [activeTab, setActiveTab] = useState('Current');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const navigation = useNavigation();

    // Get user ID from AsyncStorage
    useEffect(() => {
        const getUserData = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const parsedData = JSON.parse(userData);
                    setUserId(parsedData.userId);
                }
            } catch (error) {
                console.error('Error getting user data:', error);
                setError('Failed to load user data');
            }
        };

        getUserData();
    }, []);

    // Fetch orders from API when userId is available
    useEffect(() => {
        if (userId) {
            fetchOrders();
        }
    }, [userId]);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://192.168.8.151:5000/api/orders/${userId}/seller`);
            
            // Process the orders data to match our component's expected format
            const processedOrders = response.data.orders.map(order => {
                return {
                    id: order._id,
                    buyerName: order.buyer.fullname,
                    date: new Date(order.createdAt).toLocaleDateString('en-US', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }),
                    status: order.orderStatus,
                    items: order.orderItems.map(item => ({
                        title: item.product.title,
                        quantity: item.quantity,
                        price: item.price.toFixed(2),
                    })),
                    total: order.totalAmount.toFixed(2),
                    paymentStatus: order.paymentStatus,
                    shippingAddress: order.shippingAddress
                };
            });
            
            setOrders(processedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to load orders');
            setLoading(false);
        }
    };

    // Filter orders based on active tab
    const filteredOrders = orders.filter(order => {
        if (activeTab === 'Current') {
            return ['Processing', 'To Ship', 'Shipped'].includes(order.status);
        } else if (activeTab === 'Completed') {
            return ['Delivered', 'Completed'].includes(order.status);
        } else if (activeTab === 'Cancelled') {
            return order.status === 'Cancelled';
        }
        return true; // All tab
    });

    // Header Component
    const Header = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>Orders</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="search" size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="filter" size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Tab Bar Component
    const TabBar = () => {
        const tabs = ['Current', 'Completed', 'Cancelled', 'All'];

        return (
            <View style={styles.tabBarContainer}>
                {tabs.map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[
                            styles.tab,
                            activeTab === tab && styles.activeTab
                        ]}
                        onPress={() => setActiveTab(tab)}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}>
                            {tab}
                        </Text>
                        {activeTab === tab && <View style={styles.activeTabIndicator} />}
                    </TouchableOpacity>
                ))}
            </View>
        );
    };

    // Status Badge Component
    const StatusBadge = ({ status }) => {
        const getStatusInfo = (status) => {
            switch(status) {
                case 'Pending':
                    return { color: '#f39c12', icon: 'clock-o' };
                case 'Processing':
                    return { color: '#f39c12', icon: 'hourglass-start' };
                case 'Shipped':
                    return { color: '#3498db', icon: 'truck' };
                case 'Delivered':
                    return { color: '#2ecc71', icon: 'check-circle' };
                case 'Cancelled':
                    return { color: '#95a5a6', icon: 'times-circle' };
                default:
                    return { color: '#95a5a6', icon: 'circle' };
            }
        };

        const statusInfo = getStatusInfo(status);

        return (
            <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                <FontAwesome name={statusInfo.icon} size={12} color="#fff" style={styles.statusIcon} />
                <Text style={styles.statusText}>{status}</Text>
            </View>
        );
    };

    // Order Item Component
    const OrderItem = ({ order }) => {
        const [expanded, setExpanded] = useState(false);

        const handleUpdateStatus = async (newStatus) => {
            Alert.alert(
                "Update Order Status",
                `Are you sure you want to update this order to "${newStatus}"?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Update",
                        onPress: async () => {
                            try {
                                // Use order.id instead of order._id and update orderStatus instead of status
                                await axios.patch(`http://192.168.8.151:5000/api/orders/${order.id}`, {
                                    status: newStatus
                                });
    
                                Alert.alert("Success", "Order status updated successfully");
    
                                fetchOrders(); // Refresh the orders
                            } catch (error) {
                                console.error('Error updating order status:', error);
                                Alert.alert("Error", "Failed to update order status");
                            }
                        }
                    }
                ]
            );
        };

        return (
            <View style={styles.orderCard}>
                <TouchableOpacity
                    style={styles.orderHeader}
                    onPress={() => setExpanded(!expanded)}
                >
                    <View style={styles.orderHeaderLeft}>
                        <Image source={{ uri: order.buyerImage }} style={styles.buyerImage} />
                        <View>
                            <Text style={styles.orderId}>{order.id}</Text>
                            <Text style={styles.buyerName}>{order.buyerName}</Text>
                        </View>
                    </View>
                    <View style={styles.orderHeaderRight}>
                        <Text style={styles.orderDate}>{order.date}</Text>
                        <StatusBadge status={order.status} />
                    </View>
                </TouchableOpacity>

                {expanded && (
                    <View style={styles.orderDetails}>
                        <View style={styles.orderItems}>
                            {order.items.map((item, index) => (
                                <View key={index} style={styles.orderItem}>
                                    <View style={styles.itemInfo}>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>${item.price}</Text>
                                </View>
                            ))}
                        </View>

                        <View style={styles.orderSummary}>
                            <View style={styles.orderTotal}>
                                <Text style={styles.orderTotalLabel}>Total Amount:</Text>
                                <Text style={styles.orderTotalValue}>${order.total}</Text>
                            </View>

                            <View style={styles.orderInfo}>
                                <Text style={styles.orderInfoLabel}>Payment:</Text>
                                <Text style={styles.orderInfoValue}>{order.paymentStatus}</Text>
                            </View>

                            {order.shippingAddress && (
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderInfoLabel}>Shipping Address:</Text>
                                    <Text style={styles.orderInfoValue}>
                                        {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.zipCode}`}
                                    </Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.actionButtons}>
                            {order.status === 'Pending' && (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.primaryButton]}
                                    onPress={() => handleUpdateStatus('Processing')}
                                >
                                    <Text style={styles.primaryButtonText}>Start Processing</Text>
                                </TouchableOpacity>
                            )}

                            {order.status === 'Processing' && (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.primaryButton]}
                                    onPress={() => handleUpdateStatus('Shipped')}
                                >
                                    <Text style={styles.primaryButtonText}>Mark as Shipped</Text>
                                </TouchableOpacity>
                            )}

                            {(order.status === 'Pending' || order.status === 'Processing') && (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.secondaryButton]}
                                    onPress={() => handleUpdateStatus('Cancelled')}
                                >
                                    <Text style={styles.secondaryButtonText}>Cancel Order</Text>
                                </TouchableOpacity>
                            )}

                            {order.status === 'Shipped' && (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.primaryButton]}
                                    onPress={() => handleUpdateStatus('Delivered')}
                                >
                                    <Text style={styles.primaryButtonText}>Mark as Delivered</Text>
                                </TouchableOpacity>
                            )}

                            {order.status === 'Delivered' && (
                                <TouchableOpacity 
                                    style={[styles.actionButton, styles.primaryButton]}
                                    onPress={() => handleUpdateStatus('Completed')}
                                >
                                    <Text style={styles.primaryButtonText}>Mark as Completed</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
            </View>
        );
    };

    // Empty State Component
    const EmptyState = () => (
        <View style={styles.emptyState}>
            <FontAwesome name="inbox" size={50} color="#ddd" />
            <Text style={styles.emptyStateTitle}>No Orders Found</Text>
            <Text style={styles.emptyStateText}>
                {activeTab === 'Current' ? 'You have no current orders to fulfill.' :
                    activeTab === 'Completed' ? 'You have no completed orders yet.' :
                        activeTab === 'Cancelled' ? 'You have no cancelled orders.' :
                            'You have no orders yet.'}
            </Text>
        </View>
    );

    // Loading Component
    const LoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
    );

    // Error Component
    const ErrorState = () => (
        <View style={styles.errorContainer}>
            <FontAwesome name="exclamation-circle" size={50} color="#e74c3c" />
            <Text style={styles.errorTitle}>Error Loading Orders</Text>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchOrders}
            >
                <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <Header />
            <TabBar />

            {loading ? (
                <LoadingState />
            ) : error ? (
                <ErrorState />
            ) : filteredOrders.length > 0 ? (
                <FlatList
                    data={filteredOrders}
                    renderItem={({ item }) => <OrderItem order={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.ordersList}
                    onRefresh={fetchOrders}
                    refreshing={loading}
                />
            ) : (
                <EmptyState />
            )}
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
        marginTop:10,
        paddingVertical: 16,
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
    tabBarContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    tab: {
        paddingVertical: 16,
        marginRight: 20,
        position: 'relative',
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: '#e74c3c',
    },
    tabText: {
        fontSize: 16,
        color: '#666',
    },
    activeTabText: {
        fontWeight: '600',
        color: '#333',
    },
    activeTabIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 3,
        backgroundColor: '#e74c3c',
    },
    ordersList: {
        padding: 16,
    },
    orderCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        overflow: 'hidden',
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    orderHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buyerImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    orderId: {
        fontSize: 14,
        color: '#666',
    },
    buyerName: {
        fontSize: 16,
        fontWeight: '500',
        marginTop: 2,
    },
    orderHeaderRight: {
        alignItems: 'flex-end',
    },
    orderDate: {
        fontSize: 14,
        color: '#999',
        marginBottom: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusIcon: {
        marginRight: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '500',
    },
    orderDetails: {
        padding: 16,
    },
    orderItems: {
        marginBottom: 16,
    },
    orderItem: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'center',
    },
    itemImage: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 12,
    },
    itemInfo: {
        flex: 1,
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    itemQuantity: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    itemPrice: {
        fontSize: 16,
        fontWeight: '600',
    },
    orderSummary: {
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    orderTotal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: 12,
    },
    orderTotalLabel: {
        fontSize: 16,
        fontWeight: '500',
    },
    orderTotalValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#e74c3c',
    },
    orderInfo: {
        flexDirection: 'row',
        marginBottom: 8,
        alignItems: 'center',
    },
    orderInfoLabel: {
        fontSize: 14,
        fontWeight: '500',
        width: 80,
    },
    orderInfoValue: {
        fontSize: 14,
        flex: 1,
    },
    ratingStars: {
        flexDirection: 'row',
    },
    actionButtons: {
        marginTop: 8,
    },
    actionButton: {
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginBottom: 8,
    },
    primaryButton: {
        backgroundColor: '#e74c3c',
    },
    primaryButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    secondaryButton: {
        backgroundColor: '#f9f9f9',
    },
    secondaryButtonText: {
        color: '#e74c3c',
        fontWeight: '600',
        fontSize: 16,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#3498db',
    },
    outlineButtonText: {
        color: '#3498db',
        fontWeight: '600',
        fontSize: 16,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    }
});