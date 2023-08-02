import { start } from "repl";
import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild } from "../../builds/StatBuild";
import { Champion, RangeType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class AzakanaGaze extends Passive {
	passiveName = "Azakana Gaze";

	//following are total over duration
	static MELEETARGETHEALTHRATIO = .064;
	static RANGETARGETHEALTHRATIO = .04;
	static DURATION = 4;
	/**How many seconds between damage procs*/
	static RATE = 1;

	/**per second*/
	static MONSTERCAP = 40;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAbilityDamage) {

			damageInst!.targetChamp.addBuff(new AzakanaGazeBurn(this.primarySource, time!, damageInst!.sourceChamp), damageInst!.sourceChamp.championName);

		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Dealing Ability damage burns enemies for{" "}
				<span className="TextMagic">
					(
					<span className="Health">
						{this.RangeSelectorOutput(this.FloatPrecision(AzakanaGaze.MELEETARGETHEALTHRATIO * 100, 1)+"%",this.FloatPrecision(AzakanaGaze.RANGETARGETHEALTHRATIO * 100, 1)+"%",statBuild?.champRangeType)} target's <StatIcon stat={Stat.Health} /> Max Health
					</span>
					) total magic damage{" "}
				</span>
				over {AzakanaGaze.DURATION} seconds, capped at {AzakanaGaze.MONSTERCAP * AzakanaGaze.DURATION} against monsters.
			</span>
		);
	}
}

class AzakanaGazeBurn extends Passive {
	passiveName = "Azakana Gaze";


	startTime: number;
	endTime: number;
	sourceChamp: Champion;

	constructor(primarySource: string, startTime: number, sourceChamp: Champion) {
		super(primarySource);
		this.startTime = startTime;
		this.endTime = startTime + AzakanaGaze.DURATION;
		this.sourceChamp = sourceChamp;
	}

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {

		if (trigger === PassiveTrigger.OnTick) {
			//every rate seconds, ceiled to nearest tick
			if ((time! - this.startTime) % AzakanaGaze.RATE < TICKTIME) {
				let damageRatio: number = 1 / (AzakanaGaze.DURATION / AzakanaGaze.RATE);


				let damage: number = target!.statBuild!.getTotalStat(Stat.Health) * (this.sourceChamp.rangeType === RangeType.Melee ? AzakanaGaze.MELEETARGETHEALTHRATIO : AzakanaGaze.RANGETARGETHEALTHRATIO);
				damage *= damageRatio;

				let damageInst1 = new DamageInstance(this.sourceChamp, target!, this.passiveName, DamageType.Magic, damage, time!, -1, DamageTag.Periodic | DamageTag.Item);

				this.addDmgAndPenShares(damage, this.passiveName, damageInst1, this.sourceChamp.statBuild!);

				target!.handleDamageInst(damageInst1, time!);
			}

		}
	}

	public reconcile(otherPassive: this):boolean {
		this.endTime = otherPassive.endTime;
		return false;
	}

	public isExpired(time: number): boolean {
		return time > this.endTime;
	}
}