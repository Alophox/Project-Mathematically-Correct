import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { RodOfAges } from "../item-objects";
import { Passive, PassiveTrigger } from "../Passive";
import { Timeless } from "./Timeless";

export class Eternity extends Passive {
	passiveName = "Eternity";
	private MANAREGENRATIO = .07;
	private HEALRATIO = .25;
	private CAP = 20;

	//for roa eternity
	private roaPassive: Timeless | undefined;
	//private MSRATIO = .35;
	//private BUFFDURATION = 3;
	//private DECAYRATE = .25;
	//private DECAYAMOUNT = .25; //loses amount% every rate seconds
	maxStacks = 200;

	private buffStartTime = 0;
	private buffEndTime = 0;

	private flatStat = 0;

	constructor(primarySource: string, roaPassive?:Timeless) {
		super(primarySource);
		this.roaPassive = roaPassive;
	}

	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		if (sourceChamp.resourceType === ResourceType.Mana) {
			let multiplier: number = (this.roaPassive?.eternityMultiplier ?? 1);
			switch (trigger) {
				//case PassiveTrigger.IndependentStat:
				//	if (this.buffEndTime >= time!) {
				//		let statBuild = sourceChamp?.statBuild!;
				//		//as decay is of current amount, multiply the decay multi for every rate seconds has occured
				//		let decayMulti = (1 - (this.DECAYAMOUNT)) ^ (Math.floor((time! - this.buffStartTime) / this.DECAYRATE));
				//
				//		let bonusMS = (this.MSRATIO * decayMulti);
				//		statBuild.addStatShare(Stat.MoveSpeedPercent, bonusMS, false, StatMathType.PercAdditive, this.primarySource, this.passiveName);
				//
				//	}
				//	break;
				case PassiveTrigger.OnAbilityCast:
					//console.log("mana used: " + sourceChamp.resourceUsed);
					if (sourceChamp.resourceUsed > 0) {
						let healing = Math.min(this.CAP * multiplier, sourceChamp.resourceUsed * this.HEALRATIO * multiplier);
						let healingInst = new DamageInstance(sourceChamp, sourceChamp, this.passiveName, DamageType.Heal, healing, time!, -1);
						healingInst.addTotalShare(healing, this.primarySource, this.passiveName);
						sourceChamp.handleHealShieldDI(healingInst, time!);
						if (this.primarySource === "Rod of Ages") {
							//tracks overflow
							this.currentStacks += healing;
							this.checkStacks(time!, multiplier);
						}
					}
					break;

				case PassiveTrigger.OnDamageTaken:
					let manaRegen = damageInst!.preMitigation * this.MANAREGENRATIO * multiplier;
					sourceChamp.currentResource = Math.min(sourceChamp.currentResource + manaRegen, sourceChamp.statBuild!.getTotalStat(Stat.Mana));
					if (this.primarySource === "Rod of Ages") {
						//tracks overflow
						this.currentStacks += manaRegen;
						this.checkStacks(time!, multiplier);
					}
					break;

				//case PassiveTrigger.OnTick:
				//	if (this.buffEndTime > time!) {
				//		if ((time! - this.buffStartTime) % this.DECAYRATE < TICKTIME) {
				//			sourceChamp.statBuild!.updateStats(sourceChamp);
				//		}
				//	} else if (this.buffStartTime > 0) {
				//		this.buffStartTime = 0;
				//		sourceChamp.statBuild!.updateStats(sourceChamp);
				//	}
				//	break;

				case PassiveTrigger.Reset:
					this.buffStartTime = 0;
					this.buffEndTime = 0;
					break;
			}

		}
	}

	private checkStacks(time: number, multiplier: number) {
		if (this.currentStacks > this.maxStacks) {
			this.currentStacks = 0;
			//this.buffStartTime = time;
			//this.buffEndTime = this.BUFFDURATION * multiplier;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let multiplier: number = (this.roaPassive?.eternityMultiplier ?? 1);
		return (
			<span>
				Restore{" "}
				<span className={Stat[Stat.Mana]}>
					<StatIcon stat={Stat.Mana}/> Mana{" "}
				</span>
				equal to {this.FloatPrecision(this.MANAREGENRATIO * multiplier * 100,1)}% of Pre-Mitigation damage taken from Champions, and{" "}
				<span className={"TextHeal"}>
					heal{" "}
				</span>
				for an amount equal to{" "}
				<span className={Stat[Stat.Mana]}>
					{this.FloatPrecision(this.HEALRATIO * multiplier * 100,1)}% <StatIcon stat={Stat.Mana} /> Mana spent
				</span>
				, up to {this.CAP * multiplier} per cast. Toggled abilities can only heal up to {this.CAP * multiplier} per second.
				{/*(this.primarySource === RodOfAges.itemName) && (
					<span>
						{" "}For every 200 <span className="TextHeal">healing</span> or <span className={Stat[Stat.Mana]}>mana</span> restored this way, gain{" "}
						<span className={Stat[Stat.MoveSpeed]}>
							{this.MSRATIO * 100}% <StatIcon stat={Stat.MoveSpeedPercent} /> Move Speed{" "}
						</span>
						that decays over {this.BUFFDURATION} seconds.
					</span>
				)*/}
			</span>
		);
	}
}

