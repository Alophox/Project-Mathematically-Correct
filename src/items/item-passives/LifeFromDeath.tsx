import { DamageInstance } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class LifeFromDeath extends Passive {
	passiveName = "Life From Death";

	private FLATHEAL = 50;
	private APRATIO = .5;
	private TIMEFRAME = 3;
	private COOLDOWN = 60;

	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		//this.manaRegened = this.MANARATIO * (sourceChampion!.statBuild?.statNetMap.get(Stat.Mana)?.totalStat ?? 0);
		
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apHeal = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		return (
			<span>
				On scoring a takedown on an enemy Champion you have damaged within the last {this.TIMEFRAME} seconds summons a nova that heals all ally Champions for{" "}
				<span className={"TextHeal"}>
					{this.EnhancedText((apHeal + this.FLATHEAL) + " = ", statBuild)}(
					<span className="Base">{this.FLATHEAL}</span>{" "}
					<span className={Stat[Stat.AbilityPower]}>
						+ {this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} />{this.EnhancedText("(" + this.FloatPrecision(apHeal, 2) + ")", statBuild)})
					</span>
				</span>
			</span>
		)
	}

}
