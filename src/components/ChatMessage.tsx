"use client";

import React, { useEffect, useState } from "react";
import BotAvatar from "@/components/BotAvatar";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";
import { TextMessage } from "@/types";
import UserAvatar from "@/components/UserAvatar";

interface ChatMessageProps {
  chatId: string;
}

const ChatMessage = ({ chatId }: ChatMessageProps) => {
  const [messages, setMessages] = useState<TextMessage[]>([]);
  console.log(chatId);

  useEffect(() => {
    if(!chatId) return
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("created_at", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const fetchMessages = snapShot.docs.map((doc) => ({
        id: doc.id,
        content: doc.data().content,
        type: doc.data().type,
        sender: doc.data().sender,
        created_at: doc.data().created_at,
        // ...doc.data(),
      }));
      console.log(fetchMessages);
      setMessages(fetchMessages);
    });
    return () => unsubscribe();
  }, []);
  return (
    <div className="flex-1 p-4 space-y-4 overflow-auto">
      {messages.map((message) => (
        <div key={message.id} className="flex space-x-4">
          {message.sender === "user" ? (
            <UserAvatar />
          ) : (
            <BotAvatar />
          )}
          <div>
            {/* メッセージのタイプによってタグを変える */}
            <div className="bg-white p-4 rounded-lg shadow break-all whitespace-pre-wrap">
              <p>{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatMessage;
