import React, { useEffect, useState } from "@rbxts/react";
import ReactRoblox from "@rbxts/react-roblox";
import { CreateReactStory, InferProps, Slider } from "@rbxts/ui-labs";
import GunInfo from "../app/GunInfo";
import { SetGunState, UpdateGunState } from "shared/state/atoms/GunStates";
import { usePx } from "client/ui/hooks/use-px";

const controls = {
	ammo: Slider(10, 0, 10, 1),
	reserved: Slider(50, 0, 50, 1),
	equipped: true,
};

export = CreateReactStory(
	{
		react: React,
		reactRoblox: ReactRoblox,
		controls,
	},
	(props: InferProps<typeof controls>) => {
		const px = usePx();
		const [lastTimeUsed, setLastTimeUsed] = useState(DateTime.now().UnixTimestampMillis);

		SetGunState("Player1", {
			name: "Default",
			equipped: props.controls.equipped,
			ammo: props.controls.ammo,
			reserved: props.controls.reserved,
			lastTimeUsed: lastTimeUsed,
			cooldown: 200,
		});

		return (
			<React.Fragment>
				<GunInfo />

				<textbutton
					Size={UDim2.fromOffset(px(50), px(50))}
					Position={UDim2.fromScale(0.5, 1)}
					AnchorPoint={new Vector2(0.5, 1)}
					Text={"Use Gun"}
					Event={{
						Activated: () => {
							setLastTimeUsed(DateTime.now().UnixTimestampMillis);
						},
					}}
				/>
			</React.Fragment>
		);
	},
);
