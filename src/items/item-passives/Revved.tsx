import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Revved extends Passive {
	passiveName = "Revved";
	//FLATMINDAMAGE = 50;
	//FLATMAXDAMAGE = 125;
	FLATDAMAGE = 65;
	COOLDOWN = 40;

	cooldownTime = 0;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.OnDamageDealt:
				let statBuild = sourceChampion!.statBuild;
				if (this.cooldownTime <= time!) {
					this.cooldownTime = (time!) + this.COOLDOWN * (1 - statBuild!.getCDR(CDRType.Item));
					//let damage: number = this.LevelScaler(this.FLATMINDAMAGE, this.FLATMAXDAMAGE, sourceChampion!.level);
					let damage: number = this.FLATDAMAGE;

					let damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.ActiveSpell);

					this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

					damageInst!.targetChamp.handleDamageInst(damageInst1, time!);
				}
				break;
			case PassiveTrigger.Reset:
				this.cooldownTime = 0;
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		//let damage: number = statBuild != undefined ? this.LevelScaler(this.FLATMINDAMAGE, this.FLATMAXDAMAGE, statBuild?.champLevel) : 0;
		let damage: number = statBuild !== undefined ? this.FLATDAMAGE : 0;
		return (
			<span>
				Damaging an enemy Champion deals{" "}
				<span className="TextMagic">
					<span className="Base">
						{ this.FLATDAMAGE}
					</span>{" " }
				magic damage
				</span> to the target({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
			</span>
		);
	}
}
