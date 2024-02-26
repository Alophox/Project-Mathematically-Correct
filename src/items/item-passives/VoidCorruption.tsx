import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, RangeType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Riftmaker } from "../item-objects";
import { Passive, PassiveTrigger } from "../Passive";

export class VoidCorruption extends Passive {
	passiveName = "Void Corruption";
	public static image = "Riftmaker_item.webp";
	public static MAXSTACKS = 5;
	private DAMAGERATIOPERSTACK = .02;

	private STACKDURATION: number = 1;

	private MAXDURATION: number = 3;
	private MAXDURATIONSTACKED: number = 5;
	private startTime: number = 0;
	private endTime: number = 0;

	private meleeOmniVamp: number = .1;
	private rangeOmniVamp: number = .06;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.currentStacks == VoidCorruption.MAXSTACKS) {
					sourceChampion!.statBuild!.addStatShare(Stat.Omnivamp,(sourceChampion!.rangeType === RangeType.Melee ? this.meleeOmniVamp : this.rangeOmniVamp), false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				break;

			case PassiveTrigger.OnDamageDealt:
			case PassiveTrigger.OnDamageTaken:
				if (this.endTime < time!) {
					this.startTime = time!;
				}
				this.endTime = (time!) + this.MAXDURATION;
				break;
			case PassiveTrigger.OnDamageHit:
				if (damageInst?.instName !== this.passiveName && this.currentStacks > 0) {
					//if (this.currentStacks < VoidCorruption.MAXSTACKS) {
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
				if ((time!) >= this.endTime && this.currentStacks > 0) {
					this.currentStacks = 0;
					sourceChampion?.statBuild?.updateStats(sourceChampion);
				} else if (((time! - this.startTime) % this.STACKDURATION) < TICKTIME) {
					if (this.currentStacks < VoidCorruption.MAXSTACKS) {
						this.currentStacks++;
						if (this.currentStacks === VoidCorruption.MAXSTACKS) {
							this.endTime = time! + this.MAXDURATIONSTACKED;
							sourceChampion?.statBuild?.updateStats(sourceChampion);
						}
					}
				}
				break;
			case PassiveTrigger.Reset:
				this.endTime = 0;
				if (VoidCorruption.INITIALSTACKS > 0) this.endTime = this.MAXDURATION;
				this.currentStacks = VoidCorruption.INITIALSTACKS;
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				While in combat with Champions, deal {this.DAMAGERATIOPERSTACK * 100}% additional damage, stacking up to {VoidCorruption.MAXSTACKS} times for a maximum bonus of {(this.DAMAGERATIOPERSTACK * VoidCorruption.MAXSTACKS * 100).toFixed(0)}%. While maxed, gain{" "}
				<span className={Stat[Stat.Omnivamp]}>
					{this.RangeSelectorOutput(this.meleeOmniVamp * 100 + "%", this.rangeOmniVamp * 100 + "%", statBuild?.champRangeType)} omnivamp
				</span>.
				Dealing or taking damage refreshes this effect.
			</span>
		)
	}
}