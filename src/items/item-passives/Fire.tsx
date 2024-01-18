import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";
import { Load } from "./Load";

export class Fire extends Passive {
	passiveName = "Fire";
	//additionalTip = "Echo doesn't proc when the Ability's damage is fully shielded.";
	APRATIO = .08;
	FLATDAMAGE = 40;
	EXTRADAMAGERATIO = .35;
	//COOLDOWN = 10;
	//COOLDOWNREDUCTION = .5;
	//COOLDOWNREDUCTIONLIMIT = 6;
	//MSRATIO = .15;
	//BUFFDURATION = 2;
	//
	//cooldownTime = 0;
	//cooldownReductionLimitMap: Map<number, number> = new Map<number, number>();
	//flatStat: number = 0;
	//buffTime: number = 0;


	private load: Load;
	constructor(primarySource: string, load: Load) {
		super(primarySource);
		this.load = load;
	}

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		let statBuild = sourceChamp!.statBuild;

		switch (trigger) {
			//case PassiveTrigger.IndependentStat:
			//	if (this.buffTime !== 0) {
			//		statBuild?.addStatShare(Stat.MoveSpeedPercent, this.MSRATIO, false, StatMathType.Flat, this.primarySource, this.passiveName);
			//	}
			//	break;
			case PassiveTrigger.OnAbilityDamage:
				if (this.load.currentStacks > 0) {
				//	console.log("proc'd " + this.passiveName);
					let damage: number = this.FLATDAMAGE + statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;

					let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item);

					this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

					damageInst!.targetChamp.handleDamageInst(damageInst1, time!);

					for (let i = 0; i < this.load.currentStacks - 1; i++) {
						damage = this.FLATDAMAGE + statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;
						damage *= this.EXTRADAMAGERATIO;
						damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item);

						this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

						damageInst!.targetChamp.handleDamageInst(damageInst1, time!);
					}
					this.load.currentStacks = 0;
				}
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apDamage = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		let maxMultiplier = (1 + (this.EXTRADAMAGERATIO * (Load.MAXSTACKS - 1)));
		//let bonusMS = this.MSRATIO * (statBuild?.getTotalStat(Stat.MoveSpeed) ?? 0);
		return (
			<span>
				Dealing Ability damage consumes all Shot Charges to deal an additional{" "}
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
				to the target and an additional nearby enemy for each charge consumed beyond the first. If no other targets are nearby, additional consumed charges deal another {this.EXTRADAMAGERATIO * 100}% damage to the primary target, for a maximum possible{" "}
				<span className="TextMagic">
					{this.EnhancedText(((apDamage + this.FLATDAMAGE) * maxMultiplier ) + " = ", statBuild)}(
					<span className="Base">
						{this.FLATDAMAGE * maxMultiplier}{" "}
					</span>
					<span className={Stat[Stat.AbilityPower]}>
						+ {this.APRATIO * maxMultiplier * 100}% <StatIcon stat={Stat.AbilityPower} />{this.EnhancedText(" (" + apDamage + ")", statBuild)}
					</span>
					) magic damage
				</span>.
			</span>
		);
	}
}
