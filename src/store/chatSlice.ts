import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, ChatbotOption } from '../infoutils/types';

export interface ChatState {
  messages: ChatMessage[];
  options: ChatbotOption[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  options: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus: (state, action: PayloadAction<{ id: string; response: string }>) => {
      const message = state.messages.find(m => m.id === action.payload.id);
      if (message) {
        message.response = action.payload.response;
      }
    },
    setOptions: (state, action: PayloadAction<ChatbotOption[]>) => {
      state.options = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearChat: (state) => {
      state.messages = [];
      state.error = null;
    },
  },
});

export const {
  setMessages,
  addMessage,
  updateMessageStatus,
  setOptions,
  setLoading,
  setError,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;