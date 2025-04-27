import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import AppNavigator from "./navigation/AppNavigator";
import { useState, useEffect } from 'react';
import {useFonts} from "expo-font";

export default function App() {
    const [loaded,error] = useFonts({
        Montaga:require('./assets/fonts/Montaga/Montaga-Regular.ttf'),
        Montserrat_Bold:require('./assets/fonts/Montserrat/Montserrat-Bold.ttf'),
        Montserrat_Light:require('./assets/fonts/Montserrat/Montserrat-Light.ttf'),
        Montserrat_Regular:require('./assets/fonts/Montserrat/Montserrat-Regular.ttf'),
        Montserrat_SemiBold:require('./assets/fonts/Montserrat/Montserrat-SemiBold.ttf'),
    });


    return (
        <>
            <StatusBar style="auto" />
            <AppNavigator />
        </>
    );
}
