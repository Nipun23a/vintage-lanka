import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../components/Header';
import { database } from '../../config/firebase';
import { ref, set, push, onValue, update, serverTimestamp, get } from 'firebase/database';

const ChatScreen = ({ navigation }) => {
  const route = useRoute();
  const { sellerId, sellerName, sellerImage, productId, productTitle } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatId, setChatId] = useState(null);
  const flatListRef = useRef(null);

  // Get the current user data
  useEffect(() => {
    const getUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          const userData = JSON.parse(userDataString);
          setUserId(userData.userId);
          setUserName(userData.userFullName);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error retrieving user data:', error);
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  // Find or create chat ID
  useEffect(() => {
    if (!userId || !sellerId) return;

    // Create a unique ID for this chat (sorted to ensure same ID regardless of who initiates)
    const participants = [userId, sellerId].sort();
    const chatRoomId = `${participants[0]}_${participants[1]}`;
    setChatId(chatRoomId);

    // Check if this chat already exists
    const checkChatExists = async () => {
      try {
        const chatRef = ref(database, `chats/${chatRoomId}`);
        const snapshot = await get(chatRef);
        
        if (!snapshot.exists()) {
          // Create a new chat document
          await set(chatRef, {
            id: chatRoomId,
            participants: participants,
            createdAt: new Date().toISOString(),
            lastMessage: '',
            lastMessageTime: new Date().toISOString(),
            relatedProduct: productId ? productId : null,
            productTitle: productTitle ? productTitle : null
          });
        }
      } catch (error) {
        console.error('Error checking/creating chat:', error);
      }
    };

    checkChatExists();
  }, [userId, sellerId, productId, productTitle]);

  // Listen for messages
  useEffect(() => {
    if (!chatId) return;
  
    const messagesRef = ref(database, `messages/${chatId}`);
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const messagesArray = Object.entries(data).map(([id, msg]) => ({
        id,
        ...msg,
        createdAt: new Date(msg.createdAt)
      }));
      messagesArray.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(messagesArray);
  
      // Scroll to bottom
      if (messagesArray.length > 0 && flatListRef.current) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: true });
        }, 200);
      }
    });
  
    return () => unsubscribe();
  }, [chatId]);
  
  const sendMessage = async () => {
    if (message.trim() === '' || !userId || !chatId) return;
  
    const newMessageRef = push(ref(database, `messages/${chatId}`));
    const messageData = {
      chatId: chatId,
      text: message.trim(),
      createdAt: new Date().toISOString(),
      userId: userId,
      userName: userName
    };
    
    await set(newMessageRef, messageData);
    
    // Update the chat document with the last message
    const chatRef = ref(database, `chats/${chatId}`);
    await update(chatRef, {
      lastMessage: message.trim(),
      lastMessageTime: new Date().toISOString()
    });
  
    setMessage('');
  };

  // Render a single message
  const renderMessage = ({ item }) => {
    const isCurrentUser = item.userId === userId;
    
    return (
      <View style={[
        styles.messageBubble,
        isCurrentUser ? styles.userMessage : styles.otherMessage
      ]}>
        <Text style={[
          styles.messageText,
          isCurrentUser ? styles.userMessageText : styles.otherMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={styles.messageTime}>
          {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Header
          title={sellerName || "Chat"}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
        />
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={sellerName || "Chat"}
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      {/* Seller info */}
      <View style={styles.sellerInfo}>
        <Image 
          source={{ uri: sellerImage || 'https://via.placeholder.com/50' }} 
          style={styles.sellerImage} 
        />
        <View style={styles.sellerTextInfo}>
          <Text style={styles.sellerName}>{sellerName}</Text>
          {productTitle && (
            <Text style={styles.productTitle} numberOfLines={1}>
              Product: {productTitle}
            </Text>
          )}
        </View>
      </View>
      
      {/* Messages list */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            if (flatListRef.current && messages.length > 0) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
        />
        
        {/* Message input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={message}
            onChangeText={setMessage}
            placeholder="Type a message..."
            multiline
          />
          <TouchableOpacity 
            style={styles.sendButton} 
            onPress={sendMessage}
            disabled={message.trim() === ''}
          >
            <FontAwesome name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    backgroundColor: '#fff',
  },
  sellerImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  sellerTextInfo: {
    marginLeft: 15,
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productTitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  messagesContainer: {
    paddingBottom: 10,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    marginVertical: 5,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#e74c3c',
    borderBottomRightRadius: 5,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1',
    borderBottomLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
  },
  userMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageTime: {
    fontSize: 10,
    color: 'rgba(0,0,0,0.5)',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e1e1e1',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e1e1e1',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#e74c3c',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
});

export default ChatScreen;