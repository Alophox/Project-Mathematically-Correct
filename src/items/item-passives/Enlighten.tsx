import { DamageInstance } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Enlighten extends Passive {
	passiveName = "Enlighten";
	//trigger = PassiveTrigger.None;
	private MANARATIO = .2;
	private manaRegened = 0;

	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		//this.manaRegened = this.MANARATIO * (sourceChampion!.statBuild?.statNetMap.get(Stat.Mana)?.totalStat ?? 0);
		
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Upon levelling up, restore <span className={Stat[Stat.Mana]}> {this.MANARATIO * 100} % max <StatIcon stat={Stat.Mana} /> Mana{this.EnhancedText("(" + this.FloatPrecision(this.manaRegened,3) + ")", statBuild)}</span> over 3 seconds
			</span>
		)
	}

}
