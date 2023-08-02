import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";
import { Safeguard } from "./Safeguard";

export class Poise extends Passive {
	passiveName = "Poise";
	LEVEL1AP = 10;
	LEVELUPAP = 3;
	LEVELUPSTART = 9; //level1 + 1 * levelup at this level

	LINGERDURATION = 3;

	cooldownTime = 0;

	linger: number = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		let statBuild = sourceChamp?.statBuild;
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.cooldownTime === 0 || this.linger > 0) {
					let bonusAP = Math.max(this.LEVEL1AP, this.LEVEL1AP + (sourceChamp!.level - (this.LEVELUPSTART - 1)) * this.LEVELUPAP);
					//console.log(bonusAP);
					//console.log(statBuild?.champName);
					statBuild!.addStatShare(Stat.AbilityPower, bonusAP, false, StatMathType.Flat, this.primarySource, this.passiveName + " " + Stat[Stat.AbilityPower]);
				}
				break;
			case PassiveTrigger.OnDamageTaken:
				if (this.cooldownTime <= time!) {
					this.cooldownTime = time! + Safeguard.COOLDOWN * (1 - statBuild!.getCDR(CDRType.Item));
					this.linger = this.LINGERDURATION + Safeguard.LINGERDURATION; //linger safeguard linger + own linger
				} 
				break;
			case PassiveTrigger.OnTick:
				if (this.linger > 0 && this.linger < time!) {
					this.linger = 0;
					statBuild!.updateStats(sourceChamp!);
				} else if (this.cooldownTime > 0 && this.cooldownTime < time!) {
					this.cooldownTime = 0;
					statBuild!.updateStats(sourceChamp!);
				}
				break;
			case PassiveTrigger.Reset:
				this.cooldownTime = 0;
				this.linger = 0;
				statBuild!.updateStats(sourceChamp!);
			//console.log("reset");
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let bonusAP = Math.max(this.LEVEL1AP, this.LEVEL1AP + ((statBuild?.champLevel ?? 1) - (this.LEVELUPSTART - 1)) * this.LEVELUPAP);
		return (
			<span>
				While Safeguarded, gain an additional{" "}

				<span className={Stat[Stat.AbilityPower]}>
					
					{this.EnhancedText(this.FloatPrecision(bonusAP, 2) + " = ", statBuild)}(
					<span className="Level">
						{this.LEVEL1AP} - {this.LEVEL1AP + (18 - (this.LEVELUPSTART - 1)) * this.LEVELUPAP} <TextIcon iconName={"Level"} /> (based on level)
					</span>
					) ability power
				</span>
				, lingering for {this.LINGERDURATION} seconds after Safeguard expires.
			</span>
		);
	}
}
