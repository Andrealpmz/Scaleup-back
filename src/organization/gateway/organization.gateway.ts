import { OnModuleInit } from "@nestjs/common";
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";

@WebSocketGateway()
export class OrganizationGateway implements OnModuleInit {

    @WebSocketServer()
    server: Server;

    onModuleInit() {
        this.server.on('connection', (socket) => {
            console.log("socket.id =>", socket.id)
            console.log("Connected...")
        })
    }

    @SubscribeMessage('OrgNotify')
    async orgNotify(@MessageBody() body: any){
        console.log("message received =>", body)
    //     const msn = await this.app_service.receiveNotification(body)
    //     console.log("msn result =>", msn)
    //   this.server.emit('onMessage', msn)
    //   return msn
    }

    // @SubscribeMessage('createMessage')
    // async createMessage(@MessageBody() body: any) {
    //   const msn = await this.app_service.receiveNotification(body)
    //   this.server.emit('theMessage', msn)
    //   return msn
    // }

}