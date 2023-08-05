import { DamageInstance } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { CosmicDrive } from "../item-objects";
import { Passive, PassiveTrigger } from "../Passive";

export class SpellDance extends Passive {
	passiveName = "Spelldance";
	public static image = "Cosmic_Drive_item_HD.webp";
	public static MAXSTACKS = 4;
	//triggers = PassiveTrigger.OnDamageDealt;
	private MSRATIOPERSTACK = .025;
	private flatStat: number = 0;

	private STACKDURATION: number = 1.5;

	private MAXDURATION: number = 5;
	private startTime: number = 0;
	private endTime: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {
		let statBuild = sourceChamp?.statBuild;
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				let bonusMS = (this.MSRATIOPERSTACK * this.currentStacks * (this.currentStacks === SpellDance.MAXSTACKS ? 2 : 1));
				statBuild?.addStatShare(Stat.MoveSpeedPercent, bonusMS, false, StatMathType.Flat, this.primarySource, this.passiveName);
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
					this.currentStacks = 0;
					statBuild!.updateStats(sourceChamp!);
				} else if (((time! - this.startTime) % this.STACKDURATION) < TICKTIME) {
					if (this.currentStacks < SpellDance.MAXSTACKS) {
						this.currentStacks++;
						statBuild!.updateStats(sourceChamp!);
					}
				}
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
		let bonusMS = (this.MSRATIOPERSTACK) * (this.flatStat);
		return (
			<span>
				Damaging a champion generates a stack of{" "}
				<span className={Stat[Stat.MoveSpeed]}>
					2.5% <StatIcon stat={Stat.MoveSpeed} />{this.EnhancedText(" (" + bonusMS + ")", statBuild)} Move Speed{" "}
				</span>
				every 1.5 seconds for the next 5 seconds up to{" "}
				<span className={Stat[Stat.MoveSpeed]}>
					10% <StatIcon stat={Stat.MoveSpeed} /> {this.EnhancedText("(" + (bonusMS * 4) + ")", statBuild)}
				</span>.{" "}
				At 4 stacks, gain an additional{" "}
				<span className={Stat[Stat.MoveSpeed]}>
					10% <StatIcon stat={Stat.MoveSpeed} /> (20% <StatIcon stat={Stat.MoveSpeed} /> {this.EnhancedText("(" + (bonusMS * 8) + ")", statBuild)} total)
				</span>.{" "}
				Dealing damage refreshes this effect.
			</span>
		)
	}
}