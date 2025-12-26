import { client } from "@rbxts/charm-sync";
import { Message, messaging } from "shared/messaging";
import { atoms } from "shared/state/atoms";

const syncer = client({ atoms });

messaging.client.on(Message.Sync, (data) => {
	syncer.sync(data);
});

messaging.server.emit(Message.Init);
