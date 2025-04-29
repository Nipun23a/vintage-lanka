import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Auth Screens
import UserTypeScreen from "../screens/auth/UserTypeScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";
import StartScreen from "../screens/StartScreen";

// Buyer Screens
import BuyerHomeScreen from "../screens/buyer/BuyerHomeScreen";
import BuyerSearchScreen from "../screens/buyer/BuyerSearchScreen";
import BuyerProfileScreen from "../screens/buyer/BuyerProfileScreen";
import BuyerFavoritesScreen from "../screens/buyer/BuyerFavoritesScreen";
import ProductDetailScreen from "../screens/buyer/ProductDetailScreen";
import CartScreen from "../screens/buyer/CartScreen";
import CheckoutScreen from "../screens/buyer/CheckoutScreen";
import OrderHistoryScreen from "../screens/buyer/OrderHistoryScreen";
import TransactionHistoryScreen from "../screens/buyer/TransactionHistoryScreen";

// Seller Screens
import SellerHomeScreen from "../screens/seller/SellerHomeScreen";
import SellerProductsScreen from "../screens/seller/SellerProductsScreen";
import SellerOrdersScreen from "../screens/seller/SellerOrderScreen";
import SellerWalletScreen from "../screens/seller/SellerWalletScreen";
import SellerReceivePaymentScreen from "../screens/seller/SellerReceivePaymentScreen";
import SellerPaymentsScreen from "../screens/seller/SellerPaymentsScreen";
import SellerAddProductScreen from "../screens/seller/SellerAddProductScreen";
import SellerProfileScreen from "../screens/seller/SellerProfileScreen";

// Create the navigation stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = ({ onLogin }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="UserType" component={UserTypeScreen} />
            <Stack.Screen name="Login">
                {props => <LoginScreen {...props} onLogin={onLogin} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};

// Buyer Tab Navigator
const BuyerTabNavigator = ({ onLogout }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Home') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Search') {
                        iconName = focused ? 'search' : 'search-outline';
                    } else if (route.name === 'Favorites') {
                        iconName = focused ? 'heart' : 'heart-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5a3921',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Home" component={BuyerHomeScreen} />
            <Tab.Screen name="Search" component={BuyerSearchScreen} />
            <Tab.Screen name="Favorites" component={BuyerFavoritesScreen} />
            <Tab.Screen name="Profile">
                {props => <BuyerProfileScreen {...props} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

// Buyer Main Navigator (includes the tab navigator and other screens)
const BuyerNavigator = ({ onLogout }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="BuyerTabs">
                {props => <BuyerTabNavigator {...props} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen name="ProductDetails" component={ProductDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        </Stack.Navigator>
    );
};

// Seller Tab Navigator
const SellerTabNavigator = ({ onLogout }) => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Products') {
                        iconName = focused ? 'list' : 'list-outline';
                    } else if (route.name === 'Orders') {
                        iconName = focused ? 'basket' : 'basket-outline';
                    } else if (route.name === 'Wallet') {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#5a3921',
                tabBarInactiveTintColor: 'gray',
            })}
        >
            <Tab.Screen name="Dashboard" component={SellerHomeScreen} />
            <Tab.Screen name="Products" component={SellerProductsScreen} />
            <Tab.Screen name="Orders" component={SellerOrdersScreen} />
            <Tab.Screen name="Wallet" component={SellerWalletScreen} />
            <Tab.Screen name="Profile">
                {props => <SellerProfileScreen {...props} onLogout={onLogout} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

// Seller Main Navigator (includes the tab navigator and other screens)
const SellerNavigator = ({ onLogout }) => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="SellerTabs">
                {props => <SellerTabNavigator {...props} onLogout={onLogout} />}
            </Stack.Screen>
            <Stack.Screen name="AddProduct" component={SellerAddProductScreen} />
            <Stack.Screen name="Payments" component={SellerPaymentsScreen} />
            <Stack.Screen name="ReceivePayment" component={SellerReceivePaymentScreen} />
        </Stack.Navigator>
    );
};

// Main App Navigator with authentication state
const AppNavigator = () => {
    // Use state to manage authentication
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userType: null, // 'buyer' or 'seller'
        isLoading: true // Add loading state for initial AsyncStorage check
    });

    // Check for existing login credentials on app start
    useEffect(() => {
        const checkLoginState = async () => {
            try {
                const userRole = await AsyncStorage.getItem('userRole');
                const userId = await AsyncStorage.getItem('userId');

                if (userId && userRole) {
                    setAuthState({
                        isLoggedIn: true,
                        userType: userRole,
                        isLoading: false
                    });
                } else {
                    setAuthState({
                        isLoggedIn: false,
                        userType: null,
                        isLoading: false
                    });
                }
            } catch (error) {
                console.log('Error checking login state:', error);
                setAuthState({
                    isLoggedIn: false,
                    userType: null,
                    isLoading: false
                });
            }
        };

        checkLoginState();
    }, []);

    // Login function
    const login = (userType) => {
        setAuthState({
            isLoggedIn: true,
            userType: userType,
            isLoading: false
        });
    };

    // Logout function
    const logout = async () => {
        try {
            // Clear all authentication-related data from AsyncStorage
            await AsyncStorage.multiRemove([
                'userId',
                'userRole',
                'userFullName',
                'userEmail',
                'userPhoneNumber',
                'userAddresses',
                'userCart'
            ]);

            // Reset the authentication state
            setAuthState({
                isLoggedIn: false,
                userType: null,
                isLoading: false
            });

        } catch (error) {
            console.log('Logout Failed', error);
            // Handle error if needed
        }
    };

    // Show loading screen if still checking authentication state
    if (authState.isLoading) {
        // You could return a loading component here
        return null;
    }

    return (
        <NavigationContainer>
            {!authState.isLoggedIn ? (
                <AuthNavigator onLogin={login} />
            ) : authState.userType === 'seller' ? (
                <SellerNavigator onLogout={logout} />
            ) : (
                <BuyerNavigator onLogout={logout} />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;