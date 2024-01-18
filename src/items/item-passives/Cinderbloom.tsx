import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Cinderbloom extends Passive {
	passiveName = "Cinderbloom";


	HEALTHRATIO = .35;

	BASEBONUS: number = .2;
	PETDOTBONUS: number = .3;

	additionalTip = "Critical Damage modifiers modify the additional damage from Cinderbloom(40% extra Crit Damage is 40% more damage from Cinderbloom, for " + this.FloatPrecision(this.BASEBONUS*1.4*100,2)+"% or " + this.FloatPrecision(this.PETDOTBONUS*1.4*100,2)+"%).";

	//MINPEN = 10;
	//MAXPEN = 20;
	//MAXPENHEALTH = 1000;
	//MINPENHEALTH = 2500;
	//HEALTHBREAKPOINTS = (this.MINPENHEALTH - this.MAXPENHEALTH) / (this.MAXPEN - this.MINPEN);

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAbilityHit) {
			if (damageInst?.damageType === DamageType.Magic || damageInst?.damageType === DamageType.True) {
				if (damageInst!.targetChamp.currentHealth < damageInst!.targetChamp.statBuild!.getTotalStat(Stat.Health) * this.HEALTHRATIO) {
					let critMult = 1 + sourceChampion!.statBuild!.getBonusStat(Stat.CriticalStrikeDamage);

					let critDamage: number = damageInst!.preMitigation * (damageInst.damageTags & (DamageTag.Pet | DamageTag.Periodic) ? this.PETDOTBONUS : this.BASEBONUS);

					damageInst!.critChanceRatio = 1;

					damageInst!.addShare(critDamage * critMult, this.primarySource, this.passiveName);
					damageInst!.addPreMitigationDamage(critDamage * critMult);

				}

				//if (damageInst.preMitigation > damageInst.postMitigation) { //if there is resistance to pen
				//	let pen: number = Math.min(Math.max(this.MAXPEN - Math.floor((damageInst!.targetChamp.currentHealth - this.MAXPENHEALTH) / this.HEALTHBREAKPOINTS), this.MINPEN), this.MAXPEN);
				//	let resistModPostPen: number = damageInst!.postMitigation / damageInst.preMitigation;
				//	let resist: number = 100 / resistModPostPen - 100 + damageInst.penTotalShares.totalStat;
				//
				//	//console.log("currentHP:" + damageInst!.targetChamp.currentHealth);
				//	//console.log("pen: " + pen + " | " + "prePen: " + (this.MAXPEN -Math.floor((damageInst!.targetChamp.currentHealth - this.MAXPENHEALTH) / this.HEALTHBREAKPOINTS)));
				//
				//	let cinderResistModPostPen = 100 / (100 + resist - Math.min(pen + damageInst.penTotalShares.totalStat, resist));
				//	let cinderPostMitigation = damageInst.preMitigation * cinderResistModPostPen;
				//
				//	damageInst?.addTotalShare( cinderPostMitigation - damageInst.postMitigation, this.primarySource, this.passiveName);
				//}
			}
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				<span className="TextMagic">Magic damage</span> and <span className="TextTrue">true damage</span> dealt to Champions with less than{" "}
				<span className={Stat[Stat.Health]}>
					{this.HEALTHRATIO * 100}% <StatIcon stat={Stat.Health} /> Maximum Health
				</span>{" "}
				<span className={Stat[Stat.CriticalStrikeChance]}>
					<StatIcon stat={Stat.CriticalStrikeChance} /> Critically Strike
				</span>{" "}
				for {this.BASEBONUS * 100}% additional damage, increased to {this.PETDOTBONUS * 100}% for damage over time effects and pets.
			</span>
		);
	}
}
