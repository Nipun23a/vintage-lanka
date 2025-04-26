import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const StartScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
                {/* Content inside phone */}
                <View style={styles.phoneContent}>
                    {/* Header with hand holding hanger and jacket */}
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1543076447-215ad9ba6923?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
                            style={styles.jacketImage}
                            resizeMode="cover"
                        />
                        {/* Vertical "REFURBISHED" text */}
                        <View style={styles.verticalTextContainer}>
                            {
                                "REFURBISHED".split('').map((letter, index) => (
                                    <Text key={index} style={styles.verticalText}>
                                        {letter}
                                    </Text>
                                ))
                            }
                        </View>
                    </View>

                    {/* Bottom content section */}
                    <View style={styles.bottomContent}>
                        {/* Main headline */}
                        <Text style={styles.headline}>
                            BUY & SELL PRE-LOVED TREASURES WITH CONFIDENCE!
                        </Text>

                        {/* Subheadline */}
                        <Text style={styles.subheadline}>
                            DISCOVER AFFORDABLE SECOND-HAND GEMS WHILE PROMOTING SUSTAINABILITY AND SMART SHOPPING!
                        </Text>

                        {/* Get Started Button */}
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('Login')}
                        >
                            <Text style={styles.buttonText}>Get Started</Text>
                        </TouchableOpacity>
                    </View>
                </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },

    phoneContent: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        height: '60%',
        position: 'relative',
        backgroundColor: '#f0e6e0',
    },
    jacketImage: {
        width: '100%',
        height: '100%',
    },
    verticalTextContainer: {
        position: 'absolute',
        right: 20,
        top: 20,
        alignItems: 'center',
    },
    verticalText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#5a3921',
        marginBottom: 2,
    },
    bottomContent: {
        padding: 20,
        height: '40%',
        justifyContent: 'space-between',
    },
    headline: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subheadline: {
        fontSize: 14,
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#000',
        paddingVertical: 15,
        alignItems: 'center',
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StartScreen;