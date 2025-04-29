import { StatusBar } from 'expo-status-bar';
import {SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Alert} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import {useEffect, useState} from "react";
import Header from "../../components/Header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
    // Determine icon and color based on transaction type
    const getIconAndColor = (type) => {
        switch (type) {
            case 'purchase':
                return { icon: 'shopping-bag', color: '#3498db' };
            case 'refund':
                return { icon: 'undo', color: '#2ecc71' };
            case 'canceled':
                return { icon: 'times-circle', color: '#e74c3c' };
            default:
                return { icon: 'circle', color: '#95a5a6' };
        }
    };

    const { icon, color } = getIconAndColor(transaction.type);

    return (
        <View style={styles.transactionItem}>
            <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
                <FontAwesome name={icon} size={20} color={color} />
            </View>

            <View style={styles.transactionInfo}>
                <View style={styles.transactionHeader}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text
                        style={[
                            styles.transactionAmount,
                            { color: transaction.type === 'refund' ? '#2ecc71' : '#333' }
                        ]}
                    >
                        {transaction.type === 'refund' ? '+' : ''}${transaction.amount}
                    </Text>
                </View>

                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionDate}>{transaction.date}</Text>
                    <Text
                        style={[
                            styles.transactionStatus,
                            { color:
                                    transaction.status === 'Completed' ? '#2ecc71' :
                                        transaction.status === 'Processing' ? '#f39c12' :
                                            transaction.status === 'Canceled' ? '#e74c3c' : '#666'
                            }
                        ]}
                    >
                        {transaction.status}
                    </Text>
                </View>

                {transaction.product && (
                    <View style={styles.productContainer}>
                        <Image source={{ uri: transaction.product.image }} style={styles.productImage} />
                        <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>{transaction.product.name}</Text>
                            <Text style={styles.productQuantity}>Qty: {transaction.product.quantity}</Text>
                        </View>
                    </View>
                )}
            </View>
        </View>
    );
};

// Filter Button Component
const FilterButton = ({ title, active, onPress }) => (
    <TouchableOpacity
        style={[styles.filterButton, active && styles.filterButtonActive]}
        onPress={onPress}
    >
        <Text style={[styles.filterButtonText, active && styles.filterButtonTextActive]}>
            {title}
        </Text>
    </TouchableOpacity>
);

export default function TransactionHistoryScreen({ navigation }) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Transform order data into transaction format
    const transformOrdersToTransactions = (orders) => {
        return orders.flatMap(order => {
            // Create a transaction for each order item
            return order.orderItems.map(item => {
                const product = item.product;
                
                // Format the date
                const orderDate = new Date(order.createdAt);
                const formattedDate = `${orderDate.toLocaleDateString()} at ${orderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                
                // Determine transaction type based on order status
                let type = 'purchase';
                if (order.orderStatus === 'Cancelled') {
                    type = 'canceled';
                } else if (order.orderStatus === 'Refunded') {
                    type = 'refund';
                }
                
                // Create transaction object
                return {
                    id: order._id + '-' + product._id,
                    title: product.title,
                    amount: item.price,
                    date: formattedDate,
                    status: order.orderStatus,
                    type: type,
                    product: {
                        name: product.title,
                        image: product.mainImage,
                        quantity: item.quantity
                    }
                };
            });
        });
    };

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                setLoading(true);
                const userData = await AsyncStorage.getItem('userData');
                if (!userData){
                    Alert.alert('Error','User Data is not found. Please log in again');
                    return;
                }
                const parsedUserData = JSON.parse(userData);
                const userId = parsedUserData.userId;

                const response = await axios.get(`http://192.168.8.151:5000/api/orders/${userId}/transactions`);
                
                // Transform order data into transaction format
                const transformedTransactions = transformOrdersToTransactions(response.data);
                setTransactions(transformedTransactions);
            } catch (error) {
                console.log('Failed to fetch transaction:', error);
                Alert.alert('Error', 'Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };
        
        fetchTransactions();
    }, []);

    // Filter transactions based on activeFilter
    const filteredTransactions = transactions.filter(transaction => {
        if (activeFilter === 'All') return true;
        if (activeFilter === 'Purchases' && transaction.type === 'purchase') return true;
        if (activeFilter === 'Refunds' && transaction.type === 'refund') return true;
        if (activeFilter === 'Canceled' && transaction.type === 'canceled') return true;
        return false;
    });

    const handleBackPress = () => {
        navigation.goBack();
    };
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Using the reusable Header component - with back button */}
            <Header
                title="Transaction History"
                showBackButton={true}
                onBackPress={handleBackPress}
            />

            {/* Filter buttons */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                <FilterButton 
                    title="All" 
                    active={activeFilter === 'All'} 
                    onPress={() => setActiveFilter('All')} 
                />
                <FilterButton 
                    title="Purchases" 
                    active={activeFilter === 'Purchases'} 
                    onPress={() => setActiveFilter('Purchases')} 
                />
                <FilterButton 
                    title="Refunds" 
                    active={activeFilter === 'Refunds'} 
                    onPress={() => setActiveFilter('Refunds')} 
                />
                <FilterButton 
                    title="Canceled" 
                    active={activeFilter === 'Canceled'} 
                    onPress={() => setActiveFilter('Canceled')} 
                />
            </ScrollView>

            {/* Transaction List */}
            <ScrollView
                style={styles.transactionContainer}
                contentContainerStyle={styles.transactionContent}
                showsVerticalScrollIndicator={false}
            >
                {loading ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Loading transactions...</Text>
                    </View>
                ) : filteredTransactions.length > 0 ? (
                    filteredTransactions.map(transaction => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                    ))
                ) : (
                    <View style={styles.emptyContainer}>
                        <FontAwesome name="history" size={60} color="#ddd" />
                        <Text style={styles.emptyText}>No transactions found</Text>
                        <Text style={styles.emptySubtext}>
                            Transactions matching your filter will appear here
                        </Text>
                    </View>
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
    filterContainer: {
        maxHeight: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filterContent: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        alignItems: 'center',
        flexDirection: 'row',
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f5f5f5',
    },
    filterButtonActive: {
        backgroundColor: '#3498db',
    },
    filterButtonText: {
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
    },
    filterButtonTextActive: {
        color: '#fff',
        fontFamily: 'Montserrat_SemiBold',
    },
    transactionContainer: {
        flex: 1,
    },
    transactionContent: {
        padding: 16,
    },
    transactionItem: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    transactionInfo: {
        flex: 1,
    },
    transactionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 4,
    },
    transactionTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_SemiBold',
        flex: 1,
        marginRight: 8,
    },
    transactionAmount: {
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    transactionDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    transactionDate: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    transactionStatus: {
        fontSize: 14,
        fontFamily: 'Montserrat_SemiBold',
    },
    productContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    productImage: {
        width: 40,
        height: 40,
        borderRadius: 6,
        marginRight: 10,
    },
    productInfo: {
        flex: 1,
    },
    productName: {
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
    },
    productQuantity: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontFamily: 'Montserrat_SemiBold',
        marginTop: 16,
        color: '#666',
    },
    emptySubtext: {
        fontSize: 14,
        fontFamily: 'Montserrat_Regular',
        color: '#999',
        marginTop: 8,
        textAlign: 'center',
    },
    footer: {
        height: 20,
    },
});