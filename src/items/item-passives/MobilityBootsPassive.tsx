import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { MobilityBoots } from "../item-objects/MobilityBoots";
import { Passive, PassiveTrigger } from "../Passive";

export class MobilityBootsPassive extends Passive {
	passiveName = "";
	additionalTip = "";

	private ADDITIONALMS = 90;
	private COOLDOWN = 5;
	private cooldownTime = 0;
	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.cooldownTime === 0) {
					sourceChamp.statBuild!.addStatShare(Stat.MoveSpeedFlat, this.ADDITIONALMS, false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				break;
			case PassiveTrigger.OnDamageDealt:
			case PassiveTrigger.OnDamageTaken:
				if (this.cooldownTime === 0)
					sourceChamp.statBuild!.updateStats(sourceChamp);
				this.cooldownTime = time! + this.COOLDOWN;
				break;
			case PassiveTrigger.OnTick:
				if (this.cooldownTime !== 0 && this.cooldownTime < time!) {
					this.cooldownTime = 0;
					sourceChamp.statBuild!.updateStats(sourceChamp);
				}
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				Gives an additional {this.ADDITIONALMS} <StatIcon stat={Stat.MoveSpeedFlat}/> Move Speed when out of combat(total: {MobilityBoots.stats.get(Stat.MoveSpeedFlat)! + this.ADDITIONALMS})
			</span>
		);
	}
}

