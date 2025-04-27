import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import AuthLayout from "../../layout/AuthLayout";


export default function UserTypeScreen({ navigation }) {
    return (
        <AuthLayout
            title="Select User Type"
            subtitle="Please select your account type to continue"
        >
            <View style={styles.optionsContainer}>
                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate('Register', { userType: 'buyer' })}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="shopping-bag" size={28} color="#000" />
                    </View>
                    <Text style={styles.optionTitle}>I'm a Buyer</Text>
                    <Text style={styles.optionDescription}>Looking to browse and purchase items</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.optionButton}
                    onPress={() => navigation.navigate('Register', { userType: 'seller' })}
                >
                    <View style={styles.iconContainer}>
                        <FontAwesome5 name="store" size={28} color="#000" />
                    </View>
                    <Text style={styles.optionTitle}>I'm a Seller</Text>
                    <Text style={styles.optionDescription}>Looking to list items and manage sales</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.loginContainer}>
                <Text style={styles.alreadyUserText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.loginText}>Login</Text>
                </TouchableOpacity>
            </View>
        </AuthLayout>
    );
}

const styles = StyleSheet.create({
    optionsContainer: {
        marginTop: 20,
        gap: 20,
    },
    optionButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 20,
        alignItems: 'center',
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionTitle: {
        fontSize: 18,
        fontFamily:'Montserrat_Bold',
        marginBottom: 8,
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Montserrat_Regular'
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    alreadyUserText: {
        fontSize: 16,
        color: '#666',
        fontFamily:'Montserrat_SemiBold'
    },
    loginText: {
        fontSize: 16,
        color: 'red',
        fontWeight: '500',
        fontFamily:'Montserrat_SemiBold'
    },
});