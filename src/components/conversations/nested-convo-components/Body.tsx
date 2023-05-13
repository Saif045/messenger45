"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";

import { pusherClient } from "@/libs/pusher";
import useConversation from "@/hooks/useConversation";
import MessageBox from "./MessageBox";
import { FullMessageType } from "@/types";
import { find } from "lodash";
import { useRouter } from "next/navigation";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages = [] }) => {
  const router = useRouter();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialMessages);

  const { conversationId } = useConversation();

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    const messageHandler = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }

        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }

          return currentMessage;
        })
      );
    };

    const removeHandler = (newMessage: FullMessageType) => {
      router.refresh();
    };

    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);
    pusherClient.bind("conversation:remove", removeHandler);

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
      pusherClient.unbind("conversation:remove", removeHandler);
    };
  }, [conversationId]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
};

export default Body;
