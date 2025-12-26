import { atom } from "@rbxts/charm";

export interface GunState {
	name: string;
	equipped: boolean;
	ammo: number;
	reserved: number;
	lastTimeUsed: number;
	cooldown: number;
}

export const GunStatesAtom = atom<{ [k in string]: GunState | undefined }>({});

export function GetGunState(player: string) {
	return GunStatesAtom()[player];
}

export function UpdateGunState(player: string, updater: (s: GunState) => GunState) {
	GunStatesAtom((state) => ({
		...state,
		[player]: state[player] && updater(state[player]),
	}));
}

export function RemoveGunState(player: string) {
	GunStatesAtom((state) => ({
		...state,
		[player]: undefined,
	}));
}

export function SetGunState(player: string, setState: GunState) {
	GunStatesAtom((state) => ({
		...state,
		[player]: setState,
	}));
}
