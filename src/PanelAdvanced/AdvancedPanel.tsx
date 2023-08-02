import { StatBuild } from "../builds/StatBuild";
import { StatIcon } from "../icons/TextIcon";
import { Stat, StatValueConversion } from "../Stat";
import { StatToolTipTrigger } from "../ToolTip";
import '../builds/ChampBuild.css';
import './AdvancedPanel.css';
import '../UIPanel.css';
import { ToolTipPosition } from "../store/features/ttHoverSlice";
import { useAppSelector } from "../store/hooks";
import { BreakdownPanel } from "./BreakdownPanel";
interface AdvancedPanelProps {
}

export const AdvancedPanel: React.FC<AdvancedPanelProps> = ({ }) => {

	const statBuild = useAppSelector((state) => state.advancedBuild.statBuild);
	const champ = useAppSelector((state) => state.advancedBuild.champ);
	

	return (
		<div className="AdvancedPanel">
			<BreakdownPanel
				statBuild={statBuild}
				champ={champ }
			/>
			<div className="UIPanel HalfDark StatColumnContainer">
				<div className="StatColumnPair">
					<StatColumn
						stats={new Array<Stat>(
							Stat.Health, Stat.Mana,
							Stat.AttackDamage, Stat.AbilityPower,
							Stat.Armor, Stat.MagicResist,
							Stat.AttackSpeed, Stat.AbilityHaste,
							Stat.CriticalStrikeChance, Stat.MoveSpeed
						)}
						statBuild={statBuild}
						toSetTTPosition={ToolTipPosition.Top}
					/>
					<StatColumn
						stats={new Array<Stat>(
							Stat.HealthRegen, Stat.ManaRegen,
							Stat.LifeSteal, Stat.Vamp,
							Stat.ArmorPenetration, Stat.MagicPenetration,
							Stat.HealShieldPower, Stat.Cost,
							Stat.CriticalStrikeDamage, Stat.Tenacity
						)}
						statBuild={statBuild}
						toSetTTPosition={ToolTipPosition.Top}
					/>
				</div>
				<div className="StatColumnPair">
					<StatColumn
						stats={new Array<Stat>(
							Stat.Burst, Stat.DamagePerSecond,
							Stat.Sustain, Stat.SustainGrievousWounds,
							Stat.EffectiveHealthPhysical, Stat.EffectiveHealthMagic,
							Stat.EffectiveHealth, Stat.Unknown,
							Stat.DuelingScore, Stat.Unknown
						)}
						statBuild={statBuild}
						toSetTTPosition={ToolTipPosition.Top}
					/>
					<StatColumn
						stats={new Array<Stat>(
							Stat.Unknown, Stat.Unknown,
							Stat.Unknown, Stat.Unknown,
							Stat.Unknown, Stat.Unknown,
							Stat.Unknown, Stat.Unknown,
							Stat.Unknown, Stat.Unknown
						)}
						statBuild={statBuild}
						toSetTTPosition={ToolTipPosition.Top}
					/>
				</div>
			</div>
		</div>
	);
}

interface StatColumnProps {
	/**
	 * ten entries
	 */
	stats: Stat[],
	statBuild: StatBuild,
	toSetTTPosition: ToolTipPosition,
}
const StatColumn: React.FC<StatColumnProps> = ({ stats, statBuild, toSetTTPosition }) => {
	return (
		<div className="TextStats StatRowContainer">
			<StatRow
				stat1={stats[0]}
				stat2={stats[1]}
				statBuild={statBuild}
				toSetTTPosition={toSetTTPosition}
				loc="Top"
			/>
			<StatRow
				stat1={stats[2]}
				stat2={stats[3]}
				statBuild={statBuild}
				toSetTTPosition={toSetTTPosition}
			/>
			<StatRow
				stat1={stats[4]}
				stat2={stats[5]}
				statBuild={statBuild}
				toSetTTPosition={toSetTTPosition}
			/>
			<StatRow
				stat1={stats[6]}
				stat2={stats[7]}
				statBuild={statBuild}
				toSetTTPosition={toSetTTPosition}
			/>
			<StatRow
				stat1={stats[8]}
				stat2={stats[9]}
				statBuild={statBuild}
				toSetTTPosition={toSetTTPosition}
				loc="Bot"
			/>
		</div>
	);
}

interface StatRowProps {
	stat1: Stat,
	stat2: Stat,
	statBuild: StatBuild,
	toSetTTPosition: ToolTipPosition,
	loc?: string;
}
/**
 * StatRow css is located in ChampBuild.css, as it's a copy of the champ build mini stat viewer; StatRowContainer is overwritten here, however
 * @param param0
 * @returns
 */
const StatRow: React.FC<StatRowProps> = ({ stat1, stat2, statBuild, toSetTTPosition, loc }) => {
	return (
		<div className={"UIPanel FullDark StatRow " + loc}>
			<div className="StatContainer">
				{
					stat1 !== Stat.Unknown && (
						<StatViewer stat={stat1} statBuild={statBuild} toSetTTPosition={toSetTTPosition} />
					)
				}
			</div>
			<div className="StatContainer">
				{
					stat2 !== Stat.Unknown && (
						<StatViewer stat={stat2} statBuild={statBuild} toSetTTPosition={toSetTTPosition} />
					)
				}
				</div>
		</div>
	);
}

interface StatViewerProps {
	stat: Stat,
	statBuild: StatBuild,
	toSetTTPosition: ToolTipPosition,
}
const StatViewer: React.FC<StatViewerProps> = ({ stat, statBuild, toSetTTPosition }) => {

	return (
		<StatToolTipTrigger stat={stat} toSetTTPosition={toSetTTPosition } >
			<StatIcon stat={stat} /> {StatValueConversion(stat, statBuild)}
		</StatToolTipTrigger>
	);
}