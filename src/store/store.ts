/* blue print for storage */

type UserId = string;

export interface Chat {
    id: string;
    userId: UserId;
    name: string;
    message: string;
    upvotes: UserId[]; 
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
