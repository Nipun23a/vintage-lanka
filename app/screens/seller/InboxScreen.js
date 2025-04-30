import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { database } from '../../config/firebase';
import { ref, onValue, query, orderByChild } from 'firebase/database';

const InboxScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get the current user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserId(userData.userId);
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };

    getUserData();
  }, []);

  // Fetch all chats for this user
  useEffect(() => {
    if (!userId) return;
  
    const chatsRef = ref(database, 'chats');
  
    const unsubscribe = onValue(chatsRef, async (snapshot) => {
      const chatData = snapshot.val() || {};
      const chatList = [];
  
      for (const key in chatData) {
        const chat = chatData[key];
        if (chat.participants && chat.participants.includes(userId)) {
          const otherParticipantId = chat.participants.find(id => id !== userId);
  
          try {
            const userRef = ref(database, `users/${otherParticipantId}`);
            const userSnapshot = await new Promise((resolve) => {
              onValue(userRef, (snapshot) => resolve(snapshot), { onlyOnce: true });
            });
  
            const userData = userSnapshot.val() || {};
  
            chatList.push({
              id: key,
              lastMessage: chat.lastMessage,
              lastMessageTime: new Date(chat.lastMessageTime),
              otherParticipantId,
              otherParticipantName: userData.fullName || 'User',
              otherParticipantImage: userData.profileImage || 'https://via.placeholder.com/50',
              productId: chat.relatedProduct,
              productTitle: chat.productTitle
            });
          } catch (error) {
            console.error('Error fetching user data:', error);
            chatList.push({
              id: key,
              lastMessage: chat.lastMessage,
              lastMessageTime: new Date(chat.lastMessageTime),
              otherParticipantId,
              otherParticipantName: 'User',
              otherParticipantImage: 'https://via.placeholder.com/50',
              productId: chat.relatedProduct,
              productTitle: chat.productTitle
            });
          }
        }
      }
  
      chatList.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
  
      setChats(chatList);
      setLoading(false);
      setRefreshing(false);
    });
  
    return () => unsubscribe(); // now this will be a proper function
  }, [userId]);
  

  const onRefresh = () => {
    setRefreshing(true);
    // The useEffect hook will handle the refresh when refreshing state changes
  };

  const formatDate = (date) => {
    const now = new Date();
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    ).getTime();
    
    const yesterday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 1
    ).getTime();
    
    const messageDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    ).getTime();
    
    if (messageDate >= today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (messageDate >= yesterday) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const navigateToChat = (chat) => {
    navigation.navigate('Chat', {
      sellerId: chat.otherParticipantId,
      sellerName: chat.otherParticipantName,
      sellerImage: chat.otherParticipantImage,
      productId: chat.productId,
      productTitle: chat.productTitle
    });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatItem} 
      onPress={() => navigateToChat(item)}
    >
      <Image 
        source={{ uri: item.otherParticipantImage }} 
        style={styles.avatar} 
      />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.otherParticipantName}
          </Text>
          <Text style={styles.chatTime}>
            {formatDate(item.lastMessageTime)}
          </Text>
        </View>
        <View style={styles.chatPreviewContainer}>
          {item.productTitle && (
            <Text style={styles.productRef} numberOfLines={1}>
              {item.productTitle} • 
            </Text>
          )}
          <Text style={styles.chatPreview} numberOfLines={1}>
            {item.lastMessage}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <FontAwesome name="inbox" size={50} color="#ccc" />
      <Text style={styles.emptyText}>No messages yet</Text>
      <Text style={styles.emptySubText}>
        When you have conversations with sellers, they will appear here
      </Text>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Messages" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#e74c3c" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Messages" />
      <FlatList
        data={chats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#e74c3c']}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    flexGrow: 1,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 10,
  },
  chatTime: {
    fontSize: 12,
    color: '#888',
  },
  chatPreviewContainer: {
    flexDirection: 'row',
  },
  productRef: {
    fontSize: 14,
    color: '#666',
  },
  chatPreview: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    maxWidth: '80%',
  },
});

export default InboxScreen;