// useUser.js
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUser = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.log('Error loading user:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    return { user,setUser, loading };
};