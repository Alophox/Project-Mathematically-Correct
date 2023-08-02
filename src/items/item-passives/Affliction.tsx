import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";
import { GrievousWounds } from "./GrievousWounds";

export class Affliction extends Passive {
	passiveName = "Affliction";
	DURATION = 3;
	GWRATIO = .4;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnDamageDealt) {
			if (damageInst?.damageType === DamageType.Magic) {
				damageInst!.targetChamp.addBuff(new GrievousWounds(this.primarySource, this.passiveName, time!, this.DURATION, this.GWRATIO, damageInst!.sourceChamp));
			}
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				Dealing{" "}
				<span className="TextMagic">
					magic damage{" "}
				</span>
				to enemy Champions applies Grievous Wounds for {this.DURATION} second{this.DURATION === 1 ? "s" : ""}.
				<br />
				<br />
				Grievous Wounds anti-healing is tracked as <span className="TextTrue">true damage</span> in this calculator, and <StatIcon stat={Stat.Sustain} /> Sustain and related stats are not modified, for ease of comparison between builds.
			</span>
		);
	}
}

