import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { CustomSocket } from "src/app/private/sockets/custom-socket";
import { User } from "src/app/model/user.interface";
import { Room } from "src/app/model/room.interface";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  constructor(private socket: CustomSocket) {}

  getMessage() {
    return this.socket.fromEvent("message");
  }

  getMyRooms(userId) {
    this.socket.emit("getMyRooms", userId);
    return this.socket.fromEvent("rooms");
  }

  createRoom(seller) {
    let userTwo: User = seller;
    const room: Room = {
      name: "",
      users: [userTwo],
      created_on: new Date(),
      updated_on: new Date()
    };
    this.socket.emit("createRoom", room);
  }

  joinRoom(roomName){
    this.socket.emit("joinRoom", roomName);
  }

  getChatForRoom(room) {
    this.socket.emit("getChatForRoom", room);
    return this.socket.fromEvent("messages");
  }

  sendMessage(message, roomId, roomName) {
    this.socket.emit("sendMessage", { message: message, roomId: roomId, roomName: roomName });
  }
}
