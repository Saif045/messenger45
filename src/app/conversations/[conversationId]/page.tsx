import getConversationById from "@/actions/getConversationById";
import getMessages from "@/actions/getMessages";

import Header from "@/components/conversations/nested-convo-components/Header";
import Body from "@/components/conversations/nested-convo-components/Body";
import Form from "@/components/conversations/nested-convo-components/Form";

import EmptyState from "@/components/globalComponents/EmptyState";

interface IParams {
  conversationId: string;
}

export default async function ChatId({ params }: { params: IParams }) {
  const conversation = await getConversationById(params.conversationId);
  const messages = await getMessages(params.conversationId);

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <Body initialMessages={messages} />
        <Form />
      </div>
    </div>
  );
}
