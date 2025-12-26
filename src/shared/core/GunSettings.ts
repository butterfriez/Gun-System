interface GunSetting {
    ammo: number, reserved: number, damage: 10
}

export const GunSettings: {[k in string]: GunSetting} = {
    ["Default"]: {
        ammo: 5,
        reserved: 10,
        damage: 10
    }
}