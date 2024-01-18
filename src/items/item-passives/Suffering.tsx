import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { Passive, PassiveTrigger } from "../Passive";

export class Suffering extends Passive {
	passiveName = "Suffering";
	public static image = "Liandry's_Anguish_item.webp";
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
					if (this.currentStacks < Suffering.MAXSTACKS) {
						//modify current instance
						let extraDamage = damageInst!.preMitigation * this.currentStacks * this.DAMAGERATIOPERSTACK;
						damageInst!.addShare(extraDamage, this.primarySource, this.passiveName);
						damageInst!.addPreMitigationDamage(extraDamage);

						//damageInst!.addTotalShare(, this.primarySource, this.passiveName);
					}
				}
				break;
			case PassiveTrigger.OnTick:
				//passive tick stuff
				if ((time!) >= this.endTime) {
					this.currentStacks = 0;
				} else if (((time! - this.startTime) % this.STACKDURATION) < TICKTIME) {
					if (this.currentStacks < Suffering.MAXSTACKS) {
						this.currentStacks++;
						if (this.currentStacks == Suffering.MAXSTACKS) {
							this.endTime = time! + this.MAXDURATIONSTACKED;
						}
					}
				}
				break;
			case PassiveTrigger.Reset:
				this.endTime = 0;
				if (Suffering.INITIALSTACKS > 0) this.endTime = this.MAXDURATION;
				this.currentStacks = Suffering.INITIALSTACKS;
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				While in combat with Champions, deal {this.DAMAGERATIOPERSTACK * 100}% additional damage, stacking up to {Suffering.MAXSTACKS} times for a maximum bonus of {(this.DAMAGERATIOPERSTACK * Suffering.MAXSTACKS * 100).toFixed(0)}%.{" "}
				Dealing or taking damage refreshes this effect.
			</span>
		)
	}
}