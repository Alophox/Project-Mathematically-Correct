import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { TICKTIME } from "../../builds/ServerConstants";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";
import { SquallDebuff } from "./Squall";

export class Stormraider extends Passive {
	passiveName = "Stormraider";

	HEALTHRATIO = .35;
	TIMEFRAME = 2.5;

	BONUSMS = .25;
	BONUSMSTIME = 2;
	private endTime: number = 0;

	COOLDOWN = 30;

	cooldownTime = 0;
	targetList: Map<Champion, Array<{ damage: number, time: number }>> = new Map<Champion, Array<{ damage: number, time: number }>>();


	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.endTime > time!) {
					sourceChampion!.statBuild!.addStatShare(Stat.MoveSpeedPercent, this.BONUSMS, false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				break;
			case PassiveTrigger.OnDamageDealt:
				let statBuild = sourceChampion!.statBuild;
				if (this.cooldownTime <= time!) {
					//add champ to tracker
					let enemyChampion: Champion = damageInst!.targetChamp;
					if (!this.targetList.has(enemyChampion)) {
						this.targetList.set(enemyChampion, new Array<{damage: number, time:number}>())
					}
					//add damage to tracker
					this.targetList.get(enemyChampion)!.push({damage: damageInst!.postMitigation,time: time!})

					//check all damage in last time frame
					let damageArray: Array<{damage:number, time:number}> = this.targetList.get(enemyChampion)!;
					let damageInTimeFrame: number = 0;
					//loop through all damage, adding good ones and removing bad ones
					for (let i = damageArray.length - 1; i >= 0; i--) {
						//bad
						if (damageArray[i].time + this.TIMEFRAME < time!) {
							//remove damage from tracker
							damageArray.splice(i, 1);
						} else { //good
							//add damage
							damageInTimeFrame += damageArray[i].damage;
						}
					}

					//if enough damage, procc
					if (damageInTimeFrame >= (this.HEALTHRATIO * enemyChampion.statBuild!.getTotalStat(Stat.Health))) {
						this.cooldownTime = (time!) + this.COOLDOWN * (1 - statBuild!.getCDR(CDRType.Item));
						//console.log("squall'd " + (time! / TICKTIME).toFixed(0));
						damageInst!.targetChamp.addBuff(new SquallDebuff(this.primarySource, time!, damageInst!.sourceChamp), damageInst!.sourceChamp.championName);
						this.endTime = time! + this.BONUSMSTIME;
						sourceChampion?.statBuild?.updateStats(sourceChampion);
					}
				}
				break;
			case PassiveTrigger.OnTick:
				//passive tick stuff
				if ((time!) >= this.endTime) {
					sourceChampion!.statBuild!.updateStats(sourceChampion!);
				}
				break;
			case PassiveTrigger.Reset:
				this.cooldownTime = 0;
				this.endTime = 0;
				this.targetList = new Map<Champion, Array<{ damage: number, time: number }>>();
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		//let damage: number = statBuild != undefined ? this.LevelScaler(this.FLATMINDAMAGE, this.FLATMAXDAMAGE, statBuild?.champLevel) : 0;
		return (
			<span>
				Dealing{" "}
				<span className={Stat[Stat.Health]}>
					{this.HEALTHRATIO * 100}% of an enemy Champion's <StatIcon stat={Stat.Health}/> Maximum Health
				</span>{" "}
				within {this.TIMEFRAME} seconds inflicts them with Squall and grants{" "}
				<span className={Stat[Stat.MoveSpeedPercent]}>
					{this.BONUSMS * 100}% <StatIcon stat={Stat.MoveSpeedPercent} /> Move Speed
				</span>{" "}
				for {this.BONUSMSTIME} seconds({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
			</span>
		);
	}
}
