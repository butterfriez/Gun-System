import { Players, ReplicatedStorage } from "@rbxts/services";
import { RemoveGunState } from "shared/state/atoms/GunStates";
import { DefaultPlayerState, GetPlayerState, SetPlayerState, UpdatePlayerState } from "shared/state/atoms/PlayerStates";

Players.PlayerAdded.Connect((player) => {
    SetPlayerState(player.Name, DefaultPlayerState)
    
    player.CharacterAdded.Connect(() => {
        UpdatePlayerState(player.Name, (s) => ({
            ...s,
            canUseGun: true
        }))

        const selectedGun = GetPlayerState(player.Name)?.selectedGun
        const gunClone = ReplicatedStorage.Assets[selectedGun!].Clone()
        
        gunClone.AddTag("Gun")
        gunClone.SetAttribute("Player", player.Name)
        gunClone.Parent = player.FindFirstChild("Backpack")
    })

    player.CharacterRemoving.Connect(() => {
        UpdatePlayerState(player.Name, (s) => ({
            ...s,
            canUseGun: false
        }))

        RemoveGunState(player.Name)
    })
})