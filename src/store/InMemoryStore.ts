import { Store, Chat } from "./store";
let globalChatId = 0;

type UserId = string;

export interface Room {
    roomId: string;
    chats: Chat[];
}

export class inMemoryStore implements Store {
    private store: Map<string, Room>;

    constructor(){
        this.store = new Map<string, Room>()
    }

    initRoom(roomId: string){
        this.store.set(roomId, {
            roomId,
            chats: []
        });
    }

    /* returns last 'limit {= 50}' chats  */
    getChats(roomId: string, limit: number, offset: number){
        const room = this.store.get(roomId);
        if(!room){
            return[];
        }
        return room.chats.reverse().slice(0, offset).slice(-1 * limit);
    }

    /* adds new chat to the chat-room */
    addChat(userId: string, name: string, roomId: string, message: string){
        const room = this.store.get(roomId);
        if(!room){
            return[];
        }
        return room.chats.push({
            id: (globalChatId++).toString(),
            userId: userId,
            name: name,
            message: message,
            upvotes: []
        });
    }

    /* adds an upvote to a specific chat message */
    upvote(userId: string, roomId: string, chatId: string){
        const room = this.store.get(roomId);
        if(!room){
            return[];
        }

        /* TODO: make it faster */
        const chat = room.chats.find(({id}) => id === chatId);
       
        if(chat){
            chat.upvotes.push(userId);
        }
    }
}
