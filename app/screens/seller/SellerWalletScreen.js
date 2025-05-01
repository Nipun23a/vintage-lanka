import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Header Component
const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <View style={styles.headerContent}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome name="chevron-left" size={20} color="#333" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Wallet</Text>
                <TouchableOpacity style={styles.historyButton} onPress={() => console.log('History Clicked')}>
                    <FontAwesome name="history" size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Balance Card Component
const BalanceCard = ({ totalEarnings }) => {
    const [showBalance, setShowBalance] = useState(true);
    
    return (
        <View style={styles.balanceCard}>
            <View style={styles.balanceTopRow}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <TouchableOpacity onPress={() => setShowBalance(!showBalance)}>
                    <FontAwesome name={showBalance ? "eye" : "eye-slash"} size={20} color="#fff" />
                </TouchableOpacity>
            </View>
            <Text style={styles.balanceAmount}>{showBalance ? `$${totalEarnings.toFixed(2)}` : "****"}</Text>
            <View style={styles.balanceActions}>
                <TouchableOpacity style={styles.actionButton}>
                    <FontAwesome name="plus" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Add Money</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, styles.withdrawButton]}>
                    <FontAwesome name="bank" size={18} color="#fff" />
                    <Text style={styles.actionButtonText}>Withdraw</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

// Quick Stats Component
const QuickStats = ({ totalEarnings, weeklyEarnings, pendingAmount }) => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>${totalEarnings.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>${weeklyEarnings.toFixed(2)}</Text>
                <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>${pendingAmount.toFixed(2)}</Text>
                <Text style={styles.statLabel}>Pending</Text>
            </View>
        </View>
    );
};

// Section Title Component
const SectionTitle = ({ title, action, onActionPress }) => {
    return (
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {action && (
                <TouchableOpacity onPress={onActionPress}>
                    <Text style={styles.seeAllText}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
    const getIconName = (status) => {
        switch (status) {
            case 'Paid': return 'check-circle';
            case 'Pending': return 'clock-o';
            case 'Delivered': return 'truck';
            case 'Shipped': return 'shipping-fast';
            default: return 'exchange';
        }
    };

    const getIconColor = (status) => {
        switch (status) {
            case 'Paid': return '#2ecc71';
            case 'Pending': return '#f39c12';
            case 'Delivered': return '#2ecc71';
            case 'Shipped': return '#3498db';
            default: return '#95a5a6';
        }
    };
    
    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    // Create transaction title from order items
    const getTransactionTitle = (orderItems) => {
        if (orderItems.length === 1) {
            return orderItems[0].product.title;
        } else {
            return `${orderItems[0].product.title} + ${orderItems.length - 1} more`;
        }
    };

    return (
        <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: getIconColor(transaction.paymentStatus) }]}>
                <FontAwesome name={getIconName(transaction.paymentStatus)} size={16} color="#fff" />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{getTransactionTitle(transaction.orderItems)}</Text>
                <Text style={styles.transactionDate}>{formatDate(transaction.createdAt)}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={[
                    styles.amountText,
                    { color: transaction.paymentStatus === 'Paid' ? '#2ecc71' : '#f39c12' }
                ]}>
                    ${transaction.totalAmount.toFixed(2)}
                </Text>
                <Text style={styles.transactionStatus}>{transaction.paymentStatus}</Text>
            </View>
        </View>
    );
};

// Transactions List Component
const TransactionsList = ({ transactions, loading }) => {
    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3498db" />
            </View>
        );
    }

    if (transactions.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <FontAwesome name="inbox" size={50} color="#ccc" />
                <Text style={styles.emptyText}>No transactions yet</Text>
            </View>
        );
    }

    return (
        <View style={styles.transactionsContainer}>
            <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionItem transaction={item} />}
                keyExtractor={item => item._id}
                scrollEnabled={false}
            />
        </View>
    );
};

