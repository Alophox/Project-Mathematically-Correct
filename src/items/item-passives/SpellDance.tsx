import { DamageInstance } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class SpellDance extends Passive {
	passiveName = "Spelldance";
	public static image = "Cosmic_Drive_item_HD.webp";
	//public static MAXSTACKS = 4;
	//triggers = PassiveTrigger.OnDamageDealt;
	//private MSRATIOPERSTACK = .025;
	private flatStat: number = 0;

	private BASEMS: number = 25;
	private MAXMS: number = 60;

	//private STACKDURATION: number = 1.5;

	private MAXDURATION: number = 2;
	private startTime: number = 0;
	private endTime: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {
		let statBuild = sourceChamp?.statBuild;
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.endTime > time!) {
					let bonusMS = sourceChamp!.abilityNumber(sourceChamp!.level, this.BASEMS, (this.MAXMS - this.BASEMS) / 17);
					statBuild?.addStatShare(Stat.MoveSpeedFlat, bonusMS, false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				
				break;
			case PassiveTrigger.OnDamageDealt:
				if (this.endTime < time!) {
					this.startTime = time!;
				}
				this.endTime = (time!) + this.MAXDURATION;

				break;
			case PassiveTrigger.OnTick:
				//passive tick stuff
				if ((time!) >= this.endTime) {
					statBuild!.updateStats(sourceChamp!);
				}
				//else if (((time! - this.startTime) % this.STACKDURATION) < TICKTIME) {
				//	if (this.currentStacks < SpellDance.MAXSTACKS) {
				//		this.currentStacks++;
				//		statBuild!.updateStats(sourceChamp!);
				//	}
				//}
				break;
			case PassiveTrigger.Reset:
				this.endTime = 0;
				if (SpellDance.INITIALSTACKS > 0) this.endTime = this.MAXDURATION;
				this.currentStacks = SpellDance.INITIALSTACKS;
				this.flatStat = statBuild?.statNetMap.get(Stat.MoveSpeed)?.flatStat ?? 0;
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		this.flatStat = statBuild?.statNetMap.get(Stat.MoveSpeed)?.flatStat ?? 0;
		let bonusMS = statBuild != undefined ? this.LevelScaler(this.BASEMS, this.MAXMS, statBuild?.champLevel) : 0;
		return (
			<span>
				Damaging a champion with an ability grants{" "}
				<span className={Stat[Stat.MoveSpeed]}>
					{this.EnhancedText(this.FloatPrecision(bonusMS, 2) + " = ", statBuild)}(
					{this.BASEMS} to {this.MAXMS} <TextIcon iconName={"Level"} /> (based on level)) <StatIcon stat={Stat.MoveSpeed} /> Move Speed{" "}
				</span>
				for 2 seconds.{" "}
				Dealing damage refreshes this effect.
			</span>
		)
	}
}