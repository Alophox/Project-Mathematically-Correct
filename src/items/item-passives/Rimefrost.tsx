import { start } from "repl";
import { CC, CrowdControl } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Rimefrost extends Passive {
	passiveName = "Rimefrost";

	DURATION = 1;
	SLOWRATIO = .3;
	cc = new CrowdControl(CC.Slow, this.DURATION, this.SLOWRATIO);

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAbilityDamage) {

			damageInst?.targetChamp.addCrowdControl(this.cc);
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				Dealing Ability damage slows the target by {this.SLOWRATIO * 100}% for {this.DURATION} second{this.DURATION === 1 ? "s" : ""}.
			</span>
		);
	}
}