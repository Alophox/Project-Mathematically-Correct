import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class IcathianBite extends Passive {
	passiveName = "Icathian Bite";
	additionalTip = "Icathian Bite does not apply to structures.";
	FLATDAMAGE = 15;
	APRATIO = .2;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAttackHit) {
			let statBuild = sourceChampion?.statBuild;

			let damage: number = this.FLATDAMAGE + (this.APRATIO * statBuild!.getTotalStat(Stat.AbilityPower));

			let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);

			this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

			damageInst1.applyLifestealEffectiveness = 1;

			damageInst!.targetChamp.handleDamageInst(damageInst1, time!);

		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apDamage = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		return (
			<span>
				Attacks deal an additional{" "}
				<span className="TextMagic">
					{this.EnhancedText((this.FloatPrecision(apDamage + this.FLATDAMAGE,2)) + " = ", statBuild)}(
					<span className="Base">
						{this.FLATDAMAGE}{" "}
					</span>
					<span className={Stat[Stat.AbilityPower]}>
						+ {this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} />{this.EnhancedText(" (" + (this.FloatPrecision(apDamage,2)) + ")", statBuild)}
					</span>
					) magic damage{" "}
				</span>
				<span className="OnHit">
					<TextIcon iconName={"OnHit"} /> On-Hit{" "}
				</span>
				to the target.
			</span>
		);
	}
}
