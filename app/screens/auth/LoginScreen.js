import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, SafeAreaView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // Using Expo Vector Icons

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {/* Header Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }}
                        style={styles.headerImage}
                        resizeMode="cover"
                    />
                    <View style={styles.darkOverlay} />
                </View>

                {/* Sign In Section */}
                <View style={styles.formContainer}>
                    <Text style={styles.title}>Sign In To Your Account</Text>
                    <Text style={styles.subtitle}>Sign in to explore great deals on second-hand treasures!</Text>

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
                        <TouchableOpacity style={styles.forgotPasswordContainer}>
                            <Text style={styles.forgotPassword}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity style={styles.signInButton}>
                        <Text style={styles.signInButtonText}>Sign In</Text>
                    </TouchableOpacity>

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
                            <Text style={styles.socialButtonText}>Sign Up With Google</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.socialButton}>
                            <FontAwesome name="apple" size={24} color="#000" />
                            <Text style={styles.socialButtonText}>Sign Up With Apple</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Create Account */}
                    <View style={styles.createAccountContainer}>
                        <Text style={styles.notMemberText}>Not a Member? </Text>
                        <TouchableOpacity>
                            <Text style={styles.createAccountText}>Create an Account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        flexGrow: 1,
    },
    imageContainer: {
        height: 200,
        overflow: 'hidden',
        position: 'relative',
        borderBottomRightRadius: 160, // Rounded bottom right corner
    },
    headerImage: {
        width: '100%',
        height: '100%',
        borderBottomRightRadius: 160, // Match the container's border radius
    },
    darkOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay with 40% opacity
        borderBottomRightRadius: 160, // Match the container's border radius
    },
    formContainer: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    inputContainer: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
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
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginTop: 8,
    },
    forgotPassword: {
        color: '#000',
        fontWeight: '500',
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
    },
    socialContainer: {
        gap: 16,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', // Changed to white background
        height: 50,
        borderRadius: 4,
        gap: 12,
        borderWidth: 1, // Added border
        borderColor: '#ddd', // Light gray border color
    },
    socialButtonText: {
        fontSize: 16,
    },
    createAccountContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    notMemberText: {
        fontSize: 16,
        color: '#666',
    },
    createAccountText: {
        fontSize: 16,
        color: 'red',
        fontWeight: '500',
    },
});