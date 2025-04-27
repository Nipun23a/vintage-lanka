import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AuthLayout from "../../layout/AuthLayout";

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState('');

    return (
        <AuthLayout
            title="Forgot Password"
            subtitle="Enter your email address to receive a password reset link"
        >
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

            {/* Reset Password Button */}
            <TouchableOpacity style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Send Reset Link</Text>
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={styles.backToLoginContainer}>
                <Text style={styles.rememberText}>Remember your password? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.backToLoginText}>Back to Login</Text>
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
    resetButton: {
        backgroundColor: '#000',
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 16,
    },
    resetButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily:"Montserrat_SemiBold"
    },
    backToLoginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    rememberText: {
        fontSize: 16,
        fontFamily:"Montserrat_SemiBold",
        color: '#666',
    },
    backToLoginText: {
        fontSize: 16,
        color: 'red',
        fontWeight: '500',
        fontFamily:"Montserrat_SemiBold",
    },
});