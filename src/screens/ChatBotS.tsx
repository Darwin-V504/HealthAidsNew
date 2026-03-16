import { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { getThemeColors } from "../infoutils/theme";
import { chatbotService } from "../services/chatBotService";
import { ChatbotNode } from "../infoutils/types";
import { useAuth } from "../contexts/AuthContext";

export default function ChatbotS({ navigation }: any) {
  const [currentNode, setCurrentNode] = useState<ChatbotNode | null>(null);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    startChat();
  }, []);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const startChat = async () => {
    setLoading(true);
    try {
      const response = await chatbotService.start();
      if (response.success) {
        setCurrentNode(response.node);
        setMessages([{ text: response.node.message, isUser: false }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = async (optionId: number, optionText: string) => {
    setMessages(prev => [...prev, { text: optionText, isUser: true }]);

    setLoading(true);
    try {
    const response = await chatbotService.selectOption(optionId);
 

if (response.success) {
  setCurrentNode(response.node);
  setMessages(prev => [...prev, { text: response.node.message, isUser: false }]);

  if (response.action === 'schedule') {
    console.log(' Navegando a Schedules');
    navigation.navigate('Schedules');
  } else if (response.action === 'login') {
    navigation.navigate('Login');
  } else if (response.action === 'register') {
    navigation.navigate('Register');
  }
}
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      const response = await chatbotService.reset();
      if (response.success) {
        setCurrentNode(response.node);
        setMessages([{ text: response.node.message, isUser: false }]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentNode) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageRow,
              message.isUser ? styles.userMessageRow : styles.botMessageRow
            ]}
          >
            {!message.isUser && (
              <View style={[styles.botAvatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="medical" size={20} color={colors.white} />
              </View>
            )}

            <View
              style={[
                styles.messageBubble,
                message.isUser
                  ? [styles.userBubble, { backgroundColor: colors.primary }]
                  : [styles.botBubble, { backgroundColor: colors.card, borderColor: colors.border }]
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  { color: message.isUser ? colors.white : colors.text }
                ]}
              >
                {message.text}
              </Text>
            </View>
          </View>
        ))}

        {loading && (
          <View style={styles.loadingMessage}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        )}
      </ScrollView>

      {currentNode && currentNode.options.length > 0 && !loading && (
        <View style={[styles.optionsContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.optionsTitle, { color: colors.textSecondary }]}>
            Opciones:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {currentNode.options.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => handleSelectOption(option.id, option.text)}
              >
                <Text style={[styles.optionText, { color: colors.text }]}>{option.text}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Ionicons name="refresh" size={20} color={colors.primary} />
            <Text style={[styles.resetText, { color: colors.primary }]}>Reiniciar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  userMessageRow: {
    justifyContent: 'flex-end',
  },
  botMessageRow: {
    justifyContent: 'flex-start',
  },
  botAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    borderBottomRightRadius: 4,
  },
  botBubble: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  loadingMessage: {
    alignItems: 'center',
    padding: 8,
  },
  optionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  optionsTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  optionText: {
    fontSize: 14,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    padding: 8,
  },
  resetText: {
    marginLeft: 8,
    fontSize: 14,
  },
});