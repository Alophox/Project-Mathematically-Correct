import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Echo extends Passive {
	passiveName = "Echo";
	additionalTip = "Echo doesn't proc when the Ability's damage is fully shielded.";
	APRATIO = .1;
	FLATDAMAGE = 100;
	COOLDOWN = 10;
	COOLDOWNREDUCTION = .5;
	COOLDOWNREDUCTIONLIMIT = 6;
	MSRATIO = .15;
	BUFFDURATION = 2;

	cooldownTime = 0;
	cooldownReductionLimitMap: Map<number, number> = new Map<number, number>();
	flatStat: number = 0;
	buffTime: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		let statBuild = sourceChamp!.statBuild;

		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.buffTime !== 0) {
					statBuild?.addStatShare(Stat.MoveSpeedPercent, this.MSRATIO, false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				break;
			case PassiveTrigger.OnAbilityDamage:
				if (this.cooldownTime <= time!) {

				//	console.log("proc'd " + this.passiveName);
					this.cooldownTime = (time!) + this.COOLDOWN * (1 - statBuild!.getCDR(CDRType.Item));
					let damage: number = this.FLATDAMAGE + statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;

					let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item);

					this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

					//		let startPos = damageInst!.targetChamp.champPos;
					//		let position1: (time: number) => number | undefined = function (time: number): number | undefined {
					//			return time * abilityProps.PROJSPEED + startPos;
					//		};
					//		let expiration1: (time: number) => boolean = function (time: number): boolean {
					//			//console.log("check: " + (startPos + abilityProps.PROJRANGE) + " " + (position1(time)!));
					//			return (position1(time)!) >= startPos + abilityProps.PROJRANGE;
					//		};
					//		damageInst1.setBehaviour(abilityProps.CASTTIME, position1, expiration1);

					damageInst!.targetChamp.handleDamageInst(damageInst1, time!);

					this.flatStat = statBuild?.statNetMap.get(Stat.MoveSpeed)?.flatStat ?? 0;
					this.buffTime = time! + this.BUFFDURATION;
					statBuild!.updateStats(sourceChamp!);
				} else { //reduce cd
					let instance = damageInst!.castInstance;
					//add if not present
					if (!this.cooldownReductionLimitMap.has(instance)) {
						this.cooldownReductionLimitMap.set(instance, 1);
						this.cooldownTime -= this.COOLDOWNREDUCTION;
						//reduce if reduction limit not passed
					} else if (this.cooldownReductionLimitMap.get(instance)! < this.COOLDOWNREDUCTIONLIMIT) {
						this.cooldownReductionLimitMap.set(instance, (this.cooldownReductionLimitMap.get(instance)!) + 1);
						this.cooldownTime -= this.COOLDOWNREDUCTION;
					}
				}
				break;
			case PassiveTrigger.OnTick:
				if (this.buffTime > 0 && this.buffTime < time!) {
					this.buffTime = 0;
					statBuild!.updateStats(sourceChamp!);
				}
				break;
			case PassiveTrigger.Reset:
				this.cooldownTime = 0;
				this.cooldownReductionLimitMap = new Map<number, number>();
				this.buffTime = 0;
			//console.log("reset");
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apDamage = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		let bonusMS = this.MSRATIO * (statBuild?.getTotalStat(Stat.MoveSpeed) ?? 0);
		return (
			<span>
				Damaging Abilities deal an additional{" "}
				<span className="TextMagic">
					{this.EnhancedText((apDamage + this.FLATDAMAGE) + " = ", statBuild)}(
					<span className="Base">
						{this.FLATDAMAGE}{" "}
					</span>
					<span className={Stat[Stat.AbilityPower]}>
						+ {this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} />{this.EnhancedText(" (" + apDamage + ")", statBuild)}
					</span>
					) magic damage{" "}
				</span>
				to the target and 3 nearby enemies and grants you{" "}
				<span className={Stat[Stat.MoveSpeed]}>
					{this.MSRATIO * 100}% <StatIcon stat={Stat.MoveSpeed} /> Move Speed{this.EnhancedText(" (" + bonusMS + ")", statBuild)}{" "}
				</span>
				for {this.BUFFDURATION} seconds({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown). Dealing Ability damage to Champions reduces this item's cooldown for {this.COOLDOWNREDUCTION} seconds, up to {this.COOLDOWNREDUCTIONLIMIT * this.COOLDOWNREDUCTION} seconds per spell cast.
			</span>
		);
	}
}
