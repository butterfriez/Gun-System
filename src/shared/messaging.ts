import { MessageEmitter } from "@rbxts/tether";
import { SyncPayload } from "@rbxts/charm-sync";
import { GlobalAtoms } from "./state/atoms";

export const messaging = MessageEmitter.create<MessageData>();

export const enum Message {
  Sync,
  Input
}

export interface MessageData {
  [Message.Sync]: SyncPayload<GlobalAtoms>,
  [Message.Input]: string
}