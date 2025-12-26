import { Players } from "@rbxts/services"
import { Trash } from "@rbxts/trash"
import { GunSettings } from "shared/core/GunSettings"
import { Message, messaging } from "shared/messaging"
import { GetGunState, SetGunState, UpdateGunState } from "shared/state/atoms/GunStates"

export class Gun {
    private gun: Tool
    private player: Player
    private trash = new Trash()
    private maxAmmo: number

    constructor(gunInstance: Tool) {
        this.gun = gunInstance
        
        const player = Players.FindFirstChild(this.gun.GetAttribute("Player") as string)
        this.player = player as Player

        const defaultState = GunSettings[gunInstance.Name]

        this.maxAmmo = defaultState.ammo

        SetGunState(player?.Name!, {
            name: gunInstance.Name,
            equipped: false,
            ammo: defaultState.ammo,
            reserved: defaultState.reserved
        })

        gunInstance.Equipped.Connect((m) => this.OnEquipped(m))
        gunInstance.Unequipped.Connect(() => this.OnUnequipped())
        gunInstance.Activated.Connect(() => this.Activated())
        gunInstance.Destroying.Once(() => this.trash.destroy())
    }

    private OnEquipped(m: Mouse) {
        UpdateGunState(this.player.Name, (s) => ({
            ...s,
            equipped: true
        }))

        this.ConnectEvents()
    }

    private OnUnequipped() {
        UpdateGunState(this.player.Name, (s) => ({
            ...s,
            equipped: false
        }))
        this.DisconnectEvents()
    }

    private Activated() {
        if (this.GetAmmo()! - 1 >= 0) {
            this.SetAmmo(this.GetAmmo()! - 1)
        }
    }

    private SetAmmo(ammo: number) {
        UpdateGunState(this.player.Name, (s) => ({
            ...s,
            ammo: ammo
        }))
    }

    private GetAmmo() {
        return GetGunState(this.player.Name)?.ammo
    }

    private GetEquipped() {
        return GetGunState(this.player.Name)?.equipped
    }

    private ConnectEvents() {
        const connection = messaging.server.on(Message.Input, (player, keycode) => {
            if (this.player.Name !== player.Name) return
            if (keycode === "R") {
                this.Reload()
            }
        })
        this.trash.add(connection)
    }

    private DisconnectEvents() {
        this.trash.purge()
    }

    private Reload() {
        if (!this.GetEquipped()) return

        const gunState = GetGunState(this.player.Name)
        const neededAmmo = this.maxAmmo - this.GetAmmo()!
        const newReserved = gunState?.reserved! - neededAmmo

        if (newReserved > -1) {
            this.SetAmmo(this.GetAmmo()! + neededAmmo)
            UpdateGunState(this.player.Name, (s) => ({
                ...s,
                reserved: newReserved
            }))
        } else {
            this.SetAmmo(this.GetAmmo()! + gunState?.reserved!)
            UpdateGunState(this.player.Name, (s) => ({
                ...s,
                reserved: 0
            }))
        }

        print(GetGunState(this.player.Name))
    }
}