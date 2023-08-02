import { DamageInstance } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Safeguard extends Passive {
	passiveName = "Safeguard";
	additionalTip = "Cooldown is restarted when damage is taken from Champions."
	static LINGERDURATION: number = 1.5;
	DAMAGEREDUCTION: number = .75;
	static COOLDOWN: number = 40;
	cooldownTime: number = 0;
	linger: number = 0;
	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnDamageTaken) {
			let statBuild = sourceChampion!.statBuild!;
			if (this.cooldownTime < time! || this.linger > time! ) {
				damageInst!.modPostMitDamage(1 - this.DAMAGEREDUCTION);
			}
			this.cooldownTime = time! + Safeguard.COOLDOWN * (1 - statBuild.getCDR(CDRType.Item));
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				When active you are considered Safeguarded, which reduces incoming Champion damage by 75%, lingering for {Safeguard.LINGERDURATION} seconds after taking damage from a Champion({Safeguard.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
			</span>
		);
	}
}