import { environment } from 'src/environments/environment.prod';
import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  socket;

  constructor() {   }

  setupSocketConnection() {
    console.log("🚀 ~ file: chat.service.ts ~ line 15 ~ ChatService ~ setupSocketConnection ~ setupSocketConnection")
    this.socket = io(environment.socketEndpoint);
  }

  // Handle message receive event
  subscribeToMessages = (cb) => {
    if (!this.socket) return(true);
    this.socket.on('message', msg => {
      console.log('Room event received!');
      return cb(null, msg);
    });
  }

  sendMessage = ({message, roomName}, cb) => {
    console.log("🚀 ~ file: chat.service.ts ~ line 32 ~ ChatService ~ message", message, roomName)
    if (this.socket) this.socket.emit('message', { message, roomName }, cb);
  }

  joinRoom = (roomName) => {
    this.socket.emit('join', roomName);
  }
  
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}