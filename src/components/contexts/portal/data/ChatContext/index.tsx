"use client";

import { ChatHistory } from '@/actions/strapi/types/chatHistory';
import { Dispatch, SetStateAction, createContext, useContext, useState } from 'react';

export interface ChatContextData {
  history: ChatHistory | undefined;
  setHistory: Dispatch<SetStateAction<ChatHistory | undefined>>;
  streamingResponse: string;
  setStreamingResponse: Dispatch<SetStateAction<string>>;
  tempChatMessage: string;
  setTempChatMessage: Dispatch<SetStateAction<string>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;
  model: string;
  setModel: Dispatch<SetStateAction<string>>;
 }
   
const ChatContext = createContext<ChatContextData>( {} as ChatContextData );
   

export const ChatContextWrapper = ( {children}: {children: React.ReactNode} ) => {
  const [history, setHistory] = useState<ChatHistory | undefined>( undefined );
  const [streamingResponse, setStreamingResponse] = useState<string>( '' );
  const [tempChatMessage, setTempChatMessage] = useState<string>( '' );
  const [loading, setLoading] = useState<boolean>( false );
  const [userInput, setUserInput] = useState<string>( '' );
  const [model, setModel] = useState<string>( '' );
   
  return (
    <ChatContext.Provider
      value={{
        history,
        setHistory,
        streamingResponse,
        setStreamingResponse,
        tempChatMessage,
        setTempChatMessage,
        loading,
        setLoading,
        userInput,
        setUserInput,
        model,
        setModel
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
   
export const useChatContext = () => {
  return useContext(ChatContext);
 };