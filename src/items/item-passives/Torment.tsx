import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Torment extends Passive {
	passiveName = "Torment";
	additionalTip = "The damage is capped at 25 per tick against monsters."
	//following are total over duration
	//static FLATDAMAGE = 50;
	//static APRATIO = .06;
	static TARGETHEALTHRATIO = .01;

	static DURATION = 3;
	/**How many seconds between damage procs*/
	static PERIOD = 0.5;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAbilityDamage) {

			damageInst!.targetChamp.addBuff(new TormentBurn(this.primarySource, time!, damageInst!.sourceChamp), damageInst!.sourceChamp.championName);
			
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		//let apDamage = (Torment.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		return (
			<span>
				Dealing Ability damage burns enemies for{" "}
				<span className="TextMagic">
					<span className="Health">
						+ {this.FloatPrecision(Torment.TARGETHEALTHRATIO*100, 1)}% target's <StatIcon stat={Stat.Health} /> Max Health
					</span>{" " }
					 magic damage{" "}
				</span>
				every {Torment.PERIOD} seconds over {Torment.DURATION} seconds.
			</span>
		);
	}
}

class TormentBurn extends Passive {
	passiveName = "Torment";


	startTime: number;
	endTime: number;
	sourceChamp: Champion;

	constructor(primarySource: string, startTime: number, sourceChamp:Champion) {
		super(primarySource);
		this.startTime = startTime;
		this.endTime = startTime + Torment.DURATION;
		this.sourceChamp = sourceChamp;
	}

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?:Champion): void {
		
		if (trigger === PassiveTrigger.OnTick) {
			//every rate seconds, ceiled to nearest tick
			if ((time! - this.startTime) % Torment.PERIOD < TICKTIME) {
				//let damageRatio: number = 1 / (Torment.DURATION / Torment.PERIOD);


				let damage: number = target!.statBuild!.getTotalStat(Stat.Health) * Torment.TARGETHEALTHRATIO;
				//damage *= damageRatio;

				let damageInst1 = new DamageInstance(this.sourceChamp, target!, this.passiveName, DamageType.Magic, damage, time!, -1, DamageTag.Periodic | DamageTag.Item);

				this.addDmgAndPenShares(damage,  this.passiveName, damageInst1, this.sourceChamp.statBuild!);

				target!.handleDamageInst(damageInst1, time!);
			}
			
		}
	}

	public reconcile(otherPassive: this):boolean {
		//this.endTime = otherPassive.endTime;
		return true;
	}

	public isExpired(time: number): boolean {
		return time > this.endTime;
	}
}