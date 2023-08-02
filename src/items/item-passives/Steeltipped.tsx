import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { TextIcon } from "../../icons/TextIcon";
import { Passive, PassiveTrigger } from "../Passive";

export class Steeltipped extends Passive {
	passiveName = "Steeltipped";
	additionalTip = "Steeltipped does not apply to structures.";
	FLATDAMAGE = 15;


	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAttackHit) {

			let damage: number = this.FLATDAMAGE;

			let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);

			this.addDmgAndPenShares(damage, this.passiveName, damageInst1, sourceChampion!.statBuild!);

			damageInst1.applyLifestealEffectiveness = 1;

			damageInst!.targetChamp.handleDamageInst(damageInst1, time!);
			
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let damage: number = this.FLATDAMAGE;
		return (
			<span>
				Attacks deal an additional{" "}
				<span className="TextMagic">
					{this.FloatPrecision(damage, 2) + " "}
					magic damage{" "}
				</span>
				<span className="OnHit">
					<TextIcon iconName={"OnHit"} /> On-Hit{" "}
				</span>
				to the target.
			</span>
		);
	}
}
