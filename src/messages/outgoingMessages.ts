
export enum SupportedMessage {
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT",
}

export type OutgoingMessage = {
    type: SupportedMessage.AddChat
    payload: MessagePayload
} | {
    type: SupportedMessage.UpdateChat
    payload: Partial<MessagePayload>
}

type MessagePayload = {
    roomId: string;
    chatId: string;
    name: string;
    message: string;
    upvotes: number;
}