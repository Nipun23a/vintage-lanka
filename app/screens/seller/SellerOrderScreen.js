import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Image
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

export default function SellerOrdersScreen() {
    const [activeTab, setActiveTab] = useState('Current');

    // Sample order data
    const orders = [
        {
            id: 'ORD-2025-001',
            buyerName: 'John Smith',
            buyerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: '25 Apr 2025',
            status: 'To Ship',
            items: [
                {
                    title: 'Vintage Record Player',
                    quantity: 1,
                    price: '175.00',
                    image: 'https://images.unsplash.com/photo-1656870916547-9e6a8a17f6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ],
            total: '175.00'
        },
        {
            id: 'ORD-2025-002',
            buyerName: 'Emma Wilson',
            buyerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: '24 Apr 2025',
            status: 'Processing',
            items: [
                {
                    title: 'Vintage Radio',
                    quantity: 1,
                    price: '145.00',
                    image: 'https://images.unsplash.com/photo-1630012974522-7e683def2ae5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                },
                {
                    title: 'Classic Typewriter',
                    quantity: 1,
                    price: '195.00',
                    image: 'https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ],
            total: '340.00'
        },
        {
            id: 'ORD-2025-003',
            buyerName: 'Michael Johnson',
            buyerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: '23 Apr 2025',
            status: 'Shipped',
            items: [
                {
                    title: 'Vintage Camera',
                    quantity: 1,
                    price: '125.00',
                    image: 'https://images.unsplash.com/photo-1601854266103-c1dd42130633?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ],
            total: '125.00',
            trackingNumber: 'TRK123456789'
        },
        {
            id: 'ORD-2025-004',
            buyerName: 'Sarah Davis',
            buyerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: '20 Apr 2025',
            status: 'Delivered',
            items: [
                {
                    title: 'Antique Clock',
                    quantity: 1,
                    price: '225.00',
                    image: 'https://images.unsplash.com/photo-1679973957366-2f926a250629?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ],
            total: '225.00',
            deliveredDate: '22 Apr 2025'
        },
        {
            id: 'ORD-2025-005',
            buyerName: 'Alex Brown',
            buyerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: '15 Apr 2025',
            status: 'Completed',
            items: [
                {
                    title: 'Vintage Pocket Watch',
                    quantity: 1,
                    price: '85.00',
                    image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ],
            total: '85.00',
            deliveredDate: '18 Apr 2025',
            reviewRating: 5
        },
        {
            id: 'ORD-2025-006',
            buyerName: 'Taylor Martinez',
            buyerImage: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            date: '10 Apr 2025',
            status: 'Cancelled',
            items: [
                {
                    title: 'Vintage Record Player',
                    quantity: 1,
                    price: '175.00',
                    image: 'https://images.unsplash.com/photo-1656870916547-9e6a8a17f6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }
            ],
            total: '175.00',
            cancelReason: 'Buyer requested cancellation'
        }
    ];

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
                case 'Processing':
                    return { color: '#f39c12', icon: 'hourglass-start' };
                case 'To Ship':
                    return { color: '#e74c3c', icon: 'box' };
                case 'Shipped':
                    return { color: '#3498db', icon: 'truck' };
                case 'Delivered':
                    return { color: '#2ecc71', icon: 'check-circle' };
                case 'Completed':
                    return { color: '#27ae60', icon: 'check-circle' };
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
                                    <Image source={{ uri: item.image }} style={styles.itemImage} />
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

                            {order.trackingNumber && (
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderInfoLabel}>Tracking:</Text>
                                    <Text style={styles.orderInfoValue}>{order.trackingNumber}</Text>
                                </View>
                            )}

                            {order.deliveredDate && (
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderInfoLabel}>Delivered:</Text>
                                    <Text style={styles.orderInfoValue}>{order.deliveredDate}</Text>
                                </View>
                            )}

                            {order.reviewRating && (
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderInfoLabel}>Rating:</Text>
                                    <View style={styles.ratingStars}>
                                        {[...Array(5)].map((_, i) => (
                                            <FontAwesome
                                                key={i}
                                                name="star"
                                                size={14}
                                                color={i < order.reviewRating ? '#f39c12' : '#ddd'}
                                                style={{marginRight: 2}}
                                            />
                                        ))}
                                    </View>
                                </View>
                            )}

                            {order.cancelReason && (
                                <View style={styles.orderInfo}>
                                    <Text style={styles.orderInfoLabel}>Cancel Reason:</Text>
                                    <Text style={styles.orderInfoValue}>{order.cancelReason}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.actionButtons}>
                            {order.status === 'Processing' && (
                                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                                    <Text style={styles.primaryButtonText}>Process Order</Text>
                                </TouchableOpacity>
                            )}

                            {order.status === 'To Ship' && (
                                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                                    <Text style={styles.primaryButtonText}>Mark as Shipped</Text>
                                </TouchableOpacity>
                            )}

                            {(order.status === 'Processing' || order.status === 'To Ship') && (
                                <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
                                    <Text style={styles.secondaryButtonText}>Cancel Order</Text>
                                </TouchableOpacity>
                            )}

                            {order.status === 'Shipped' && (
                                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                                    <Text style={styles.primaryButtonText}>Update Tracking</Text>
                                </TouchableOpacity>
                            )}

                            {order.status === 'Delivered' && (
                                <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
                                    <Text style={styles.primaryButtonText}>Mark as Completed</Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity style={[styles.actionButton, styles.outlineButton]}>
                                <Text style={styles.outlineButtonText}>Contact Buyer</Text>
                            </TouchableOpacity>
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <Header />
            <TabBar />

            {filteredOrders.length > 0 ? (
                <FlatList
                    data={filteredOrders}
                    renderItem={({ item }) => <OrderItem order={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.ordersList}
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