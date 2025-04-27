import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

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

// Seller Screens
import SellerHomeScreen from "../screens/seller/SellerHomeScreen";
import SellerProductsScreen from "../screens/seller/SellerProductsScreen";
import SellerOrdersScreen from "../screens/seller/SellerOrderScreen";
import SellerWalletScreen from "../screens/seller/SellerWalletScreen";
import SellerReceivePaymentScreen from "../screens/seller/SellerReceivePaymentScreen";
import SellerPaymentsScreen from "../screens/seller/SellerPaymentsScreen";
import SellerAddProductScreen from "../screens/seller/SellerAddProductScreen";
import SellerProfileScreen from "../screens/seller/SellerProfileScreen";
import TransactionHistoryScreen from "../screens/buyer/TransactionHistoryScreen";

// Create the navigation stacks
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Navigator
const AuthNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="UserType" component={UserTypeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );
};

// Buyer Tab Navigator
const BuyerTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown:false,
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
            <Tab.Screen name="Profile" component={BuyerProfileScreen} />
        </Tab.Navigator>
    );
};

// Buyer Main Navigator (includes the tab navigator and other screens)
const BuyerNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="BuyerTabs" component={BuyerTabNavigator} />
            <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Checkout" component={CheckoutScreen} />
            <Stack.Screen name="TransactionHistory" component={TransactionHistoryScreen}/>
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />
        </Stack.Navigator>
    );
};

// Seller Tab Navigator
const SellerTabNavigator = () => {
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
        </Tab.Navigator>
    );
};

// Seller Main Navigator (includes the tab navigator and other screens)
const SellerNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="SellerTabs" component={SellerTabNavigator} />
            <Stack.Screen name="AddProduct" component={SellerAddProductScreen} />
            <Stack.Screen name="Payments" component={SellerPaymentsScreen} />
            <Stack.Screen name="ReceivePayment" component={SellerReceivePaymentScreen} />
            <Stack.Screen name="Profile" component={SellerProfileScreen} />
        </Stack.Navigator>
    );
};

// Main App Navigator with authentication state
const AppNavigator = () => {
    // Use state to manage authentication
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        userType: null // 'buyer' or 'seller'
    });

    // Create a context or function to update auth state
    const login = (userType) => {
        setAuthState({
            isLoggedIn: true,
            userType: userType
        });
    };

    // Provide the login function to the auth screens
    const AuthStackWithContext = () => (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Start" component={StartScreen} />
            <Stack.Screen name="UserType" component={UserTypeScreen} />
            <Stack.Screen name="Login">
                {props => <LoginScreen {...props} onLogin={login} />}
            </Stack.Screen>
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </Stack.Navigator>
    );

    return (
        <NavigationContainer>
            {!authState.isLoggedIn ? (
                <AuthStackWithContext />
            ) : authState.userType === 'seller' ? (
                <SellerNavigator />
            ) : (
                <BuyerNavigator />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;