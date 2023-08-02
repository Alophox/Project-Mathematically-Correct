import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Revved extends Passive {
	passiveName = "Revved";
	FLATMINDAMAGE = 50;
	FLATMAXDAMAGE = 125;
	FLATUPDAMAGE = (this.FLATMAXDAMAGE - this.FLATMINDAMAGE) / 17
	COOLDOWN = 40;

	cooldownTime = 0;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.OnDamageDealt:
				let statBuild = sourceChampion!.statBuild;
				if (this.cooldownTime <= time!) {
					this.cooldownTime = (time!) + this.COOLDOWN * (1 - statBuild!.getCDR(CDRType.Item));
					let damage: number = this.FLATMINDAMAGE + this.FLATUPDAMAGE * (damageInst!.sourceChamp.level - 1);

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
		let damage: number = this.FLATMINDAMAGE + this.FLATUPDAMAGE * ((statBuild?.champLevel ?? 1) - 1);
		return (
			<span>
				Damaging an enemy Champion deals{" "}
				<span className="TextMagic">
					{this.EnhancedText(this.FloatPrecision(damage, 2) + " = ", statBuild)}(
					<span className="Level">
						{this.FLATMINDAMAGE} to {this.FLATMAXDAMAGE} <TextIcon iconName={"Level"} /> (based on level)
					</span>
				) magic damage
				</span> to the target({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
			</span>
		);
	}
}
