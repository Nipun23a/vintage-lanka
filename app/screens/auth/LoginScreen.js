import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AuthLayout from "../../layout/AuthLayout";
 // Import the AuthLayout component

export default function LoginScreen({ navigation, onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Hardcoded credentials
    const buyerCredentials = { email: 'buyer@example.com', password: 'buyer123' };
    const sellerCredentials = { email: 'seller@example.com', password: 'seller123' };

    const handleLogin = () => {
        // Reset error message
        setErrorMessage('');

        if (email.trim() === '' || password.trim() === '') {
            setErrorMessage('Please enter both email and password');
            return;
        }

        // Check if credentials match buyer
        if (email === buyerCredentials.email && password === buyerCredentials.password) {
            // Use the onLogin function from props to update auth state
            onLogin('buyer');
            return;
        }

        // Check if credentials match seller
        if (email === sellerCredentials.email && password === sellerCredentials.password) {
            // Use the onLogin function from props to update auth state
            onLogin('seller');
            return;
        }

        // If no match found
        setErrorMessage('Invalid email or password');
    };

    return (
        <AuthLayout
            title="Sign In To Your Account"
            subtitle="Sign in to explore great deals on second-hand treasures!"
        >
            {/* Error Message */}
            {errorMessage ? (
                <Text style={styles.errorMessage}>{errorMessage}</Text>
            ) : null}

            {/* Email Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    secureTextEntry
                />
                <TouchableOpacity
                    style={styles.forgotPasswordContainer}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>

            {/* Demo Account Info */}
            <View style={styles.demoAccountsContainer}>
                <Text style={styles.demoAccountsTitle}>Demo Accounts:</Text>
                <Text style={styles.demoAccountText}>Buyer: buyer@example.com / buyer123</Text>
                <Text style={styles.demoAccountText}>Seller: seller@example.com / seller123</Text>
            </View>

            {/* Or continue with */}
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or Continue With</Text>
                <View style={styles.divider} />
            </View>

            {/* Social Login Options */}
            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="google" size={24} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Sign In With Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="apple" size={24} color="#000" />
                    <Text style={styles.socialButtonText}>Sign In With Apple</Text>
                </TouchableOpacity>
            </View>

            {/* Create Account */}
            <View style={styles.createAccountContainer}>
                <Text style={styles.notMemberText}>Not a Member? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('UserType')}>
                    <Text style={styles.createAccountText}>Create an Account</Text>
                </TouchableOpacity>
            </View>
        </AuthLayout>
    );
}


const styles = StyleSheet.create({
    inputContainer: {
        marginBottom: 16,

    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontFamily:'Montserrat_Regular'
    },
    required: {
        color: 'red',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        fontFamily:'Montserrat_Light'
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    forgotPassword: {
        color: '#000',
        fontWeight: '500',
        fontFamily:'Montserrat_SemiBold'
    },
    signInButton: {
        backgroundColor: '#000',
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily:'Montserrat_SemiBold'
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#ddd',
    },
    dividerText: {
        paddingHorizontal: 16,
        color: '#666',
        fontFamily:'Montserrat_SemiBold'
    },
    socialContainer: {
        gap: 16,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        height: 50,
        borderRadius: 4,
        gap: 12,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    socialButtonText: {
        fontSize: 16,
        fontFamily: 'Montserrat_Regular'
    },
    createAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    notMemberText: {
        fontSize: 16,
        color: '#666',
        fontFamily:'Montserrat_SemiBold'
    },
    createAccountText: {
        fontSize: 16,
        color: 'red',
        fontWeight: '500',
        fontFamily: 'Montserrat_SemiBold'
    },
    errorMessage: {
        color: '#FF0000',
        textAlign: 'center',
        marginBottom: 15,
        fontSize: 16,
    },
    demoAccountsContainer: {
        backgroundColor: '#f5f7fa',
        padding: 12,
        borderRadius: 8,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    demoAccountsTitle: {
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    demoAccountText: {
        color: '#666',
        fontSize: 14,
    },
});