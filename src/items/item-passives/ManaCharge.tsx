import { CC } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class ManaCharge extends Passive {
	passiveName = "Mana Charge";
	public static image = "Tear_of_the_Goddess_item_HD.webp";
	public static MAXSTACKS = 360;
	public static INITIALSTACKS = 360;
	

	private NONCHAMPMANA = 3; //hit everything but champ
	private ISCHAMPMANA = 6; //hit champ

	private maxCharges = 4;
	private charges = this.maxCharges;
	private chargeRate = 8;
	private startTime = 0;
	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		if (sourceChamp.resourceType === ResourceType.Mana) {
			switch (trigger) {
				case PassiveTrigger.IndependentStat:
					let statBuild = sourceChamp!.statBuild;
					statBuild!.addStatShare(Stat.Mana, this.currentStacks, false, StatMathType.Flat, this.primarySource, this.passiveName);
					break;
				case PassiveTrigger.OnAbilityDamage:
					if (this.currentStacks < ManaCharge.MAXSTACKS && this.charges > 0) {
						this.currentStacks = Math.min(ManaCharge.MAXSTACKS, this.currentStacks + this.ISCHAMPMANA);
						if (this.charges === this.maxCharges)
							this.startTime = time!; //start charging when no longer full
						this.charges--;
						sourceChamp.statBuild!.updateStats(sourceChamp);
					}
					break;
				case PassiveTrigger.OnTick:
					if (this.charges < this.maxCharges) {
						if ((time! - this.startTime) % this.chargeRate < TICKTIME) {
							this.charges++;
						}
					}
					break;
				case PassiveTrigger.Reset:
					this.currentStacks = ManaCharge.INITIALSTACKS;
					this.charges = this.maxCharges;
					break;
			}
		}
		
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				Affecting an enemy or ally with an Ability consumes a charge and grants{" "}
				<span className={Stat[Stat.Mana]}>
					{this.NONCHAMPMANA} max Mana
				</span>
				, increased to{" "}
				<span className={Stat[Stat.Mana]}>
					{this.ISCHAMPMANA}{" "}
				</span>
				if the target is a Champion, up to a maximum of{" "}
				<span className={Stat[Stat.Mana]}>
					{ManaCharge.MAXSTACKS} max Mana{this.EnhancedText("(" +this.currentStacks+ ")",statBuild)}
				</span>.
				<br />
				<br />
				Gain a Mana Charge every {this.chargeRate} seconds, up to {this.maxCharges}.
			</span>
		);
	}
}