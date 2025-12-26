import { useAtom } from "@rbxts/react-charm";
import { Players, RunService } from "@rbxts/services";
import { GetGunState } from "shared/state/atoms/GunStates";

export default function useGunState() {
	return useAtom(() => GetGunState(RunService.IsRunning() ? Players.LocalPlayer.Name : "Player1"));
}
