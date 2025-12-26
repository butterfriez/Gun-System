interface GunSetting {
    ammo: number, reserved: number, damage: 10, distance: number, delay: number
}

export const GunSettings: {[k in string]: GunSetting} = {
    ["Default"]: {
        ammo: 5,
        reserved: 10,
        damage: 10,
        distance: 1000,
        delay: 0.2
    }
}