import { OutgoingMessage, SupportedMessage as OutgoingSupportedMessages } from "./messages/outgoingMessages";
import { server as WebSocketServer, connection } from "websocket";
import http from "http";
import { IncomingMessage, SupportedMessage } from "./messages/incomingMessages";
import { UserManager } from "./UserManager";
import { InMemoryStore } from "./store/InMemoryStore";

const server = http.createServer(function(request: any, response: any) {
    console.log((new Date()) + ' Received request for ' + request.url);
    console.log("hi handosme");
    response.writeHead(404);
    response.end();
});

const userManager = new UserManager();
const store = new InMemoryStore();

server.listen(8080, function() {
    console.log("hi girlllllllly");
    console.log((new Date()) + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: true
});

function originIsAllowed(origin: string) {
  // put logic here to detect whether the specified origin is allowed.
  return true;
}

wsServer.on('request', function(request: any) {
    console.log("hi bitch");
    if (!originIsAllowed(request.origin)) {
      // Make sure we only accept requests from an allowed origin
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + ' Connection accepted.');
    connection.on('message', function(message: any) {
        if (message.type === 'utf8') {
            try{
                messageHandler(connection, JSON.parse(message.utfData));
            }catch(e){

            }
        }
    });
});

/** if type JOIN_ROOM, message is initMessage **/
function messageHandler(ws: connection, message: IncomingMessage){
    if(message.type == SupportedMessage.JoinRoom){
        const payload = message.payload;
        userManager.addUser(payload.name, payload.userId, payload.roomId, ws);
    }

    if(message.type == SupportedMessage.SendMessage){
        const payload = message.payload;
        const user = userManager.getUser(payload.roomId, payload.userId);

        if(!user){
            console.error(" user does not exists ");
            return;
        }

        let chat = store.addChat(payload.userId, user.name, payload.roomId, payload.message);

        if(!chat){
            return;
        }

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.AddChat,
            payload: {
                roomId: payload.roomId,
                chatId: chat.id,
                name: user.name,
                message: payload.message,
                upvotes: 0
            }
        }
    }

    if(message.type === SupportedMessage.UpvoteMessage){
        const payload = message.payload;
        const chat = store.upvote(payload.userId, payload.roomId, payload.chatId);

        if(!chat){
            return;
        }

        const outgoingPayload: OutgoingMessage = {
            type: OutgoingSupportedMessages.UpdateChat,
            payload: {
                roomId: payload.roomId,
                chatId: payload.chatId,
                upvotes: chat.upvotes.length            }
        }

        userManager.broadcast(payload.roomId, payload.userId, outgoingPayload);
    
        /** store in memory that is's upvoted, then broadcast */
    }
}
