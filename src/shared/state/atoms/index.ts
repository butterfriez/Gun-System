import { flatten } from "@rbxts/charm-sync";
import { GunStatesAtom } from "./GunStates";
import { PlayerStatesAtom } from "./PlayerStates";

export type GlobalAtoms = typeof atoms;

export const atoms = flatten({
	GunStatesAtom,
	PlayerStatesAtom,
});
