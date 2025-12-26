import { UserInputService } from "@rbxts/services";
import { Message, messaging } from "shared/messaging";

UserInputService.InputBegan.Connect((input, processed) => {
    if (processed) return

    if (input.UserInputType === Enum.UserInputType.Keyboard) {
        messaging.server.emit(Message.Input, input.KeyCode.Name)
    }
})