import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class RodOfAgesPassive extends Passive {
	passiveName = "";
	static image = "Rod_of_Ages_item_HD.webp";
	additionalTip = "Eternity tooltip reflects this increase when it is applied.";
	public static INITIALSTACKS = 10;
	public static MAXSTACKS = 10;

	private secondarySourceName = "Stacking "

	private STACKDURATION = 60;
	private STACKEDINCREASE = 1.5;

	private HEALTHPERSTACK = 20;
	private MANAPERSTACK = 20;
	private APPERSTACK = 4;

	private startTime = 0 - this.STACKDURATION * RodOfAgesPassive.INITIALSTACKS;


	public eternityMultiplier:number = 1;

	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				let statBuild = sourceChamp?.statBuild!;
				//	console.log(this.currentStacks);
				statBuild.addStatShare(Stat.Health, this.HEALTHPERSTACK * this.currentStacks, false, StatMathType.Flat, this.primarySource, this.secondarySourceName + Stat[Stat.Health]);
				statBuild.addStatShare(Stat.Mana, this.MANAPERSTACK * this.currentStacks, false, StatMathType.Flat, this.primarySource, this.secondarySourceName + Stat[Stat.Mana]);
				statBuild.addStatShare(Stat.AbilityPower, this.APPERSTACK * this.currentStacks, false, StatMathType.Flat, this.primarySource, this.secondarySourceName + Stat[Stat.AbilityPower]);
				break;
			case PassiveTrigger.OnTick:
				if ((this.currentStacks < RodOfAgesPassive.MAXSTACKS) && (((time! - this.startTime) % this.STACKDURATION) < TICKTIME)) {
					this.currentStacks = Math.floor((time! - this.startTime) / this.STACKDURATION);
					sourceChamp.statBuild!.updateStats(sourceChamp);
				}
				break;
			case PassiveTrigger.Reset:
				this.startTime = 0 - this.STACKDURATION * RodOfAgesPassive.INITIALSTACKS;
				this.currentStacks = RodOfAgesPassive.INITIALSTACKS;
				this.eternityMultiplier = (this.currentStacks === RodOfAgesPassive.MAXSTACKS) ? this.STACKEDINCREASE : 1
			//console.log(this.currentStacks);
				break;
		}
		
	}

	DescriptionElement = (statBuild?: StatBuild) => {

		return (
			<span>
				This item gains{" "}
				<span className={Stat[Stat.Health]}>
					{this.HEALTHPERSTACK} <StatIcon stat={Stat.Health} /> Bonus Health{this.EnhancedText(" (" + (this.HEALTHPERSTACK * this.currentStacks) + ")", statBuild)}
				</span>
				,{" "}
				<span className={Stat[Stat.Mana]}>
					{this.MANAPERSTACK} <StatIcon stat={Stat.Mana} /> Bonus Mana{this.EnhancedText(" (" + (this.MANAPERSTACK * this.currentStacks) + ")", statBuild)}
				</span>
				, and{" "}
				<span className={Stat[Stat.AbilityPower]}>
					{this.APPERSTACK} <StatIcon stat={Stat.AbilityPower} /> Ability Power{this.EnhancedText(" (" + (this.APPERSTACK * this.currentStacks) + ")", statBuild)}{" "}
				</span>
				every {this.STACKDURATION} seconds, up to {RodOfAgesPassive.MAXSTACKS} times. Upon reaching max stacks, gain a level and increase the effects of Eternity by {(this.STACKEDINCREASE - 1) * 100}%.
			</span>
		);
	}
}

