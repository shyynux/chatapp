import { connection } from "websocket";
import { OutgoingMessage } from "./messages/outgoingMessages";

interface User{
    name: string;
    id: string;
    conn: connection;
}

interface Room{
    users: User[]
}

export class UserManager {
    private users: Map<string, Room>;
    constructor(){
        /** the string is roomId here */
        this.users = new Map<string, Room>()
    }

    addUser(name: string, userId: string, roomId: string, socket: connection){
        if(!this.users.get(roomId)){
            this.users.set(roomId, {
                users: []
            })
        }
        this.users.get(roomId)?.users.push({
            id: userId,
            name: name,
            conn: socket,
        })
    }

    removeUser(roomId: string, userId: string){
        let users = this.users.get(roomId)?.users;
        if(users){
            users.filter((user) => user.id !== userId)
        }
    }

    getUser(roomId: string, userId: string){
        const user = this.users.get(roomId)?.users.find(user => user.id === userId);
        return user ?? null;
    }

    broadcast(roomId: string, userId: string, message: OutgoingMessage){
        const user = this.getUser(roomId, userId);

        if(!user){
            console.error("oops, user does not exists!!");
            return;
        }

        const room = this.users.get(roomId);

        if(!room){
            console.error("room does not exist!");
            return;
        }

        room.users.forEach((user) => {
            if(user.id === userId){
                return;
            }
            console.log("outgoing message" + JSON.stringify(message))
            user.conn.sendUTF(JSON.stringify(message));
        })
    }
}