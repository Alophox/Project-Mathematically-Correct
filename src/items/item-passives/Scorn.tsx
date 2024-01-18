import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Scorn extends Passive {
	passiveName = "Scorn";
	private UltAbilityHaste = 20;
	private flatStat: number = 0;
	private bonusMS: number = 0;
	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion): void{
		if (trigger === PassiveTrigger.IndependentStat) {
			let statBuild = sourceChampion!.statBuild;	
			statBuild?.addStatShare(Stat.UltimateAbilityHaste, this.UltAbilityHaste, false, StatMathType.Flat, this.primarySource, this.passiveName);
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Gain{" "}
				<span className={Stat[Stat.UltimateAbilityHaste]}>
					{this.UltAbilityHaste} <StatIcon stat={Stat.UltimateAbilityHaste} /> Ultimate Ability Haste.
				</span>.
			</span>
		);
	}
}