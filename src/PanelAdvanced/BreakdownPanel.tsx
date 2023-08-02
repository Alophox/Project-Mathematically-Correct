import './BreakdownPanel.css';
import '../UIPanel.css';
import '../ToolTip.css';
import { StatBuild } from '../builds/StatBuild';
import { Stat } from '../Stat';
import { Ability, Champion } from '../champions/Champion';
import { StatIcon } from '../icons/TextIcon';
import { StatToolTipTrigger } from '../ToolTip';
import { ToolTipPosition } from '../store/features/ttHoverSlice';
import { useState } from 'react';
import { ToggleButtonState } from '../ToggleButton';
import { DamageInstance } from '../builds/DamageInstance';


enum ShowBreakdown {
	Burst,
	DPS,
	P,
	Q,
	W,
	E,
	R,
}

interface BreakdownPanelProps {
	statBuild: StatBuild,
	champ:Champion,
}

export const BreakdownPanel: React.FC<BreakdownPanelProps> = ({statBuild, champ }) => {

	const [breakdownType, setBreakdownType] = useState<ShowBreakdown>(ShowBreakdown.Burst)

	//console.log("flat: " + (statBuild.statNetMap.get(Stat.Burst)?.flatStat ?? 0));
	//console.log("perc: " + (statBuild.statNetMap.get(Stat.Burst)?.percStat ?? 0));

	function renderSwitch(type: ShowBreakdown) {
		switch (type) {
			case ShowBreakdown.Burst:
			case ShowBreakdown.DPS:
				return (
					<NetBreakdown
						type={type}
						statBuild={statBuild}
					/>
				);
			case ShowBreakdown.P:
			case ShowBreakdown.Q:
			case ShowBreakdown.W:
			case ShowBreakdown.E:
			case ShowBreakdown.R:
				return (
					<AbilityBreakdown
						statBuild={statBuild}
						champ={champ}
						ability={Ability[ShowBreakdown[type] as keyof typeof Ability] }
					/>
				);
			default:
				break;
		}	}

	return (
		<div className="UIPanel DamageBreakdown">
			<div className="UIPanel BreakdownSelector">
				<div className={"BreakdownSelectorButton"}>
					<ToggleButtonState<ShowBreakdown>
						label={"Burst"}
						currentState={breakdownType}
						toSetState={ShowBreakdown.Burst}
						setState={setBreakdownType}
					/>

				</div>
				<div className={"BreakdownSelectorButton"}>
					<ToggleButtonState<ShowBreakdown>
						label={"DPS"}
						currentState={breakdownType}
						toSetState={ShowBreakdown.DPS}
						setState={setBreakdownType}
					/>
				</div>

				<div className={"BreakdownSelectorButton"}>
					<ToggleButtonState<ShowBreakdown>
						label={"P"}
						currentState={breakdownType}
						toSetState={ShowBreakdown.P}
						setState={setBreakdownType}
					/>
				</div>
				<div className={"BreakdownSelectorButton"}>
					<ToggleButtonState<ShowBreakdown>
						label={"Q"}
						currentState={breakdownType}
						toSetState={ShowBreakdown.Q}
						setState={setBreakdownType}
					/>
				</div>
				<div className={"BreakdownSelectorButton"}>
					<ToggleButtonState<ShowBreakdown>
						label={"W"}
						currentState={breakdownType}
						toSetState={ShowBreakdown.W}
						setState={setBreakdownType}
					/>
				</div>
				<div className={"BreakdownSelectorButton"}>
					<ToggleButtonState<ShowBreakdown>
						label={"E"}
						currentState={breakdownType}
						toSetState={ShowBreakdown.E}
						setState={setBreakdownType}
					/>
				</div>
				<div className={"BreakdownSelectorButton"}>
					<ToggleButtonState<ShowBreakdown>
						label={"R"}
						currentState={breakdownType}
						toSetState={ShowBreakdown.R}
						setState={setBreakdownType}
					/>
				</div>
			</div>
			<div className="UIPanel BreakdownTitle">
				{breakdownType === ShowBreakdown.P ? "Passive" : ShowBreakdown[breakdownType]} Breakdown
			</div>
			{renderSwitch(breakdownType) }
		</div>
	);
}

interface NetBreakdownProps {
	type: ShowBreakdown;
	statBuild: StatBuild;
}

