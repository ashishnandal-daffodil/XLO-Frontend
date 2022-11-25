import { Injectable } from "@angular/core";
import { Socket } from "ngx-socket-io";
import { CustomSocket } from "src/app/private/sockets/custom-socket";
import { Room } from "src/app/model/room.interface";

@Injectable({
  providedIn: "root"
})
export class ChatService {
  constructor(private socket: CustomSocket) {}

  onCreateRoom() {
    return this.socket.fromEvent("newRoomCreated");
  }

  getMessage() {
    return this.socket.fromEvent("message");
  }

  isReceiverTyping() {
    return this.socket.fromEvent("isTyping");
  }

  getAllConnectedUsers() {
    this.socket.emit("getOnlineUsers");
    return this.socket.fromEvent("allConnectedUsers");
  }

  isReceiverOnline() {
    return this.socket.fromEvent("isOnline");
  }

  isReceiverOffline() {
    return this.socket.fromEvent("isOffline");
  }

  isTyping(userId, roomId) {
    this.socket.emit("isTyping", { userId: userId, roomId: roomId });
  }

  login() {
    this.socket.emit("login");
  }

  logout() {
    this.socket.emit("logout");
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
      updated_on: new Date(),
      unread_messages: [
        { userId: sellerId, count: 0 },
        { userId: buyerId, count: 0 }
      ]
    };
    this.socket.emit("createRoom", room);
  }

  joinRoom(roomName) {
    this.socket.emit("joinRoom", roomName);
  }

  getChatForRoom(room) {
    this.socket.emit("getChatForRoom", room);
    return this.socket.fromEvent("messages");
  }

  sendMessage(message, roomId) {
    this.socket.emit("sendMessage", { message: message, roomId: roomId });
  }
}
