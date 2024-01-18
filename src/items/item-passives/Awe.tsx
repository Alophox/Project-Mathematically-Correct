import { DamageInstance } from "../../builds/DamageInstance";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { ArchangelsStaff } from "../item-objects";
import { Passive, PassiveTrigger } from "../Passive";

export class Awe extends Passive {
	passiveName = "Awe";
	additionalTip = ""
	private get bonusManaRatio():number {
		if (this.primarySource === ArchangelsStaff.upgradeName) {
			return .02;
		} else {
			return .01;
		}
	}
	private flatStat: number = 0;
	private bonusAP: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion): void {
		if (trigger === PassiveTrigger.DependentStat) {
			let statBuild = sourceChamp!.statBuild;
			this.flatStat = statBuild?.getBonusStat(Stat.Mana) ?? 0;
			//console.log(this.flatStat);
			this.bonusAP = this.bonusManaRatio * (this.flatStat);
			statBuild!.addStatShare(Stat.AbilityPower, this.bonusAP, false, StatMathType.PercAdditive, this.primarySource, this.passiveName);
		}
	}

	public reconcile(otherPassive: this):boolean {
		if(otherPassive.primarySource === ArchangelsStaff.upgradeName)
			this.primarySource = otherPassive.primarySource;
		return false;
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Gain{" "}
				<span className={Stat[Stat.Mana]}>
					{this.bonusManaRatio * 100}% <StatIcon stat={Stat.Mana} /> Bonus Mana{" "}
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