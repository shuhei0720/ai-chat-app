"use client";

import React, { useEffect, useRef, useState } from "react";
import BotAvatar from "@/components/BotAvatar";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";
import { Message, TextMessage } from "@/types";
import UserAvatar from "@/components/UserAvatar";
import Panel from "@/components/Panel";
import MessageDisplay from "./MessageDisplay";
import TextMessageComponent from "./TextMessageComponent";
import ImageMessageComponent from "./ImageMessageComponent";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  chatId?: string,
  chatType: string,
}

const ChatMessage = ({ chatId,chatType}: ChatMessageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  
  const endRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  },[messages.length])

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
  }, [chatId]);

  const getMessageComponent = (message:Message) => {
    switch(message.type) {
      case "text":
      return <TextMessageComponent content={message.content}/>;

      case "image":
      return <ImageMessageComponent images={message.content}/>;
    }
  };

  return (
    <>
      {!chatId ? (
        <Panel chatType={chatType}/>
      ) : (
        <div className="flex-1 p-4 space-y-4 overflow-auto">
        {messages.map((message) => (
          <div key={message.id} className="flex space-x-4">
            {message.sender === "user" ? (
              <UserAvatar />
            ) : (
              <BotAvatar />
            )}
            <div className={cn(message.type === "image" ? "flex-1" : "")}>
              {/* メッセージのタイプによってタグを変える */}
              <div>{getMessageComponent(message)}</div>
            </div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>
      )}
    </>
  );
};

export default ChatMessage;
