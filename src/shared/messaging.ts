import { MessageEmitter } from "@rbxts/tether";
import { SyncPayload } from "@rbxts/charm-sync";
import { GlobalAtoms } from "./state/atoms";
import { Vector } from "@rbxts/serio";

export const messaging = MessageEmitter.create<MessageData>();

export const enum Message {
  Sync,
  Input,
  Fire
}

export interface MessageData {
  [Message.Sync]: SyncPayload<GlobalAtoms>,
  [Message.Input]: string,
  [Message.Fire]: {
    DirectionVector: Vector,
    Origin: Vector,
  }
}