import { useMemo, useRef, useState } from "react";
import { Champion } from "../champions/Champion";
import { Item } from "../items/Item";
import { ItemBuild } from "./ItemBuild";
import { StatBuild } from "./StatBuild";
import '../UIPanel.css';
import '../ToolTip.css';
import './ChampBuild.css';
import { Stat, StatValueConversion } from "../Stat";
import { StatIcon } from "../icons/TextIcon";
import { StatToolTipTrigger } from "../ToolTip";
import { ToggleButtonStoreAB } from "../ToggleButton";
import { useAppSelector } from "../store/hooks";
import { ToolTipPosition } from "../store/features/ttHoverSlice";
import { ChampBuildObject } from "./ChampBuildObject";

interface ChampBuildProps {
	champBuild: ChampBuildObject,
	champ: Champion,
	target: Champion,
	isEnemy: boolean,
	rerender?: boolean,
	setRerender?: React.Dispatch<React.SetStateAction<boolean>>,
	initialItems?: Array<{ item: Item | undefined }>,
}

export const ChampBuild: React.FC<ChampBuildProps> = ({champBuild, champ, target, isEnemy, rerender, setRerender, initialItems }) => {

	//i couldn't figure out how to do arrays with hooks,
	//so here's an array of hooks...
	const [item0, setItem0] = useState<Item | undefined>(() => initialItems?.at(0)?.item);
	const [item1, setItem1] = useState<Item | undefined>(() => initialItems?.at(1)?.item);
	const [item2, setItem2] = useState<Item | undefined>(() => initialItems?.at(2)?.item);
	const [item3, setItem3] = useState<Item | undefined>(() => initialItems?.at(3)?.item);
	const [item4, setItem4] = useState<Item | undefined>(() => initialItems?.at(4)?.item);
	const [item5, setItem5] = useState<Item | undefined>(() => initialItems?.at(5)?.item);

	let items = new Array(
		{ item: item0 },
		{ item: item1 },
		{ item: item2 },
		{ item: item3 },
		{ item: item4 },
		{ item: item5 },
	);
	let setItems = new Array(
		{ setItem: setItem0 },
		{ setItem: setItem1 },
		{ setItem: setItem2 },
		{ setItem: setItem3 },
		{ setItem: setItem4 },
		{ setItem: setItem5 },
	);

	const advancedStatBuild = useAppSelector((state) => state.advancedBuild.statBuild)
	const prevRender = useRef<ChampBuildObject>();
	useMemo(() => {

		//prevent rerender if the build given is different; this occurs when sorting changes directions, slowing that process down for no reason at all
		if (prevRender.current === champBuild) {
			champBuild.update(champ, target, items);
		} else {
			prevRender.current = champBuild;
		}
		

	}, [item0, item1, item2, item3, item4, item5,rerender]);


	return (
		<div className="UIPanel FullDark ItemBuildContainer">
			<ItemBuild items={items} setItems={setItems} statBuild={champBuild.statBuild} rerender={rerender } setRerender={setRerender } />

			<div className="TextStats StatRowContainer">
				<StatRow
					stat1={isEnemy ? Stat.Armor : Stat.Burst}
					stat2={isEnemy ? Stat.MagicResist : Stat.DamagePerSecond}
					statBuild={champBuild.statBuild}
					loc="Top"
					key="1"
				/>
				<StatRow
					stat1={isEnemy ? Stat.EffectiveHealthPhysical : Stat.EffectiveHealth}
					stat2={isEnemy ? Stat.EffectiveHealthMagic : Stat.Sustain}
					statBuild={champBuild.statBuild}
					key="2"
				/>
				<StatRow
					stat1={Stat.Cost}
					stat2={isEnemy ? Stat.Health : Stat.DuelingScore}
					statBuild={champBuild.statBuild}
					loc="Bot"
					key="3"
				/>
					
			</div>
			<ToggleButtonStoreAB
				label={"View Build Stats"}
				currentState={{ statBuild: advancedStatBuild, champ: champ }}
				toSetState={{ statBuild: champBuild.statBuild, champ:champ}}
			/>
		</div>
	);
}

interface StatRowProps {
	stat1: Stat,
	stat2: Stat,
	statBuild: StatBuild,
	loc?: string;
}
const StatRow: React.FC<StatRowProps> = ({ stat1, stat2, statBuild, loc }) => {
	return (
		<div className={"UIPanel FullDark HorizonBorder StatRow " + loc}>
			<div className="StatContainer">
				<StatViewer stat={stat1} statBuild={statBuild} />
			</div>
			<div className="StatContainer">
				<StatViewer stat={stat2} statBuild={statBuild} />
			</div>
		</div>
	);
}

interface StatViewerProps {
	stat: Stat,
	statBuild: StatBuild,
}
const StatViewer: React.FC<StatViewerProps> = ({stat, statBuild }) => {
	return (
		<StatToolTipTrigger stat={stat} toSetTTPosition={ToolTipPosition.Right } >
			<StatIcon stat={stat}/> {StatValueConversion(stat, statBuild) }
		</StatToolTipTrigger>
	);
}