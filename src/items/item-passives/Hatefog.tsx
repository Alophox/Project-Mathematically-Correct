import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Hatefog extends Passive {
	passiveName = "Hatefog";
	additionalTip = "Only one zone can be made every 3 seconds per Champion hit. Currently damage caused by the shred is not tracked as damage from this item."
	//following are total over duration
	private FLATDAMAGE = 15;
	private APRATIO = .0125;

	//static BASEMRSHRED = 6;
	//static MAXMRSHRED = 12;
	static MRSHRED = 10;
	static DURATION = 3;
	private COOLDOWN = 3;
	private cooldownTime = 0;
	/**How many seconds between damage procs*/
	static PERIOD = 0.25;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		let statBuild = sourceChampion!.statBuild;
		switch (trigger) {
			case PassiveTrigger.OnAbilityDamage:
				if (this.cooldownTime <= time!) {
					let damage: number = this.FLATDAMAGE + statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;
					for (let i = 0; i < (Hatefog.DURATION / Hatefog.PERIOD); i++) {
						let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item);
						damageInst1.hitDelay = i * Hatefog.PERIOD;
						this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

						damageInst!.targetChamp.handleDamageInst(damageInst1, time!);
					}
					damageInst!.targetChamp.addBuff(new HatefogDebuff(this.primarySource, time!, damageInst!.sourceChamp), damageInst!.sourceChamp.championName);
					this.cooldownTime = time! + this.COOLDOWN;
				}
				
				break;
			case PassiveTrigger.Reset:
				this.cooldownTime = 0;
				break;
		}

	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apDamage = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		return (
			<span>
				Dealing Ability damage burns the ground under enemies for {Hatefog.DURATION} seconds which applies a Curse that deals{" "}
				<span className="TextMagic">
					{this.EnhancedText((apDamage + this.FLATDAMAGE) + " = ", statBuild)}(
					<span className="Base">
						{this.FLATDAMAGE}{" "}
					</span>
					<span className={Stat[Stat.AbilityPower]}>
						+ {this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} />{this.EnhancedText(" (" + this.FloatPrecision(apDamage,2) + ")", statBuild)}
					</span>
					) magic damage{" "}
				</span>
				every {Hatefog.PERIOD} seconds and shreds their{" "}
				<span className={Stat[Stat.MagicPenetration]}>
					magic resist by{" "}
					<span className="Base">
						{Hatefog.MRSHRED}
					</span>
				</span>
			</span>
		);
	}
}

class HatefogDebuff extends Passive {
	passiveName = "Hatefog";


	startTime: number;
	endTime: number;
	sourceChamp: Champion;

	constructor(primarySource: string, startTime: number, sourceChamp:Champion) {
		super(primarySource);
		this.startTime = startTime;
		this.endTime = startTime + Hatefog.DURATION;
		this.sourceChamp = sourceChamp;
	}

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?:Champion): void {


		switch (trigger) {
			case PassiveTrigger.ShredStatFlat:
				if ((time!) !== this.endTime) {
					//let MRShred = -1 * this.LevelScaler(Hatefog.BASEMRSHRED, Hatefog.MAXMRSHRED, this.sourceChamp.level);
					let MRShred = -1 * Hatefog.MRSHRED;
					/**@todo do shred properly to track damage caused by it*/
					sourceChampion!.statBuild!.addStatShare(Stat.MagicResist, MRShred, false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				break;
			case PassiveTrigger.OnTick:
				if (((time!) == this.startTime) || (time!) == this.endTime) {
					//shred mr
					sourceChampion!.statBuild?.updateStats(sourceChampion!);
				}
				break;
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