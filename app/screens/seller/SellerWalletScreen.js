import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, FlatList, Image } from 'react-native';
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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
const BalanceCard = () => {
    return (
        <View style={styles.balanceCard}>
            <View style={styles.balanceTopRow}>
                <Text style={styles.balanceLabel}>Available Balance</Text>
                <FontAwesome name="eye" size={20} color="#fff" />
            </View>
            <Text style={styles.balanceAmount}>$1,245.85</Text>
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
const QuickStats = () => {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>$3,782</Text>
                <Text style={styles.statLabel}>Total Earnings</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>$725</Text>
                <Text style={styles.statLabel}>This Week</Text>
            </View>
            <View style={styles.statCard}>
                <Text style={styles.statNumber}>$245</Text>
                <Text style={styles.statLabel}>Pending</Text>
            </View>
        </View>
    );
};

// Section Title Component
const SectionTitle = ({ title, action }) => {
    return (
        <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {action && (
                <TouchableOpacity>
                    <Text style={styles.seeAllText}>{action}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

// Transaction Item Component
const TransactionItem = ({ transaction }) => {
    const getIconName = (type) => {
        switch (type) {
            case 'sale': return 'shopping-cart';
            case 'withdrawal': return 'bank';
            case 'refund': return 'reply';
            case 'fee': return 'percent';
            default: return 'exchange';
        }
    };

    const getIconColor = (type) => {
        switch (type) {
            case 'sale': return '#2ecc71';
            case 'withdrawal': return '#3498db';
            case 'refund': return '#e74c3c';
            case 'fee': return '#f39c12';
            default: return '#95a5a6';
        }
    };

    return (
        <View style={styles.transactionItem}>
            <View style={[styles.transactionIcon, { backgroundColor: getIconColor(transaction.type) }]}>
                <FontAwesome name={getIconName(transaction.type)} size={16} color="#fff" />
            </View>
            <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
            </View>
            <View style={styles.transactionAmount}>
                <Text style={[
                    styles.amountText,
                    { color: transaction.amount.startsWith('+') ? '#2ecc71' : '#e74c3c' }
                ]}>
                    {transaction.amount}
                </Text>
                <Text style={styles.transactionStatus}>{transaction.status}</Text>
            </View>
        </View>
    );
};

// Transactions List Component
const TransactionsList = () => {
    const transactions = [
        { id: '1', type: 'sale', title: 'Vintage Radio', date: 'Apr 25, 2025', amount: '+$145.00', status: 'Completed' },
        { id: '2', type: 'withdrawal', title: 'Bank Transfer', date: 'Apr 21, 2025', amount: '-$500.00', status: 'Completed' },
        { id: '3', type: 'fee', title: 'Platform Fee', date: 'Apr 20, 2025', amount: '-$14.50', status: 'Completed' },
        { id: '4', type: 'sale', title: 'Antique Clock', date: 'Apr 15, 2025', amount: '+$225.00', status: 'Completed' },
        { id: '5', type: 'refund', title: 'Vintage Camera Return', date: 'Apr 10, 2025', amount: '-$125.00', status: 'Completed' },
    ];

    return (
        <View style={styles.transactionsContainer}>
            <FlatList
                data={transactions}
                renderItem={({ item }) => <TransactionItem transaction={item} />}
                keyExtractor={item => item.id}
                scrollEnabled={false}
            />
        </View>
    );
};

// Payment Methods Component
const PaymentMethods = () => {
    const methods = [
        { id: '1', type: 'bank', title: 'Bank Account', subtitle: '****4567', isDefault: true },
        { id: '2', type: 'card', title: 'Visa Card', subtitle: '****1234', isDefault: false },
    ];

    const renderPaymentMethod = (method) => (
        <TouchableOpacity key={method.id} style={styles.paymentMethodItem}>
            <View style={styles.paymentMethodIcon}>
                <FontAwesome
                    name={method.type === 'bank' ? 'bank' : 'credit-card'}
                    size={20}
                    color="#3498db"
                />
            </View>
            <View style={styles.paymentMethodDetails}>
                <Text style={styles.paymentMethodTitle}>{method.title}</Text>
                <Text style={styles.paymentMethodSubtitle}>{method.subtitle}</Text>
            </View>
            {method.isDefault && (
                <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                </View>
            )}
            <FontAwesome name="angle-right" size={20} color="#999" />
        </TouchableOpacity>
    );

    return (
        <View style={styles.paymentMethodsContainer}>
            {methods.map(renderPaymentMethod)}
            <TouchableOpacity style={styles.addPaymentMethodButton}>
                <FontAwesome name="plus" size={16} color="#3498db" />
                <Text style={styles.addPaymentMethodText}>Add Payment Method</Text>
            </TouchableOpacity>
        </View>
    );
};

// Monthly Earnings Chart Placeholder
const MonthlyEarningsChart = () => {
    return (
        <View style={styles.chartContainer}>
            <View style={styles.chartHeader}>
                <Text style={styles.chartTitle}>Monthly Earnings</Text>
                <View style={styles.chartPeriod}>
                    <Text style={styles.chartPeriodText}>Last 6 months</Text>
                    <FontAwesome name="chevron-down" size={14} color="#666" style={{marginLeft: 5}} />
                </View>
            </View>
            <View style={styles.chartPlaceholder}>
                <Text style={styles.chartPlaceholderText}>Earnings chart will appear here</Text>
                {/* You would replace this with an actual chart library component */}
            </View>
        </View>
    );
};

export default function SellerWalletScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark-content" backgroundColor="#fff" />
            <Header />
            <ScrollView showsVerticalScrollIndicator={false}>
                <BalanceCard />
                <QuickStats />
                <MonthlyEarningsChart />

                <SectionTitle title="Recent Transactions" action="See All" />
                <TransactionsList />

                <SectionTitle title="Payment Methods" />
                <PaymentMethods />

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
    paymentMethodsContainer: {
        paddingHorizontal: 16,
        marginBottom: 24,
    },
    paymentMethodItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    paymentMethodIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    paymentMethodDetails: {
        flex: 1,
    },
    paymentMethodTitle: {
        fontSize: 14,
        fontFamily: 'Montserrat_Medium',
        color: '#333',
    },
    paymentMethodSubtitle: {
        fontSize: 12,
        fontFamily: 'Montserrat_Regular',
        color: '#999',
    },
    defaultBadge: {
        backgroundColor: '#e8f4fd',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
        marginRight: 12,
    },
    defaultText: {
        color: '#3498db',
        fontSize: 10,
        fontFamily: 'Montserrat_Bold',
    },
    addPaymentMethodButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        borderStyle: 'dashed',
    },
    addPaymentMethodText: {
        marginLeft: 8,
        color: '#3498db',
        fontFamily: 'Montserrat_Medium',
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
    footer: {
        height: 20,
    },
});