const NetBreakdown: React.FC<NetBreakdownProps> = ({type, statBuild }) => {


	let damageShares = new Map<string, Map<string, number>>();

	let damageInstances: DamageInstance[];
	let damageTypeText: string;
	let stat: Stat;
	switch (type) {
		case ShowBreakdown.Burst:
			damageInstances = statBuild.burstInstances;
			damageTypeText = "Damage";
			stat = Stat.Burst;
			break;
		case ShowBreakdown.DPS:
			damageInstances = statBuild.dpsInstances;
			damageTypeText = "DPS";
			stat = Stat.DamagePerSecond;
			break;
		default:
			damageInstances = statBuild.burstInstances;
			damageTypeText = "Damage";
			stat = Stat.Burst;
			break;
	}

	let totalDamage = statBuild.statNetMap.get(stat)?.totalStat ?? 0;
	let physicalDamage = (statBuild.statNetMap.get(stat)?.flatStat ?? 0);
	let magicDamage = (statBuild.statNetMap.get(stat)?.percStat ?? 0) - physicalDamage;
	let trueDamage = totalDamage - (statBuild.statNetMap.get(stat)?.percStat ?? 0);

	let abilityArr = new Array<number>();
	abilityArr[Ability.A] = 0;
	abilityArr[Ability.Q] = 0;
	abilityArr[Ability.W] = 0;
	abilityArr[Ability.E] = 0;
	abilityArr[Ability.R] = 0;
	abilityArr[Ability.I] = 0;


	damageInstances.forEach((DI) => {
		if (
			Ability[DI.instName.charAt(0) as keyof typeof Ability] !== undefined
			&&
			(
				DI.instName.charAt(1) === "" //no char
				||
				!isNaN(parseInt(DI.instName.charAt(1))) //number
			)
		) {
			abilityArr[Ability[DI.instName.charAt(0) as keyof typeof Ability]] += DI.postMitigation;
		} else {
			abilityArr[Ability.I] += DI.postMitigation;
		}
		DI.damageShares.totalStatShares.forEach((share) => {
			let primaryEdited = share.primarySource.replace(/[0-9]/, '');
			let secondary = share.secondarySource;
			if (!damageShares.has(primaryEdited))
				damageShares.set(primaryEdited, new Map<string, number>());
			if (!damageShares.get(primaryEdited)!.has(secondary))
				damageShares.get(primaryEdited)!.set(secondary, 0);

			damageShares.get(primaryEdited)!.set(secondary, share.amount + (damageShares.get(primaryEdited)!.get(secondary)!));
		});
	});

	return (
		<div className="Breakdown">

			<div className="UIPanel HalfDark BreakdownDamageContainer BreakdownText">
				<div className="UIPanel HalfDark">
					Total {damageTypeText}: {parseFloat(totalDamage.toFixed(2))}
				</div>
				<div className="UIPanel HalfDark HorizonBorder BreakdownRow Type">
					<BreakdownCell
						label={"Physical " +damageTypeText +":"}
						value={physicalDamage}
						total={totalDamage}
						addClass="TextPhysical"
					/>
					<BreakdownCell
						label={"Magic " +damageTypeText +":"}
						value={magicDamage}
						total={totalDamage}
						addClass="TextMagic"
					/>
					<BreakdownCell
						label={"True " + damageTypeText + ":"}
						value={trueDamage}
						total={totalDamage}
						addClass="TextTrue"
					/>
				</div>
				<div className={"UIPanel HalfDark"}>
					Total damage from Attacks(A), Abilities(QWER), and Item Passives/Actives(I)
				</div>
				<div className="UIPanel HalfDark HorizonBorder BreakdownRow">
					<BreakdownCell
						label={"A " + damageTypeText + ":"}
						value={abilityArr[Ability.A]}
						total={totalDamage}
						addClass="Ability"
					/>
					<BreakdownCell
						label={"Q " + damageTypeText + ":"}
						value={abilityArr[Ability.Q]}
						total={totalDamage}
						addClass="Ability"
					/>
					<BreakdownCell
						label={"W " + damageTypeText + ":"}
						value={abilityArr[Ability.W]}
						total={totalDamage}
						addClass="Ability"
					/>
					<BreakdownCell
						label={"E " + damageTypeText + ":"}
						value={abilityArr[Ability.E]}
						total={totalDamage}
						addClass="Ability"
					/>
					<BreakdownCell
						label={"R " + damageTypeText + ":"}
						value={abilityArr[Ability.R]}
						total={totalDamage}
						addClass="Ability"
					/>
					<BreakdownCell
						label={"I " + damageTypeText + ":"}
						value={abilityArr[Ability.I]}
						total={totalDamage}
						addClass="Ability"
					/>
				</div>
				<div className={"UIPanel HalfDark"}>
					All damage shares
				</div>
				<DamageShareContainer
					damageShares={damageShares}
					totalDamage={totalDamage }
				/>
			</div>

		</div>
	);
}

interface BreakdownCellProps {
	label: string,
	value: number,
	total: number,
	addClass?: string,
}

const BreakdownCell: React.FC<BreakdownCellProps> = ({ label, value, total, addClass }) => {
	return (
		<div className={"UIPanel HalfDark BreakdownRowCell " + (addClass ?? "")}>
			<div className="label">
				{label}
			</div>
			<div className="value">
				{parseFloat(value.toFixed(2)) + " | " + (total !== 0 ? parseFloat((value / total * 100).toFixed(1)) : 0) + "%"}
			</div>
		</div>
	);
}


interface AbilityBreakdownProps {
	statBuild: StatBuild,
	champ:Champion,
	ability:Ability,
}

