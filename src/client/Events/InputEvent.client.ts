import { UserInputService, Workspace } from "@rbxts/services";
import { Message, messaging } from "shared/messaging";

UserInputService.InputBegan.Connect((input, processed) => {
    if (processed) return

    if (input.UserInputType === Enum.UserInputType.Keyboard) {
        messaging.server.emit(Message.Input, input.KeyCode.Name)
    }

    if (input.UserInputType === Enum.UserInputType.MouseButton1) {
        const ml = UserInputService.GetMouseLocation()
        const unit = Workspace.CurrentCamera?.ViewportPointToRay(ml.X, ml.Y)

        messaging.server.emit(Message.Fire, {
            DirectionVector: unit?.Direction!,
            Origin: unit?.Origin!
        })
    }
})