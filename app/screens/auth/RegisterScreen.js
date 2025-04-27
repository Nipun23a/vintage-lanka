import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AuthLayout from "../../layout/AuthLayout";


export default function RegisterScreen({ navigation, route }) {
    // Get user type from route params if available
    const userType = route.params?.userType || 'buyer';

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <AuthLayout
            title={`Create ${userType === 'seller' ? 'Seller' : 'Buyer'} Account`}
            subtitle="Join our community to explore great deals on second-hand treasures!"
        >
            {/* Full Name Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Full Name <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Enter your full name"
                />
            </View>

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
                    placeholder="Create a password"
                    secureTextEntry
                />
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirm Password <Text style={styles.required}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Confirm your password"
                    secureTextEntry
                />
            </View>

            {/* Register Button */}
            <TouchableOpacity style={styles.registerButton}>
                <Text style={styles.registerButtonText}>Create Account</Text>
            </TouchableOpacity>

            {/* Or continue with */}
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or Continue With</Text>
                <View style={styles.divider} />
            </View>

            {/* Social Register Options */}
            <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="google" size={24} color="#DB4437" />
                    <Text style={styles.socialButtonText}>Sign Up With Google</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                    <FontAwesome name="apple" size={24} color="#000" />
                    <Text style={styles.socialButtonText}>Sign Up With Apple</Text>
                </TouchableOpacity>
            </View>

            {/* Login Account */}
            <View style={styles.loginContainer}>
                <Text style={styles.alreadyMemberText}>Already a Member? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Sign In</Text>
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
        fontFamily:"Montserrat_Regular"
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
    registerButton: {
        backgroundColor: '#000',
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    registerButtonText: {
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
        fontFamily:'Montserrat_SemiBold',
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
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    alreadyMemberText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Montserrat_SemiBold'
    },
    loginText: {
        fontSize: 16,
        color: 'red',
        fontFamily: 'Montserrat_SemiBold'
    },
});