const AbilityBreakdown: React.FC<AbilityBreakdownProps> = ({ statBuild,champ,ability }) => {
	//console.log(ability);

	let damageShares = new Map<string, Map<string, number>>();

	let stat = Stat[(Ability[ability]+"Stat") as keyof typeof Stat];

	//let totalDamage = statBuild.statNetMap.get(stat)?.totalStat ?? 0;
	let totalDamage = statBuild.abilityTotals[ability] ?? 0;

	statBuild.abilityInstances[ability]?.forEach((DI) => {
//		if (
//			Ability[DI.instName.charAt(0) as keyof typeof Ability] !== undefined
//			&&
//			(
//				DI.instName.charAt(1) === "" //no char
//				||
//				!isNaN(parseInt(DI.instName.charAt(1))) //number
//			)
//		) {
//			//ability
//
//		} else {
//			//item
//		}
		DI.damageShares.totalStatShares.forEach((share) => {
			let primaryEdited = share.primarySource.replace(/[0-9]/, '');
			let secondary = share.secondarySource;
			if (!damageShares.has(primaryEdited))
				damageShares.set(primaryEdited, new Map<string, number>());
			if (!damageShares.get(primaryEdited)!.has(secondary))
				damageShares.get(primaryEdited)!.set(secondary, 0);

			damageShares.get(primaryEdited)!.set(secondary, share.amount + (damageShares.get(primaryEdited)!.get(secondary)!));
		});
	});

	return (
		<div className="UIPanel HalfDark BreakdownDamageContainer BreakdownText">
			<div className={"UIPanel HalfDark BreakdownText"}>
				{champ.abilityName(ability) }
			</div>
				{/*3*/}	<div className={"TTPanel Dark AlignLeft TextTT"}>
				{/*2*/}	{/*<div className={"UIPanel FullDark TTFont"}>*/}
				{/*1*/}	{/*<div className={"UIPanel FullDark DescriptionText"}>*/}
				{champ.abilityDescription(ability) }
			</div>
			<div className="UIPanel HalfDark">
				Total: {parseFloat(totalDamage.toFixed(2))}
			</div>
			<DamageShareContainer
				damageShares={damageShares }
				totalDamage={totalDamage }
			/>
		</div>
	);
}

interface DamageShareContainerProps {
	damageShares: Map<string, Map<string, number>>,
	totalDamage: number,
}

const DamageShareContainer: React.FC<DamageShareContainerProps> = ({ damageShares, totalDamage}) => {
	return (
		<div className="UIPanel HalfDark DamageShareContainer">
			{
				[...damageShares].map(([primary, primaryMap]) => (
					<FullDamageShare
						primarySource={primary}
						primaryMap={primaryMap}
						netTotal={totalDamage}
						key={primary}
					/>
				))
			}
		</div>
	);
}

interface FullDamageShareProps {
	primarySource: string,
	primaryMap: Map<string, number>
	netTotal:number,
}

const FullDamageShare: React.FC<FullDamageShareProps> = ({ primarySource, primaryMap, netTotal }) => {
	let total: number = 0;
	return (
		<div className={"UIPanel FullDark FullDamageShare"}>
			<div className="UIPanel HalfDark PSourceText">
				{primarySource }
			</div>
			{
				[...primaryMap].map(([secondary, amount]) => {
					total += amount;
					return (
						<DamageShare
							secondarySource={secondary}
							secondaryAmount={amount}
							total={netTotal}
							key={secondary }
						/>
					);
				})
			}
			<DamageShare
				secondarySource={"Total"}
				secondaryAmount={total}
				total={netTotal }
			/>
		</div>
	);
}

interface DamageShareProps {
	secondarySource: string,
	secondaryAmount: number,
	total: number,
}

const DamageShare: React.FC<DamageShareProps> = ({ secondarySource, secondaryAmount, total }) => {
	//console.log(secondarySource);

	function sourceModCleaner(source: string): string {
		//return source.replace(/(Base)|(Level)|(Mythic)/, '').trim();
		if (Stat[source as keyof typeof Stat] === undefined)
			return source.replace(/^\S+/, '').trim(); //match first word up to whitespace
		else
			return source;
	}
	function sourceModOnly(source: string): string {
		return source.replace(sourceModCleaner(source), '');
	}
	return (
		<div className={"UIPanel HalfDark DamageShare " + (secondarySource === "Total" ? "Total" : "")}>
			<div className={"SSourceText" }>
				{
					Stat[sourceModCleaner(secondarySource) as keyof typeof Stat] !== undefined
						?
						<StatToolTipTrigger stat={Stat[sourceModCleaner(secondarySource) as keyof typeof Stat]} toSetTTPosition={ToolTipPosition.Bot } >
							{sourceModOnly(secondarySource) }<StatIcon stat={Stat[sourceModCleaner(secondarySource) as keyof typeof Stat]} />
							{secondarySource.includes("Percent") ? "%" : ""} 
						</StatToolTipTrigger>
						:
						secondarySource
				}
				
			</div>
			<div className={"AmountText" }>
				<span className={"AmountText"}>{secondaryAmount.toFixed(1)}</span> | <span className={"AmountText percent"}>{(((secondaryAmount / total * 100).toFixed(1)) + "%").padStart(5,"\u2002") }</span>
			</div>
		</div>
	);
}

