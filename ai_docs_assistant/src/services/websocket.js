// src/services/websocket.js
class WebSocketService {
  constructor() {
    this.socket = null;
    this.subscribers = new Map();
  }

  connect(token) {
    this.socket = new WebSocket(`ws://localhost:8000/ws?token=${token}`);
    
    this.socket.onopen = () => {
      console.log('WebSocket Connected');
      this.heartbeat();
    };

    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.notifySubscribers(data.type, data.payload);
    };

    this.socket.onclose = () => {
      console.log('WebSocket Disconnected');
      setTimeout(() => this.connect(token), 5000);
    };
  }

  subscribe(type, callback) {
    if (!this.subscribers.has(type)) {
      this.subscribers.set(type, []);
    }
    this.subscribers.get(type).push(callback);
    return () => this.unsubscribe(type, callback);
  }

  unsubscribe(type, callback) {
    const subscribers = this.subscribers.get(type);
    if (subscribers) {
      const index = subscribers.indexOf(callback);
      if (index > -1) subscribers.splice(index, 1);
    }
  }

  notifySubscribers(type, payload) {
    const subscribers = this.subscribers.get(type);
    if (subscribers) {
      subscribers.forEach(callback => callback(payload));
    }
  }

  send(type, payload) {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload }));
    }
  }

  heartbeat() {
    setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.send('ping', { timestamp: Date.now() });
      }
    }, 30000);
  }
}

export const wsService = new WebSocketService();