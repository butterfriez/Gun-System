import { flatten } from "@rbxts/charm-sync";
import { GunStatesAtom } from "./GunStates";

export type GlobalAtoms = typeof atoms

export const atoms = flatten({
    GunStatesAtom
})