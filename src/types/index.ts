import { Timestamp } from "firebase/firestore";

export interface ChatRoom {
  id: string;
  type: string;
  first_message: string;
  user_id: string;
  last_updated: Timestamp;
}

export interface TextMessage {
    id: string;
    content: string;
    type: string;
    created_at: Timestamp;
    sender: "user" | "assistant";
}