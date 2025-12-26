import { server, SyncPayload } from "@rbxts/charm-sync";
import { Message, messaging } from "shared/messaging";
import { atoms, GlobalAtoms } from "shared/state/atoms";

const syncer = server({ atoms });

syncer.connect((player, payload) => {
	messaging.client.emit(player, Message.Sync, FilterPayload(player, payload));
});

messaging.server.on(Message.Init, (player) => {
	syncer.hydrate(player);
});

function FilterPayload(player: Player, payload: SyncPayload<GlobalAtoms>): SyncPayload<GlobalAtoms> {
	if (payload.type === "init") {
		return {
			...payload,
			data: {
				...payload.data,
				GunStatesAtom: {
					[player.Name]: payload.data["GunStatesAtom"][player.Name],
				},
				PlayerStatesAtom: {
					[player.Name]: payload.data["PlayerStatesAtom"][player.Name],
				},
			},
		};
	}

	return {
		...payload,
		data: {
			...payload.data,
			GunStatesAtom: {
				[player.Name]: payload.data["GunStatesAtom"] && payload.data["GunStatesAtom"][player.Name],
			},
			PlayerStatesAtom: {
				[player.Name]: payload.data["PlayerStatesAtom"] && payload.data["PlayerStatesAtom"][player.Name],
			},
		},
	};
}
