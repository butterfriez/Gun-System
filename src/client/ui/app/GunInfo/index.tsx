import { useEventListener, useMotion } from "@rbxts/pretty-react-hooks";
import React, { useEffect, useState } from "@rbxts/react";
import { RunService } from "@rbxts/services";
import useGunState from "client/ui/hooks/use-GunState";
import { usePx } from "client/ui/hooks/use-px";

interface InfoTextProps {
	text: React.Binding<string> | string | undefined;
	position: React.Binding<UDim2> | UDim2 | undefined;
}

function InfoText(props: InfoTextProps) {
	const px = usePx();
	const [size, motion] = useMotion(1);

	useEffect(() => {
		motion.spring(1.2);

		task.delay(0.3, () => motion.spring(1));
	}, [props.text]);

	return (
		<textlabel
			BackgroundColor3={Color3.fromRGB(55, 55, 55)}
			BackgroundTransparency={0.6}
			TextSize={10}
			TextStrokeTransparency={0}
			TextColor3={Color3.fromRGB(255, 255, 255)}
			Size={new UDim2(1, 0, 0, px(50))}
			Position={props.position}
			Text={props.text}
			AnchorPoint={new Vector2(0.5, 0.5)}
		>
			<uiscale Scale={size} />
		</textlabel>
	);
}

export default function GunInfo() {
	const px = usePx();
	const gunState = useGunState();
	const [percentage, setPercentage] = useState(1);

	useEventListener(RunService.RenderStepped, () => {
		if (gunState === undefined) return;

		const currentTime = DateTime.now().UnixTimestampMillis;
		const cooldownStart = gunState?.lastTimeUsed!;
		const cooldownDuration = gunState?.cooldown!;

		const pct = math.clamp((currentTime - cooldownStart) / cooldownDuration, 0, 1);
		setPercentage(pct);
	});

	return (
		<frame
			Visible={gunState?.equipped}
			Size={UDim2.fromOffset(px(50), px(200))}
			BackgroundTransparency={1}
			Position={UDim2.fromOffset(px(10), px(200))}
		>
			<frame Size={new UDim2(1, 0, 0, px(10))} BackgroundColor3={Color3.fromRGB(255, 0, 0)}>
				<imagelabel
					Image={""}
					Size={new UDim2(percentage, 0, 1, 0)}
					BackgroundColor3={Color3.fromRGB(0, 255, 0)}
				/>
			</frame>

			<InfoText
				position={new UDim2(0.5, 0, 0, px(40))}
				text={gunState?.ammo !== undefined ? tostring(gunState.ammo) : ""}
			/>
			<InfoText
				position={new UDim2(0.5, 0, 0, px(95))}
				text={gunState?.reserved !== undefined ? tostring(gunState.reserved) : ""}
			/>
		</frame>
	);
}
