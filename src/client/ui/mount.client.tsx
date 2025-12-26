import { StrictMode } from "@rbxts/react";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import { Players } from "@rbxts/services";
import App from "./app";
import React from "@rbxts/react";

const root = createRoot(new Instance("Folder"));
root.render(
	createPortal(
		<StrictMode>
			<App />
		</StrictMode>,
		Players.LocalPlayer.WaitForChild("PlayerGui"),
	),
);
