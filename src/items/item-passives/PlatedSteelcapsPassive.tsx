import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class PlatedSteelcapsPassive extends Passive {
	passiveName = "";
	additionalTip = "";

	private BASICDAMAGEREDUCTION = .12;

	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.OnDamageTaken:
				//console.log("triggered");
				if(damageInst!.damageTags & DamageTag.BasicAttack)
					damageInst?.modPostMitDamage(1 - this.BASICDAMAGEREDUCTION);
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				Reduces incoming damage from Attacks by {this.BASICDAMAGEREDUCTION * 100}%.
			</span>
		);
	}
}

