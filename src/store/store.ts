/* blue print for storage */

export type UserId = string;

export interface Chat {
    id: string;
    userId: UserId;
    name: string;
    message: string;
    upvotes: UserId[]; // a list of userids who upvoted this chat
}

export abstract class Store{
    constructor(){

    }
    initRoom(roomId: string){

    }

    getChats(room: string, limit: number, offset: number){

    }

    addChat(userId: string, name: string, roomId: string, message: string){

    }

    upvote(userId: string, room: string, chatId: string){

    }
}
