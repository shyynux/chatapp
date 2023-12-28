import { connection } from "websocket";

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

    broadcast(){
        
    }
}