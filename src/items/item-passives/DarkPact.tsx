import { DamageInstance } from "../../builds/DamageInstance";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class DarkPact extends Passive {
	passiveName = "Dark Pact";
	private BONUSHEALTHRATIO = .02;
	private flatStat: number = 0;
	private bonusAP: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion): void {
		if (trigger === PassiveTrigger.DependentStat) {
			let statBuild = sourceChampion!.statBuild;
			this.flatStat = statBuild?.getBonusStat(Stat.Health) ?? 0;
			this.bonusAP = this.BONUSHEALTHRATIO * (this.flatStat);
			statBuild!.addStatShare(Stat.AbilityPower, this.bonusAP, false, StatMathType.PercAdditive, this.primarySource, this.passiveName);
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Gain{" "}
				<span className={Stat[Stat.Health]}>
					{this.BONUSHEALTHRATIO * 100}% <StatIcon stat={Stat.Health} /> Bonus Health{" "}
				</span>
				as{" "}
				<span className={Stat[Stat.AbilityPower]}>
					<StatIcon stat={Stat.AbilityPower} /> Ability Power{this.EnhancedText(" (" + this.bonusAP + ")", statBuild)}
				</span>
				.
			</span>
		);
	}
}