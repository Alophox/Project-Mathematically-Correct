import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Cinderbloom extends Passive {
	passiveName = "Cinderbloom";
	additionalTip = "Cinderbloom acts like Magic Penetration, but instead adds damage as if the pen was there.";
	MINPEN = 10;
	MAXPEN = 20;
	MAXPENHEALTH = 1000;
	MINPENHEALTH = 2500;
	HEALTHBREAKPOINTS = (this.MINPENHEALTH - this.MAXPENHEALTH) / (this.MAXPEN - this.MINPEN);

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnDamageDealt) {
			if (damageInst?.damageType === DamageType.Magic) {
				if (damageInst.preMitigation > damageInst.postMitigation) { //if there is resistance to pen
					let pen: number = Math.min(Math.max(this.MAXPEN - Math.floor((damageInst!.targetChamp.currentHealth - this.MAXPENHEALTH) / this.HEALTHBREAKPOINTS), this.MINPEN), this.MAXPEN);
					let resistModPostPen: number = damageInst!.postMitigation / damageInst.preMitigation;
					let resist: number = 100 / resistModPostPen - 100 + damageInst.penTotalShares.totalStat;

					//console.log("currentHP:" + damageInst!.targetChamp.currentHealth);
					//console.log("pen: " + pen + " | " + "prePen: " + (this.MAXPEN -Math.floor((damageInst!.targetChamp.currentHealth - this.MAXPENHEALTH) / this.HEALTHBREAKPOINTS)));

					let cinderResistModPostPen = 100 / (100 + resist - Math.min(pen + damageInst.penTotalShares.totalStat, resist));
					let cinderPostMitigation = damageInst.preMitigation * cinderResistModPostPen;

					damageInst?.addTotalShare( cinderPostMitigation - damageInst.postMitigation, this.primarySource, this.passiveName);
				}
			}
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				Magic damage dealt to Champions has an additional{" "}
				<span className={Stat[Stat.MagicPenetrationFlat]}>
					(
					<span className="Health">
						{this.MINPEN} - {this.MAXPEN} (based on target's <StatIcon stat={Stat.Health} /> Bonus Health, max bonus at {this.MINPENHEALTH})
					</span>
					) magic penetration
				</span>.
			</span>
		);
	}
}
