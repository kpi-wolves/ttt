import EventEmitter from "eventemitter3";
import Peer, { DataConnection, PeerErrorType } from "peerjs";
import { markRaw, reactive } from "vue";
import { randomName } from "./names";
import type { Position } from "./playground";
import type { SharedState } from "./state";

export enum MessageType {
  Move = "move",
  State = "settings",
  Rematch = "rematch"
}

export type Message = {
  type: MessageType.Move
  pos: Position
} | {
  type: MessageType.State
  state: SharedState
} | {
  type: MessageType.Rematch
}

export interface Events {
  message: (msg: Message) => void;
  connected: () => void;
}

class Connection extends EventEmitter<Events> {
  slave = false;
  private readonly peer = markRaw(new Peer(randomName()));
  private channel: DataConnection | null = null;

  get id() {
    return this.peer.id;
  }

  get remoteId() {
    return this.channel?.peer;
  }

  get connectLink() {
    const url = new URL(location.href);
    url.hash = this.peer.id;
    return url.href;
  }

  get connected() {
    return this.channel != null;
  }

  init() {
    this.on("message", msg => {
      console.log("MSG", msg);
    });

    this.peer.on("error", err => {
      console.log("PEER ERROR", err.toString());
      const errType: PeerErrorType = (<any>err).type;
      switch (errType) {
        case "peer-unavailable":
          location.hash = "";
      }
    });

    this.peer.on("connection", conn => {
      conn.on("open", () => this.onConnected(conn, false));
    });

    window.addEventListener("hashchange", () => window.location.reload());

    if (location.hash) {
      this.peer.on("open", () => {
        let conn = this.peer.connect(location.hash.substring(1));
        conn.on("open", () => this.onConnected(conn, true));
      });
    }
  }

  send(msg: Message) {
    console.log("Send", msg);
    console.log(this.channel);
    this.channel?.send(msg);
  }

  private onConnected(conn: DataConnection, slave: boolean) {
    if (this.channel) {
      console.log("Already connected", conn);
      conn.close();
    } else {
      console.log("Connected");

      conn.on("close", this.onDisconnected.bind(this));
      conn.on("data", this.onMessage.bind(this));

      this.slave = slave;
      this.channel = markRaw(conn);
      this.emit("connected");
    }
  }

  private onDisconnected() {
    this.channel = null;
    this.slave = false;
    location.hash = "";
  }

  private onMessage(data: unknown) {
    console.log("Message received", data);
    this.emit("message", <Message>data);
  }
}

const connection = reactive(new Connection());
connection.init();
export default connection;
