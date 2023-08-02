import { CC, CrowdControl, NetCrowdControl } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { ActiveInstance } from "../ActiveInstance";
import { Passive, PassiveTrigger } from "../Passive";

export class Supersonic extends Passive {
	passiveName = "Supersonic";
	APRATIO = .15;
	FLATDAMAGE = 125;
	COOLDOWN = 40;
	BUFFDURATION = 1.5;
	MSRATIO = .3;
	CASTTIME = .5;
	RANGE = 1200;
	PROJSPEED = 1550; /**@estimate */
	DASHRANGE = 275;

	cooldownTime = 0;
	buffTime = 0;
	flatStat = 0;
	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.buffTime !== 0) {
					let bonusMS = this.MSRATIO * this.flatStat;
					sourceChampion!.statBuild?.addStatShare(Stat.MoveSpeed, bonusMS, false, StatMathType.PercAdditive, this.primarySource, this.passiveName);
				}
				break;
			case PassiveTrigger.OnTick:
				if (this.buffTime > 0 && this.buffTime < time!) {
					this.buffTime = 0;
					sourceChampion!.statBuild!.updateStats(sourceChampion!);
				}
				break;
			case PassiveTrigger.Reset:
				this.cooldownTime = 0;
				this.buffTime = 0;
				break;
		}
	}

	public useActive(sourceChamp: Champion, targetChamp: Champion, time: number, direction:number): ActiveInstance | undefined {
		/**@todo: implement auto reset-when fixed, change additional tip in HextechRocketbelt*/
		/**@todo: implement dash*/
		if (this.cooldownTime <= time) {
			let statBuild: StatBuild = sourceChamp.statBuild!;
			let castBuffer = new Array<DamageInstance>();

			sourceChamp.dashSpeed = this.DASHRANGE / this.CASTTIME;
			sourceChamp.dashTime = time + this.CASTTIME;


			let damage: number = this.FLATDAMAGE + statBuild.getTotalStat(Stat.AbilityPower) * this.APRATIO;

			let damageInst1 = new DamageInstance(sourceChamp, targetChamp, this.passiveName, DamageType.Magic, damage, time, -1, DamageTag.ActiveSpell | DamageTag.AOE);
			this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

			let projSpeed = this.PROJSPEED;
			let projRange = this.RANGE;
			let position1: (time: number) => number | undefined = function (time: number): number | undefined {
				return time * projSpeed * direction + sourceChamp.champPos;
			};
			let expiration1: (time: number) => boolean = function (time: number): boolean {
				return (position1(time)!) * direction >= sourceChamp.champPos + projRange;
			};

			damageInst1.setBehaviour(this.CASTTIME, position1, sourceChamp.champPos, expiration1);

			castBuffer.push(damageInst1);

			this.cooldownTime = time + this.CASTTIME + this.COOLDOWN * (1 - statBuild.getCDR(CDRType.Item));
			this.flatStat = statBuild?.statNetMap.get(Stat.MoveSpeed)?.flatStat ?? 0;
			return new ActiveInstance(this.CASTTIME, castBuffer);
			 

		} else {
			return undefined;
		}

	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apDamage = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		let bonusMS = this.MSRATIO * (statBuild?.getTotalStat(Stat.MoveSpeed) ?? 0);
		return (
			<span>
				[Active] Dash 125-275 units in a direction and fire rockets that deal{" "}
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
				to the first enemies hit.
				<br/>
				Additionally gain
				<span className={Stat[Stat.MoveSpeed]}>
					{this.MSRATIO * 100}% <StatIcon stat={Stat.MoveSpeed} /> Move Speed{this.EnhancedText(" (" + bonusMS + ")", statBuild)}{" "}
				</span>
				while facing enemy Champions within 2000 units({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
			</span>
		);
	}
}
