import { Players, Workspace } from "@rbxts/services"
import { Trash } from "@rbxts/trash"
import { GunSettings } from "shared/core/GunSettings"
import { Message, messaging } from "shared/messaging"
import { GetGunState, SetGunState, UpdateGunState } from "shared/state/atoms/GunStates"
import { GetPlayerState } from "shared/state/atoms/PlayerStates"

export class Gun {
    private gun: Tool
    private player: Player
    private trash = new Trash()
    private maxAmmo: number
    private mouse: Mouse | undefined
    private raycastParams = new RaycastParams()
    private gunConfig
    private debounce = false

    constructor(gunInstance: Tool) {
        this.gun = gunInstance
        
        const player = Players.FindFirstChild(this.gun.GetAttribute("Player") as string)
        this.player = player as Player

        this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude
        this.raycastParams.IgnoreWater = true
        this.raycastParams.AddToFilter(this.gun)
        this.raycastParams.AddToFilter(this.player.Character!)

        const defaultState = GunSettings[gunInstance.Name]
        this.gunConfig = defaultState

        this.maxAmmo = defaultState.ammo

        SetGunState(player?.Name!, {
            name: gunInstance.Name,
            equipped: false,
            ammo: defaultState.ammo,
            reserved: defaultState.reserved
        })

        gunInstance.Equipped.Connect((m) => this.OnEquipped(m))
        gunInstance.Unequipped.Connect(() => this.OnUnequipped())
        //gunInstance.Activated.Connect(() => this.Activated())
        gunInstance.Destroying.Once(() => this.trash.destroy())
    }

    private OnEquipped(m: Mouse) {
        UpdateGunState(this.player.Name, (s) => ({
            ...s,
            equipped: true
        }))

        this.ConnectEvents()
        this.mouse = m
        m.TargetFilter = this.player.Character
    }

    private OnUnequipped() {
        UpdateGunState(this.player.Name, (s) => ({
            ...s,
            equipped: false
        }))
        this.DisconnectEvents()
    }

    private Activated(d: Vector3, o: Vector3) {
        if (this.debounce) return
        this.debounce = true

        if (this.GetAmmo()! - 1 >= 0 && GetPlayerState(this.player.Name)?.canUseGun) {
            this.SetAmmo(this.GetAmmo()! - 1)
            this.Fire(d, o)
        }

        task.delay(this.gunConfig.delay, () => this.debounce = false)
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
        this.trash.add(messaging.server.on(Message.Input, (player, keycode) => {
            if (this.player.Name !== player.Name) return
            if (keycode === "R") {
                this.Reload()
            }
        }))

        this.trash.add(messaging.server.on(Message.Fire, (p, {DirectionVector, Origin}) => {
            if (this.player === p)
            this.Activated(DirectionVector, Origin)
        }))
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
    }

    private Fire(DirectionVector: Vector3, Origin: Vector3) {
        if (!this.mouse) return;
        
        const raycast = Workspace.Raycast(Origin, DirectionVector.mul(this.gunConfig.distance), this.raycastParams)
            if (!raycast) return

            const hit = raycast.Instance
            const distance = raycast.Distance
            const position = raycast.Position

            const characterPos = this.player.Character?.PrimaryPart?.Position as Vector3
            
            if (hit.FindFirstAncestorOfClass("Model")) {
                const characterHit = hit.FindFirstAncestorOfClass("Model")
                const human = characterHit!.FindFirstChild("Humanoid") as Humanoid
                human.TakeDamage(this.gunConfig.damage)
            }

            const dist = (position.sub(characterPos)).Magnitude
            const midpoint = characterPos.add(position).div(2)

            const part = new Instance("Part")
            part.Anchored = true
            part.CanCollide = false
            part.Size = new Vector3(0.2, 0.2, dist)
            part.CFrame = CFrame.lookAt(midpoint, position)
            part.Color = new Color3(1,1,0)
            part.Material = Enum.Material.Neon
            part.Parent = Workspace
            part.Transparency = 0.8

            this.raycastParams.AddToFilter(part)
            
            task.delay(0.3, () => part.Destroy())
    }
}