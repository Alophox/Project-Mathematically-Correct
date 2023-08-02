import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Riftmaker } from "../item-objects";
import { Passive, PassiveTrigger } from "../Passive";

export class VoidCorruption extends Passive {
	passiveName = "Void Corruption";
	public static image = "Riftmaker_item.webp";
	public static MAXSTACKS = 3;
	//triggers = PassiveTrigger.OnDamageDealt;
	private DAMAGERATIOPERSTACK = .03;

	private STACKDURATION: number = 1;

	private MAXDURATION: number = 3;
	private MAXDURATIONSTACKED: number = 5;
	private startTime: number = 0;
	private endTime: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {
		if (trigger === PassiveTrigger.OnDamageDealt || trigger === PassiveTrigger.OnDamageTaken) {
			if (this.endTime < time!) {
				this.startTime = time!;
			}
			this.endTime = (time!) + ((this.currentStacks === VoidCorruption.MAXSTACKS) ? this.MAXDURATIONSTACKED : this.MAXDURATION);
			if (trigger === PassiveTrigger.OnDamageDealt) {
				if (damageInst?.instName !== this.passiveName && this.currentStacks > 0) {
					if (this.currentStacks < VoidCorruption.MAXSTACKS) {
						//modify current instance
						damageInst!.addTotalShare(damageInst!.postMitigation * this.currentStacks * this.DAMAGERATIOPERSTACK, this.primarySource, this.passiveName);
					} else {
						//create new instance for true damage
						let damage: number = damageInst!.preMitigation * this.currentStacks * this.DAMAGERATIOPERSTACK;

						let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.True, damage, time!, damageInst!.castInstance, DamageTag.Item);

						this.addDmgAndPenShares(damage, this.passiveName, damageInst1, sourceChampion!.statBuild!);

						damageInst1.applyLifestealEffectiveness = 1;

						damageInst!.targetChamp.handleDamageInst(damageInst1, time!);
					}
				}
				
			}
		}
		else if (trigger === PassiveTrigger.OnTick) {
			//passive tick stuff
			if ((time!) >= this.endTime) {
				this.currentStacks = 0;
			} else if (((time! - this.startTime) % this.STACKDURATION) < TICKTIME) {
				if (this.currentStacks < VoidCorruption.MAXSTACKS) {
					this.currentStacks++;
				}
			}

		}
		else if (trigger === PassiveTrigger.Reset) {
			this.endTime = 0;
			if (VoidCorruption.INITIALSTACKS > 0) this.endTime = this.MAXDURATION;
			this.currentStacks = VoidCorruption.INITIALSTACKS;	
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				While in combat with Champions, deal {this.DAMAGERATIOPERSTACK * 100}% additional damage, stacking up to {VoidCorruption.MAXSTACKS} times for a maximum bonus of {(this.DAMAGERATIOPERSTACK * VoidCorruption.MAXSTACKS * 100).toFixed(0)}%. While maxed, the extra damage is converted to{" "}
				<span className={"TextTrue"}>
					true damage
				</span>.
				Dealing or taking damage refreshes this effect.
			</span>
		)
	}
}