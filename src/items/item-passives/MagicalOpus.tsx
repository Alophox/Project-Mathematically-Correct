import { DamageInstance } from "../../builds/DamageInstance";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class MagicalOpus extends Passive {
	passiveName = "Magical Opus";
	private APRATIO = .35;
	private flatStat: number = 0;
	private bonusAP: number = 0;
	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion): void {
		if (trigger === PassiveTrigger.CapstoneStat) {
			let statBuild = sourceChampion!.statBuild;
			this.flatStat = statBuild?.statNetMap.get(Stat.AbilityPower)?.flatStat ?? 0;
			this.bonusAP = this.APRATIO * (this.flatStat);
			statBuild?.addStatShare(Stat.AbilityPower, this.bonusAP, false, StatMathType.PercMultiplicative, this.primarySource, this.passiveName);
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Gain{" "}
				<span className={Stat[Stat.AbilityPower]}>
					{this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} /> total Ability Power{this.EnhancedText(" (" + this.bonusAP + ")", statBuild)}
				</span>.
			</span>
		);
	}
}