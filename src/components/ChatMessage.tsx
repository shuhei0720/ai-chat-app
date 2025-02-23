"use client"

import React, { useEffect } from 'react'
import BotAvatar from '@/components/BotAvatar'
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebaseClient';

interface ChatMessageProps {
  chatId: string,
}

const ChatMessage = ({chatId}: ChatMessageProps) => {
  console.log(chatId);

  useEffect(() => {
    const q = query(
    collection(db, "chats"),
    where("user_id", "==", "currentUser?.uid"),
    orderBy("last_updated", "desc"),
  );

  const unsubscribe = onSnapshot(q,(snapShot) => {
    const fetchChatRooms = snapShot.docs.map((doc) => (
      {
        id: doc.id,
        type: doc.data().type,
        first_message: doc.data().first_message,
        user_id: doc.data().user_id,
        last_updated: doc.data().last_updated,
        // ...doc.data(),
      }
    ))
    console.log(fetchChatRooms);
    // setChatRooms(fetchChatRooms);
  })
  return () => unsubscribe();
  },[]);
  return (
    <div className='flex-1 p-4 space-y-4 overflow-auto'>
      <div className='flex space-x-4'>
        <BotAvatar />
        <div>
          {/* メッセージのタイプによってタグを変える */}
          <div className='bg-white p-4 rounded-lg shadow break-all whitespace-pre-wrap'>
            <p>message</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatMessage