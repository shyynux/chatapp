
interface User{
    name: string;
    id: string;
}

interface Room{
    users: User[]
}

export class userManager {
    private users: Map<string, Room>;
    constructor(){
        this.users = new Map<string, Room>()
    }

    addUser(name: string, userId: string, roomId: string, socket: WebSocket){
        if(!this.users.get(roomId)){
            this.users.set(roomId, {
                users: []
            })
        }
        this.users.get(roomId)?.users.push({
            id: userId,
            name: name
        })
    }

    removeUser(roomId: string, userId: string){
        let users = this.users.get(roomId)?.users;
        if(users){
            users.filter((user) => user.id !== userId)
        }
    }
}