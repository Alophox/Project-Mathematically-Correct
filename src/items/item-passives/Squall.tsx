import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { CDRType, StatBuild } from "../../builds/StatBuild";
import { Champion, RangeType } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Squall extends Passive {
	passiveName = "Squall";
	static MELEEFLATMINDAMAGE = 100;
	static MELEEFLATMAXDAMAGE = 200;
	static MELEEAPRATIO = .2;

	static RANGEFLATMINDAMAGE = 75;
	static RANGEFLATMAXDAMAGE = 150;
	static RANGEAPRATIO = .15;

	static DELAY = 2;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let meleeFlatDamage = statBuild != undefined ? this.LevelScaler(Squall.MELEEFLATMINDAMAGE, Squall.MELEEFLATMAXDAMAGE, statBuild?.champLevel) : 0;
		let rangeFlatDamage = statBuild != undefined ? this.LevelScaler(Squall.RANGEFLATMINDAMAGE, Squall.RANGEFLATMAXDAMAGE, statBuild?.champLevel) : 0;

		let meleeAPDamage = (Squall.MELEEAPRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		let rangeAPDamage = (Squall.RANGEAPRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));

		let damage: number = statBuild != undefined ? (statBuild.champRangeType == RangeType.Melee ? meleeFlatDamage + meleeAPDamage : rangeFlatDamage + rangeAPDamage): 0;
		return (
			<span>
				After {Squall.DELAY} seconds, Squall damages the target, dealing{" "}
				<span className="TextMagic">
					{this.EnhancedText(this.FloatPrecision(damage, 2) + " = ", statBuild)}(
					<span className="Level">
						{this.RangeSelectorOutput(Squall.MELEEFLATMINDAMAGE + " to " + Squall.MELEEFLATMAXDAMAGE, Squall.RANGEFLATMINDAMAGE + " to " + Squall.RANGEFLATMAXDAMAGE, statBuild?.champRangeType)} <TextIcon iconName={"Level"} /> (based on level) {this.EnhancedText("(" + this.FloatPrecision(statBuild?.champRangeType == RangeType.Melee ? meleeFlatDamage : rangeFlatDamage, 2) + ")", statBuild)}
					</span>{" "}
					<span className={Stat[Stat.AbilityPower]}>
						+ {this.RangeSelectorOutput((Squall.MELEEAPRATIO * 100) + "%", (Squall.RANGEAPRATIO * 100) + "%", statBuild?.champRangeType)} <StatIcon stat={Stat.AbilityPower} /> {this.EnhancedText("(" + this.FloatPrecision(statBuild?.champRangeType == RangeType.Melee ? meleeAPDamage : rangeAPDamage, 2) + ")", statBuild)}
					</span>
				) magic damage
				</span> to the target. If the target dies before the damage would be applied, instead damage all enemy Champions within a large radius with the same damage, and grant <span className={Stat[Stat.Cost]}> <StatIcon stat={Stat.Cost}/> 30g</span>.
			</span>
		);
	}
}

export class SquallDebuff extends Passive {
	passiveName = "Squall";


	startTime: number;
	endTime: number;
	sourceChamp: Champion;

	constructor(primarySource: string, startTime: number, sourceChamp: Champion) {
		super(primarySource);
		this.startTime = startTime;
		this.endTime = startTime + Squall.DELAY;
		this.sourceChamp = sourceChamp;
		//this.passiveName = this.passiveName + sourceChamp.championName;
	}

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {

		if (trigger === PassiveTrigger.OnTick) {
			//console.log((time! / TICKTIME).toFixed(0));
			//every rate seconds, ceiled to nearest tick
			if ((time! - this.startTime + TICKTIME) % Squall.DELAY < TICKTIME) {
				//console.log("squall fired " + (time! / TICKTIME).toFixed(0));
				let damage: number = 0;
				//flat, scaling with level
				damage += (this.sourceChamp.rangeType == RangeType.Melee ? this.LevelScaler(Squall.MELEEFLATMINDAMAGE, Squall.MELEEFLATMAXDAMAGE, this.sourceChamp.level) : this.LevelScaler(Squall.RANGEFLATMINDAMAGE, Squall.RANGEFLATMAXDAMAGE, this.sourceChamp.level));
				//ratio
				damage += (this.sourceChamp.rangeType == RangeType.Melee ? Squall.MELEEAPRATIO : Squall.RANGEAPRATIO) * this.sourceChamp.statBuild!.getTotalStat(Stat.AbilityPower);


				let damageInst1 = new DamageInstance(this.sourceChamp, sourceChampion!, this.passiveName, DamageType.Magic, damage, time!, -1, DamageTag.Item);

				this.addDmgAndPenShares(damage, this.passiveName, damageInst1, this.sourceChamp.statBuild!);

				sourceChampion!.handleDamageInst(damageInst1, time!);
			}

		}
	}

	//public reconcile(otherPassive: this): boolean {
	//	this.endTime = otherPassive.endTime;
	//	return false;
	//}

	public isExpired(time: number): boolean {
		return time > this.endTime;
	}
}