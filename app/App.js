import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import AppNavigator from "./navigation/AppNavigator";
import { useState, useEffect } from 'react';
import {useFonts} from "expo-font";
import {StripeProvider} from "@stripe/stripe-react-native";

export default function App() {
    const [publishableKey,setPublishableKey] = useState('');
    const [loaded,error] = useFonts({
        Montaga:require('./assets/fonts/Montaga/Montaga-Regular.ttf'),
        Alatsi: require('./assets/fonts/Alatsi/Alatsi-Regular.ttf'),
        Montserrat_Bold:require('./assets/fonts/Montserrat/Montserrat-Bold.ttf'),
        Montserrat_Light:require('./assets/fonts/Montserrat/Montserrat-Light.ttf'),
        Montserrat_Regular:require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        Montserrat_SemiBold:require('./assets/fonts/Montserrat/Montserrat-SemiBold.ttf'),
    });

    const fetchPublishableKey = async () => {
        const key = await fetchKey(key);
    };

    useEffect(() => {
        fetchPublishableKey();
    }, []);



    return (
        <StripeProvider
            publishableKey="your-publishable-key"
            urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
            merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
        >
            <StatusBar style="auto" />
            <AppNavigator />
        </StripeProvider>
    );
}
