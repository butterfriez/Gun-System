import { atom } from "@rbxts/charm";

export interface PlayerState {
	selectedGun: string;
	canUseGun: boolean;
}

export const DefaultPlayerState: PlayerState = {
	selectedGun: "Default",
	canUseGun: false,
};

export const PlayerStatesAtom = atom<{ [k in string]: PlayerState | undefined }>({});

export function GetPlayerState(player: string) {
	return PlayerStatesAtom()[player];
}

export function UpdatePlayerState(player: string, updater: (s: PlayerState) => PlayerState) {
	PlayerStatesAtom((state) => ({
		...state,
		[player]: state[player] && updater(state[player]),
	}));
}

export function RemovePlayerState(player: string) {
	PlayerStatesAtom((state) => ({
		...state,
		[player]: undefined,
	}));
}

export function SetPlayerState(player: string, setState: PlayerState) {
	PlayerStatesAtom((state) => ({
		...state,
		[player]: setState,
	}));
}
