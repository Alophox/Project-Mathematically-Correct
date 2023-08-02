import { DamageInstance, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { StatBuild } from "../../builds/StatBuild";
import { Champion, ResourceType } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Drain extends Passive {
	passiveName = "Drain";

	private BASEMANARESTORED = 1;
	private ENHANCEDMANARESTORED = 1.5;
	private HEALRATIO = .45;
	private buffTime = -1;
	private BUFFDURATION = 10;
	public trigger(trigger: PassiveTrigger, sourceChamp: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.OnDamageDealt:
				this.buffTime = time! + this.BUFFDURATION;
				break;
			case PassiveTrigger.OnTick:
				//every second
				if ((time! % 1) < TICKTIME) {
					let manaRegen = this.buffTime >= time! ? this.ENHANCEDMANARESTORED : this.BASEMANARESTORED;

					if (sourceChamp.resourceType === ResourceType.Mana && sourceChamp.currentResource < sourceChamp.statBuild!.getTotalStat(Stat.Mana)) {
						sourceChamp.currentResource = Math.min(sourceChamp.currentResource + manaRegen, sourceChamp.statBuild!.getTotalStat(Stat.Mana));
					} else {
						let healing = manaRegen * this.HEALRATIO;
						let healingInst = new DamageInstance(sourceChamp, sourceChamp, this.passiveName, DamageType.Heal, healing, time!, -1);
						healingInst.addTotalShare(healing, this.primarySource, this.passiveName);
						sourceChamp.handleHealShieldDI(healingInst, time!);
					}
				}
				break;
			case PassiveTrigger.Reset:
				this.buffTime = -1;
				break;
		}

	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				Restore{" "}
				<span className={Stat[Stat.Mana]}>
					{this.BASEMANARESTORED} <StatIcon stat={Stat.Mana}/> Mana{" "}
				</span>
				every second, increased to{" "}
				<span className={Stat[Stat.Mana]}>
					{this.ENHANCEDMANARESTORED} <StatIcon stat={Stat.Mana} /> Mana{" "}
				</span>
				for {this.BUFFDURATION} seconds when damaging enemy Champions. If Mana cannot be regained,{" "}
				<span className="TextHeal">
					Regenerate {this.HEALRATIO * 100}% of this value as <StatIcon stat={Stat.Health}/> Health{" "}
				</span>
				instead.
			</span>
		)
	}

}
