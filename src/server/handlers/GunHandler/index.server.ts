import { CollectionService } from "@rbxts/services";
import { Gun } from "./GunClass";

const guns: Tool[] = CollectionService.GetTagged("Gun") as Tool[]

CollectionService.GetInstanceAddedSignal("Gun").Connect((i) => {
    new Gun(i as Tool)
})

guns.forEach((gun) => {
    new Gun(gun)
})
