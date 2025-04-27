import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Image,
    Modal,
    TextInput,
    FlatList
} from 'react-native';
import { FontAwesome } from "@expo/vector-icons";

export default function SellerProductsScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [filterActive, setFilterActive] = useState('All');

    // Sample product data
    const products = [
        {
            id: '1',
            title: 'Vintage Record Player',
            price: '175.00',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1656870916547-9e6a8a17f6e7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            views: 45,
            likes: 12,
            date: '15 Apr 2025'
        },
        {
            id: '2',
            title: 'Antique Wooden Clock',
            price: '225.00',
            status: 'Sold',
            image: 'https://images.unsplash.com/photo-1679973957366-2f926a250629?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            views: 89,
            likes: 23,
            date: '10 Apr 2025'
        },
        {
            id: '3',
            title: 'Vintage Camera',
            price: '125.00',
            status: 'Draft',
            image: 'https://images.unsplash.com/photo-1601854266103-c1dd42130633?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            views: 0,
            likes: 0,
            date: '18 Apr 2025'
        },
        {
            id: '4',
            title: 'Vintage Radio',
            price: '145.00',
            status: 'Active',
            image: 'https://images.unsplash.com/photo-1630012974522-7e683def2ae5?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            views: 28,
            likes: 7,
            date: '20 Apr 2025'
        },
        {
            id: '5',
            title: 'Classic Typewriter',
            price: '195.00',
            status: 'Active',
            image: 'https://images.unsplash.com/reserve/LJIZlzHgQ7WPSh5KVTCB_Typewriter.jpg?q=80&w=1992&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            views: 34,
            likes: 9,
            date: '12 Apr 2025'
        },
        {
            id: '6',
            title: 'Vintage Pocket Watch',
            price: '85.00',
            status: 'Sold',
            image: 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            views: 56,
            likes: 15,
            date: '5 Apr 2025'
        },
    ];

    // Filter products based on active filter
    const filteredProducts = filterActive === 'All'
        ? products
        : products.filter(product => product.status === filterActive);

    // Header Component
    const Header = () => (
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Listings</Text>
            <View style={styles.headerActions}>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="search" size={20} color="#333" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <FontAwesome name="sort-amount-desc" size={20} color="#333" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Filter Component
    const FilterTabs = () => {
        const filters = ['All', 'Active', 'Sold', 'Draft'];

        return (
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {filters.map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.filterTab,
                                filterActive === filter && styles.filterTabActive
                            ]}
                            onPress={() => setFilterActive(filter)}
                        >
                            <Text style={[
                                styles.filterText,
                                filterActive === filter && styles.filterTextActive
                            ]}>
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        );
    };

    // Product Item Component
    const ProductItem = ({ item }) => {
        const getStatusColor = (status) => {
            switch(status) {
                case 'Active': return '#2ecc71';
                case 'Sold': return '#3498db';
                case 'Draft': return '#95a5a6';
                default: return '#95a5a6';
            }
        };

        return (
            <TouchableOpacity style={styles.productCard}>
                <View style={styles.productImageContainer}>
                    <Image source={{ uri: item.image }} style={styles.productImage} />
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                        <Text style={styles.statusText}>{item.status}</Text>
                    </View>
                </View>
                <View style={styles.productInfo}>
                    <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.productPrice}>${item.price}</Text>

                    <View style={styles.productMetaContainer}>
                        <View style={styles.productMeta}>
                            <FontAwesome name="eye" size={14} color="#666" />
                            <Text style={styles.metaText}>{item.views}</Text>
                        </View>
                        <View style={styles.productMeta}>
                            <FontAwesome name="heart" size={14} color="#666" />
                            <Text style={styles.metaText}>{item.likes}</Text>
                        </View>
                        <Text style={styles.dateText}>{item.date}</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <FontAwesome name="ellipsis-v" size={18} color="#333" />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    // Add Product Modal
    const AddProductModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Add New Listing</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <FontAwesome name="times" size={24} color="#333" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView>
                        <TouchableOpacity style={styles.imageUpload}>
                            <FontAwesome name="camera" size={30} color="#999" />
                            <Text style={styles.uploadText}>Add Photos</Text>
                        </TouchableOpacity>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Title</Text>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Enter product title"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={[styles.textInput, {height: 100}]}
                                placeholder="Describe your item"
                                multiline={true}
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, {flex: 1, marginRight: 10}]}>
                                <Text style={styles.inputLabel}>Price ($)</Text>
                                <TextInput
                                    style={styles.textInput}
                                    placeholder="0.00"
                                    keyboardType="decimal-pad"
                                />
                            </View>

                            <View style={[styles.inputGroup, {flex: 1}]}>
                                <Text style={styles.inputLabel}>Category</Text>
                                <TouchableOpacity style={styles.selectInput}>
                                    <Text style={styles.selectText}>Select</Text>
                                    <FontAwesome name="chevron-down" size={14} color="#666" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Condition</Text>
                            <View style={styles.conditionOptions}>
                                {['New', 'Like New', 'Good', 'Fair', 'Poor'].map((condition) => (
                                    <TouchableOpacity
                                        key={condition}
                                        style={styles.conditionOption}
                                    >
                                        <Text style={styles.conditionText}>{condition}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.draftButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.draftButtonText}>Save as Draft</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.publishButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.publishButtonText}>Publish</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );

    // Floating Action Button
    const FloatingActionButton = () => (
        <TouchableOpacity
            style={styles.fab}
            onPress={() => setModalVisible(true)}
        >
            <FontAwesome name="plus" size={24} color="#fff" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <Header />
            <FilterTabs />

            {filteredProducts.length > 0 ? (
                <FlatList
                    data={filteredProducts}
                    renderItem={({ item }) => <ProductItem item={item} />}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.productList}
                />
            ) : (
                <View style={styles.emptyState}>
                    <FontAwesome name="inbox" size={50} color="#ddd" />
                    <Text style={styles.emptyText}>No {filterActive !== 'All' ? filterActive : ''} listings found</Text>
                </View>
            )}

            <FloatingActionButton />
            <AddProductModal />
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
        paddingVertical: 16,
        marginTop:10,
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
    filterContainer: {
        paddingHorizontal: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    filterTab: {
        paddingHorizontal: 18,
        paddingVertical: 8,
        marginHorizontal: 4,
        borderRadius: 20,
        backgroundColor: '#f5f5f5',
    },
    filterTabActive: {
        backgroundColor: '#000',
    },
    filterText: {
        fontSize: 14,
        color: '#333',
    },
    filterTextActive: {
        color: '#fff',
    },
    productList: {
        padding: 12,
    },
    productCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    productImageContainer: {
        width: 100,
        height: 100,
        position: 'relative',
    },
    productImage: {
        width: '100%',
        height: '100%',
    },
    statusBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    statusText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productInfo: {
        flex: 1,
        padding: 12,
    },
    productTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginBottom: 8,
    },
    productMetaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 16,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#999',
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginRight: 4,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
    fab: {
        position: 'absolute',
        bottom: 24,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#e74c3c',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 16,
        paddingBottom: 30,
        maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    imageUpload: {
        height: 180,
        backgroundColor: '#f9f9f9',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 16,
    },
    uploadText: {
        marginTop: 8,
        fontSize: 16,
        color: '#999',
    },
    inputGroup: {
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    textInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    selectInput: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectText: {
        fontSize: 16,
        color: '#999',
    },
    conditionOptions: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    conditionOption: {
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        marginBottom: 8,
    },
    conditionText: {
        fontSize: 14,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 16,
        marginBottom: 30,
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    draftButton: {
        backgroundColor: '#f5f5f5',
        marginRight: 8,
    },
    publishButton: {
        backgroundColor: '#e74c3c',
        marginLeft: 8,
    },
    draftButtonText: {
        fontSize: 16,
        fontWeight: '500',
    },
    publishButtonText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
});