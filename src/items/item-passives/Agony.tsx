import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Agony extends Passive {
	passiveName = "Agony";
	HEALTHRATIO = .012;
	HEALTHBREAKPOINTS = 125;
	MAXHEALTH = 1250;
	
	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAbilityDamage) {
			if (damageInst?.damageType === DamageType.Magic) {
				if ((Math.floor(Math.min(this.MAXHEALTH, damageInst!.targetChamp.statBuild!.getBonusStat(Stat.Health)) / this.HEALTHBREAKPOINTS) * this.HEALTHRATIO) > 0) {
					let agonyDamage: number = damageInst!.postMitigation * (Math.floor(Math.min(this.MAXHEALTH, damageInst!.targetChamp.statBuild!.getBonusStat(Stat.Health)) / this.HEALTHBREAKPOINTS) * this.HEALTHRATIO);

					damageInst?.addTotalShare(agonyDamage, this.primarySource, this.passiveName);
				}
			}
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		
		return (
			<span>
				Deal{" "}
				<span className="TextMagic">
					(
					<span className="Health">
						0% - 12% (based on target's <StatIcon stat={Stat.Health} /> Bonus Health, max bonus at {this.MAXHEALTH})
					</span>
					) bonus magic damage{" "}
				</span>
				against enemy champions.
			</span>
		);
	}
}