// Monthly Earnings Chart
const MonthlyEarningsChart = ({ orders }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('6m'); // 6m, 3m, 1y
    const [chartData, setChartData] = useState([]);
    
    useEffect(() => {
        if (orders && orders.length > 0) {
            generateChartData(orders, selectedPeriod);
        }
    }, [orders, selectedPeriod]);

    const generateChartData = (orders, period) => {
        // Current date and calculate the start date based on selected period
        const currentDate = new Date();
        let startDate = new Date();
        
        switch (period) {
            case '3m':
                startDate.setMonth(currentDate.getMonth() - 3);
                break;
            case '1y':
                startDate.setFullYear(currentDate.getFullYear() - 1);
                break;
            default: // 6m is default
                startDate.setMonth(currentDate.getMonth() - 6);
        }
        
        // Initialize monthly data
        const monthlyData = {};
        let currentMonth = new Date(startDate);
        
        // Create object with all months in the range initialized at 0
        while (currentMonth <= currentDate) {
            const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
            monthlyData[monthKey] = {
                month: new Date(currentMonth).toLocaleDateString('en-US', { month: 'short' }),
                earnings: 0,
                year: currentMonth.getFullYear()
            };
            currentMonth.setMonth(currentMonth.getMonth() + 1);
        }
        
        // Aggregate order amounts by month
        orders.forEach(order => {
            if (order.paymentStatus === 'Paid') {
                const orderDate = new Date(order.createdAt);
                if (orderDate >= startDate) {
                    const monthKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, '0')}`;
                    if (monthlyData[monthKey]) {
                        monthlyData[monthKey].earnings += order.totalAmount;
                    }
                }
            }
        });
        
        // Convert to array and sort by date
        const dataArray = Object.values(monthlyData)
            .map((item, index) => ({
                ...item,
                id: index, // Add id for key prop in list
                label: `${item.month}${period === '1y' ? '\n' + item.year : ''}` // Add year if showing annual data
            }))
            .sort((a, b) => new Date(a.year, a.month) - new Date(b.year, b.month));
        
        setChartData(dataArray);
    };

    // Change period handler
    const handlePeriodChange = (newPeriod) => {
        setSelectedPeriod(newPeriod);
    };

    // Find max value for scaling
    const maxEarning = Math.max(...chartData.map(d => d.earnings), 100); // minimum 100 to avoid division by zero

    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Monthly Earnings</Text>
                <View style={styles.periodSelector}>
                    <TouchableOpacity 
                        style={[styles.periodButton, selectedPeriod === '3m' && styles.periodButtonActive]}
                        onPress={() => handlePeriodChange('3m')}
                    >
                        <Text style={[styles.periodButtonText, selectedPeriod === '3m' && styles.periodButtonTextActive]}>3M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.periodButton, selectedPeriod === '6m' && styles.periodButtonActive]}
                        onPress={() => handlePeriodChange('6m')}
                    >
                        <Text style={[styles.periodButtonText, selectedPeriod === '6m' && styles.periodButtonTextActive]}>6M</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.periodButton, selectedPeriod === '1y' && styles.periodButtonActive]}
                        onPress={() => handlePeriodChange('1y')}
                    >
                        <Text style={[styles.periodButtonText, selectedPeriod === '1y' && styles.periodButtonTextActive]}>1Y</Text>
                    </TouchableOpacity>
                </View>
            </View>
            
            {chartData.length > 0 ? (
                <View style={styles.chartContent}>
                    <View style={styles.yAxis}>
                        <Text style={styles.axisLabel}>${maxEarning.toFixed(0)}</Text>
                        <Text style={styles.axisLabel}>${(maxEarning/2).toFixed(0)}</Text>
                        <Text style={styles.axisLabel}>$0</Text>
                    </View>
                    <View style={styles.chartBars}>
                        {chartData.map((data) => (
                            <View key={data.id} style={styles.barContainer}>
                                <View style={styles.barLabelContainer}>
                                    <Text style={styles.barLabel}>{data.label}</Text>
                                </View>
                                <View style={styles.barWrapper}>
                                    <View 
                                        style={[
                                            styles.bar, 
                                            { 
                                                height: `${Math.max((data.earnings / maxEarning) * 100, 3)}%`,
                                                backgroundColor: data.earnings > 0 ? '#3498db' : '#e0e0e0' 
                                            }
                                        ]} 
                                    />
                                </View>
                                <Text style={styles.barValue}>
                                    ${data.earnings > 0 ? data.earnings.toFixed(0) : '0'}
                                </Text>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <View style={styles.chartPlaceholder}>
                    <Text style={styles.chartPlaceholderText}>No earnings data available</Text>
                </View>
            )}
        </View>
    );
};

export default function SellerWalletScreen() {
    const [userData, setUserData] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const [totalEarnings, setTotalEarnings] = useState(0);
    const [weeklyEarnings, setWeeklyEarnings] = useState(0);
    const [pendingAmount, setPendingAmount] = useState(0);

    // Fetch user data from AsyncStorage
    useEffect(() => {
        const getUserData = async () => {
            try {
                const userDataString = await AsyncStorage.getItem('userData');
                if (userDataString) {
                    const parsedUserData = JSON.parse(userDataString);
                    setUserData(parsedUserData);
                    fetchOrders(parsedUserData.userId);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                Alert.alert('Error', 'Failed to load user data');
            }
        };

        getUserData();
    }, []);

    // Fetch orders from API
    const fetchOrders = async (sellerId) => {
        setLoading(true);
        try {
            const response = await fetch(`https://vintage-lanka-backend-f1fa6938e3e3.herokuapp.com/api/orders/${sellerId}/seller`);
            const data = await response.json();
            
            if (data && data.orders) {
                setOrders(data.orders);
                calculateStats(data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            Alert.alert('Error', 'Failed to load order data');
        } finally {
            setLoading(false);
        }
    };

    // Calculate financial stats
    const calculateStats = (orders) => {
        let total = 0;
        let pending = 0;
        let weekly = 0;
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        orders.forEach(order => {
            // Calculate total amount for all orders
            total += order.totalAmount;
            
            // Calculate pending amount
            if (order.paymentStatus === 'Pending') {
                pending += order.totalAmount;
            }
            
            // Calculate weekly earnings
            const orderDate = new Date(order.createdAt);
            if (orderDate >= oneWeekAgo && order.paymentStatus === 'Paid') {
                weekly += order.totalAmount;
            }
        });
        
        setTotalEarnings(total);
        setPendingAmount(pending);
        setWeeklyEarnings(weekly);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark-content" backgroundColor="#fff" />
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                <BalanceCard totalEarnings={totalEarnings} />
                <QuickStats 
                    totalEarnings={totalEarnings} 
                    weeklyEarnings={weeklyEarnings} 
                    pendingAmount={pendingAmount} 
                />
                <MonthlyEarningsChart orders={orders} />

                <SectionTitle 
                    title="Recent Transactions" 
                    action="See All" 
                    onActionPress={() => console.log('View all transactions')} 
                />
                <TransactionsList transactions={orders} loading={loading} />

                <View style={styles.footer} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 20,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontFamily: 'Montserrat_Bold',
    },
    historyButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceCard: {
        margin: 16,
        padding: 20,
        borderRadius: 16,
        backgroundColor: '#3498db',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    balanceTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    balanceLabel: {
        color: '#fff',
        fontSize: 16,
        fontFamily: 'Montserrat_Medium',
        opacity: 0.9,
    },
    balanceAmount: {
        color: '#fff',
        fontSize: 36,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 20,
    },
    balanceActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginRight: 8,
    },
    withdrawButton: {
        marginRight: 0,
        marginLeft: 8,
    },
    actionButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 14,
        marginHorizontal: 4,
        elevation: 1,
    },
    statNumber: {
        fontSize: 20,
        fontFamily: 'Montserrat_Bold',
        marginBottom: 4,
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        fontFamily: 'Montserrat_Regular',
        color: '#666',
    },
    sectionTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
        marginTop: 8,
    },
    sectionTitle: {
        fontSize: 18,
        color: '#333',
        fontFamily: 'Montserrat_Bold',
    },
    seeAllText: {
        fontSize: 14,
        color: '#3498db',
        fontFamily: 'Montserrat_Medium',
    },
    transactionsContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    transactionIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3498db',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
        color: '#333',
    },
    transactionDate: {
        fontSize: 12,
        fontFamily: 'Montserrat_Regular',
        color: '#999',
        marginTop: 2,
    },
    transactionAmount: {
        alignItems: 'flex-end',
    },
    amountText: {
        fontSize: 14,
        fontFamily: 'Montserrat_Bold',
    },
    transactionStatus: {
        fontSize: 12,
        color: '#999',
        fontFamily: 'Montserrat_Regular',
    },
    chartContainer: {
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontFamily: 'Montserrat_Bold',
    },
    chartPeriod: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    chartPeriodText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat_Regular',
    },
    periodSelector: {
        flexDirection: 'row',
        backgroundColor: '#f5f5f5',
        borderRadius: 6,
        padding: 2,
    },
    periodButton: {
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 4,
    },
    periodButtonActive: {
        backgroundColor: '#3498db',
    },
    periodButtonText: {
        fontSize: 12,
        color: '#666',
        fontFamily: 'Montserrat_Medium',
    },
    periodButtonTextActive: {
        color: '#fff',
    },
    chartContent: {
        height: 220,
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    yAxis: {
        width: 35,
        height: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingBottom: 25,
    },
    axisLabel: {
        fontSize: 10,
        color: '#999',
        marginRight: 5,
        fontFamily: 'Montserrat_Regular',
    },
    chartBars: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        height: '100%',
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
        paddingLeft: 5,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        height: '100%',
        justifyContent: 'flex-end',
        paddingBottom: 25,
        maxWidth: 60,
    },
    barWrapper: {
        width: '60%',
        height: '70%',
        justifyContent: 'flex-end',
    },
    bar: {
        width: '100%',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
    barLabelContainer: {
        position: 'absolute',
        bottom: 5,
        alignItems: 'center',
    },
    barLabel: {
        fontSize: 9,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Montserrat_Regular',
    },
    barValue: {
        fontSize: 9,
        color: '#666',
        position: 'absolute',
        top: '28%',
        textAlign: 'center',
        fontFamily: 'Montserrat_Regular',
    },
    chartPlaceholder: {
        height: 180,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chartPlaceholderText: {
        color: '#999',
        fontFamily: 'Montserrat_Regular',
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 30,
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
    },
    footer: {
        height: 20,
    },
});