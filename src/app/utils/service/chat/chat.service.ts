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

  getMyRoomsAsSeller(userId) {
    this.socket.emit("getMyRoomsAsSeller", userId);
    return this.socket.fromEvent("roomsAsSeller");
  }

  getMyRoomsAsBuyer(userId) {
    this.socket.emit("getMyRoomsAsBuyer", userId);
    return this.socket.fromEvent("roomsAsBuyer");
  }

  createRoom(sellerId, buyerId, productId) {
    const room: Room = {
      name: "",
      seller_id: sellerId,
      buyer_id: buyerId,
      product_id: productId,
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
