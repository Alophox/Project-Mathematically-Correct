import { DamageInstance } from "../../builds/DamageInstance";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Glide extends Passive {
	passiveName = "Glide";
	private MSRATIO = .05;
	private flatStat: number = 0;
	private bonusMS: number = 0;
	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion): void{
		if (trigger === PassiveTrigger.IndependentStat) {
			let statBuild = sourceChampion!.statBuild;	
			statBuild?.addStatShare(Stat.MoveSpeedPercent, this.MSRATIO, false, StatMathType.Flat, this.primarySource, this.passiveName);
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		this.flatStat = statBuild?.statNetMap.get(Stat.MoveSpeed)?.flatStat ?? 0;
		this.bonusMS = this.MSRATIO * (this.flatStat);
		return (
			<span>
				Gain{" "}
				<span className={Stat[Stat.MoveSpeed]}>
					{this.MSRATIO * 100}% <StatIcon stat={Stat.MoveSpeed} /> Movement Speed{this.EnhancedText(" (" + this.bonusMS + ")", statBuild)}
				</span>.
			</span>
		);
	}
}