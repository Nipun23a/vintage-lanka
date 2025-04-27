import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useState } from "react";
import Header from "../../components/Header";

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

    // Sample transaction data
    const [transactions, setTransactions] = useState([
        {
            id: '1',
            title: 'Organic Vegetables Bundle',
            amount: '32.50',
            date: 'Apr 24, 2025',
            status: 'Completed',
            type: 'purchase',
            product: {
                name: 'Organic Vegetables Bundle',
                image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60',
                quantity: 1
            }
        },
        {
            id: '2',
            title: 'Farm Fresh Eggs (Dozen)',
            amount: '8.99',
            date: 'Apr 20, 2025',
            status: 'Completed',
            type: 'purchase',
            product: {
                name: 'Farm Fresh Eggs (Dozen)',
                image: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=500&auto=format&fit=crop&q=60',
                quantity: 2
            }
        },
        {
            id: '3',
            title: 'Artisanal Cheese Selection',
            amount: '24.75',
            date: 'Apr 15, 2025',
            status: 'Refunded',
            type: 'refund',
            product: {
                name: 'Artisanal Cheese Selection',
                image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&auto=format&fit=crop&q=60',
                quantity: 1
            }
        },
        {
            id: '4',
            title: 'Grass-Fed Organic Beef',
            amount: '45.00',
            date: 'Apr 10, 2025',
            status: 'Processing',
            type: 'purchase',
            product: {
                name: 'Grass-Fed Organic Beef (1kg)',
                image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=500&auto=format&fit=crop&q=60',
                quantity: 1
            }
        },
        {
            id: '5',
            title: 'Seasonal Fruit Basket',
            amount: '28.50',
            date: 'Apr 5, 2025',
            status: 'Canceled',
            type: 'canceled',
            product: {
                name: 'Seasonal Fruit Basket',
                image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&auto=format&fit=crop&q=60',
                quantity: 1
            }
        },
        {
            id: '6',
            title: 'Organic Honey Jar',
            amount: '12.99',
            date: 'Mar 28, 2025',
            status: 'Completed',
            type: 'purchase',
            product: {
                name: 'Organic Honey Jar (500ml)',
                image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=500&auto=format&fit=crop&q=60',
                quantity: 3
            }
        },
    ]);

    const handleBackPress = () => {
        navigation.goBack();
    };

    const filterTransactions = (filter) => {
        setActiveFilter(filter);
        // You would typically filter your transactions here based on the selected filter
        // This is just a placeholder for now
    };

    // Get filtered transactions based on active filter
    const getFilteredTransactions = () => {
        if (activeFilter === 'All') return transactions;

        if (activeFilter === 'Completed') {
            return transactions.filter(t => t.status === 'Completed');
        }

        if (activeFilter === 'Processing') {
            return transactions.filter(t => t.status === 'Processing');
        }

        if (activeFilter === 'Refunded') {
            return transactions.filter(t => t.type === 'refund');
        }

        if (activeFilter === 'Canceled') {
            return transactions.filter(t => t.status === 'Canceled');
        }

        return transactions;
    };

    const filteredTransactions = getFilteredTransactions();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Using the reusable Header component - with back button */}
            <Header
                title="Transaction History"
                showBackButton={true}
                onBackPress={handleBackPress}
            />

            {/* Filter Tabs */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.filterContainer}
                contentContainerStyle={styles.filterContent}
            >
                <FilterButton
                    title="All"
                    active={activeFilter === 'All'}
                    onPress={() => filterTransactions('All')}
                />
                <FilterButton
                    title="Completed"
                    active={activeFilter === 'Completed'}
                    onPress={() => filterTransactions('Completed')}
                />
                <FilterButton
                    title="Processing"
                    active={activeFilter === 'Processing'}
                    onPress={() => filterTransactions('Processing')}
                />
                <FilterButton
                    title="Refunded"
                    active={activeFilter === 'Refunded'}
                    onPress={() => filterTransactions('Refunded')}
                />
                <FilterButton
                    title="Canceled"
                    active={activeFilter === 'Canceled'}
                    onPress={() => filterTransactions('Canceled')}
                />
            </ScrollView>

            {/* Transaction List */}
            <ScrollView
                style={styles.transactionContainer}
                contentContainerStyle={styles.transactionContent}
                showsVerticalScrollIndicator={false}
            >
                {filteredTransactions.length > 0 ? (
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