import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Soulrend extends Passive {
	passiveName = "Soulrend";
	APRATIO = .15;
	FLATDAMAGE = 125;
	COOLDOWN = 30;
	MSRATIO = .25;
	BUFFDURATION = 1.5;

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
			case PassiveTrigger.OnAttackHit:
				if (damageInst!.targetChamp.addBuff(new SoulrendDebuff(this.primarySource, time!, this.COOLDOWN * (1 - statBuild!.getCDR(CDRType.Item))))) {

				//	console.log("proc'd " + this.passiveName);
					let damage: number = this.FLATDAMAGE + statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;

					let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item);

					this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

					damageInst!.targetChamp.handleDamageInst(damageInst1, time!);

					this.flatStat = statBuild?.statNetMap.get(Stat.MoveSpeed)?.flatStat ?? 0;
					this.buffTime = time! + this.BUFFDURATION;
					statBuild!.updateStats(sourceChamp!);
				} 
				break;
			case PassiveTrigger.OnTick:
				if (this.buffTime > 0 && this.buffTime < time!) {
					this.buffTime = 0;
					statBuild!.updateStats(sourceChamp!);
				}
				break;
			case PassiveTrigger.Reset:
				this.buffTime = 0;
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apDamage = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		let bonusMS = this.MSRATIO * (statBuild?.getTotalStat(Stat.MoveSpeed) ?? 0);
		return (
			<span>
				Damaging an enemy Champion deals an additional{" "}
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
				to the target and grants you{" "}
				<span className={Stat[Stat.MoveSpeed]}>
					{this.MSRATIO * 100}% <StatIcon stat={Stat.MoveSpeed} /> Move Speed{this.EnhancedText(" (" + bonusMS + ")", statBuild)}{" "}
				</span>
				for {this.BUFFDURATION} seconds({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown per Champion).
			</span>
		);
	}
}


class SoulrendDebuff extends Passive {

	endTime: number;
	constructor(primarySource: string, time:number, cooldown:number) {
		super(primarySource);
		this.endTime = time + cooldown;
	}

	public isExpired(time: number): boolean {
		return time > this.endTime;
	}
}