import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { Passive, PassiveTrigger } from "../Passive";

export class Madness extends Passive {
	passiveName = "Madness";
	public static image = "Haunting_Guise_item_HD.webp";
	public static MAXSTACKS = 3;
	//triggers = PassiveTrigger.OnDamageDealt;
	private DAMAGERATIOPERSTACK = .02;

	private STACKDURATION: number = 1;

	private MAXDURATION: number = 3;
	private MAXDURATIONSTACKED: number = 5;
	private startTime: number = 0;
	private endTime: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {
		switch (trigger) {
			case PassiveTrigger.OnDamageDealt:
			case PassiveTrigger.OnDamageTaken:
				if (this.endTime < time!) {
					this.startTime = time!;
				}
				this.endTime = (time!) + this.MAXDURATION;
				break;
			case PassiveTrigger.OnDamageHit:
				if (damageInst?.instName !== this.passiveName && this.currentStacks > 0) {
					//if (this.currentStacks < Madness.MAXSTACKS) {
						//modify current instance
						let extraDamage = damageInst!.preMitigation * this.currentStacks * this.DAMAGERATIOPERSTACK;
						damageInst!.addShare(extraDamage, this.primarySource, this.passiveName);
						damageInst!.addPreMitigationDamage(extraDamage);

						//damageInst!.addTotalShare(, this.primarySource, this.passiveName);
					//}
				}
				break;
			case PassiveTrigger.OnTick:
				//passive tick stuff
				if ((time!) >= this.endTime) {
					this.currentStacks = 0;
				} else if (((time! - this.startTime) % this.STACKDURATION) < TICKTIME) {
					if (this.currentStacks < Madness.MAXSTACKS) {
						this.currentStacks++;
						if (this.currentStacks === Madness.MAXSTACKS) {
							this.endTime = time! + this.MAXDURATIONSTACKED;
						}
					}
				}
				break;
			case PassiveTrigger.Reset:
				this.endTime = 0;
				if (Madness.INITIALSTACKS > 0) this.endTime = this.MAXDURATION;
				this.currentStacks = Madness.INITIALSTACKS;
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				While in combat with Champions, deal {this.DAMAGERATIOPERSTACK * 100}% additional damage, stacking up to {Madness.MAXSTACKS} times for a maximum bonus of {(this.DAMAGERATIOPERSTACK * Madness.MAXSTACKS * 100).toFixed(0)}%.{" "}
				Dealing or taking damage refreshes this effect.
			</span>
		)
	}
}