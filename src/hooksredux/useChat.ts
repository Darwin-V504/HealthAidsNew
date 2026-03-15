// src/hooksredux/useChat.ts

import { useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  addMessage,
  setMessages,
  setOptions,
  setLoading,
  setError,
  clearChat,
  updateMessageStatus
} from '../store/chatSlice';
import { chatService } from '../services/chatService';
import { ChatbotOption, ChatMessage } from '../infoutils/types';
import { useAuth } from '../contexts/AuthContext';

export const useChat = () => {
  const dispatch = useAppDispatch();
  const { messages, options, loading, error } = useAppSelector(state => state.chat);
  const { user } = useAuth();

  // Cargar historial del chat
  const loadChatHistory = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      dispatch(setLoading(true));
      const history = await chatService.getChatHistory(Number(user.id));
      dispatch(setMessages(history));
    } catch (err: any) {
      dispatch(setError(err.message || 'Error al cargar historial'));
    } finally {
      dispatch(setLoading(false));
    }
  }, [user?.id, dispatch]);

  // Cargar opciones del chat
  const loadChatOptions = useCallback(async () => {
    try {
      const chatOptions = await chatService.getChatOptions();
      dispatch(setOptions(chatOptions));
    } catch (err: any) {
      console.error('Error loading options:', err);
    }
  }, [dispatch]);

  // Enviar mensaje
  const sendMessage = useCallback(async (message: string) => {
    if (!user?.id || !message.trim()) return null;
    
    // Crear mensaje temporal del usuario
    const tempMessage: ChatMessage = {
      id: Date.now().toString(),
      message: message.trim(),
      response: '',
      isFromAI: false,
      createdAt: new Date().toISOString(),
    };
    
    dispatch(addMessage(tempMessage));
    
    try {
      dispatch(setLoading(true));
      const response = await chatService.sendMessage(Number(user.id), message.trim());
      
      // Actualizar el mensaje temporal con la respuesta
      dispatch(updateMessageStatus({ 
        id: tempMessage.id, 
        response: response.response 
      }));
      
      return response;
    } catch (err: any) {
      dispatch(setError(err.message || 'Error al enviar mensaje'));
      
      // Mensaje de error
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: '',
        response: 'Lo siento, hubo un error. Por favor intenta de nuevo.',
        isFromAI: true,
        createdAt: new Date().toISOString(),
      };
      dispatch(addMessage(errorMessage));
      
      return null;
    } finally {
      dispatch(setLoading(false));
    }
  }, [user?.id, dispatch]);

  // Enviar opción seleccionada
  const sendOption = useCallback(async (option: ChatbotOption) => {
    return sendMessage(option.text);
  }, [sendMessage]);

  // Limpiar chat
  const clearChatHistory = useCallback(() => {
    dispatch(clearChat());
  }, [dispatch]);

  // Marcar mensajes como leídos
  const markAsRead = useCallback((messageId: string) => {
    // Implementar si es necesario
  }, []);

  return {
    // Estado
    messages,
    options,
    loading: loading === true,
    error,
    hasMessages: messages.length > 0,

    // Acciones
    loadChatHistory,
    loadChatOptions,
    sendMessage,
    sendOption,
    clearChat: clearChatHistory,
    markAsRead,

    // Mensajes agrupados
    userMessages: messages.filter((m: ChatMessage) => m.isFromAI === false),
    aiMessages: messages.filter((m: ChatMessage) => m.isFromAI === true),
    lastMessage: messages[messages.length - 1],
  };
};