import { CC, CrowdControl, NetCrowdControl } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { ActiveInstance } from "../ActiveInstance";
import { Passive, PassiveTrigger } from "../Passive";

export class Glaciate extends Passive {
	passiveName = "Glaciate";
	APRATIO = .3;
	FLATDAMAGE = 100;
	COOLDOWN = 30;
	DEBUFFDURATION = 1;
	SLOWRATIO = .65;
	CASTTIME= .15;
	CASTDELAY= .15;
	RANGE = 850;
	cooldownTime = 0;

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance): void {
		 if (trigger === PassiveTrigger.Reset) {
			this.cooldownTime = 0;
			//console.log("reset");
		}
	}

	public useActive(sourceChamp: Champion, targetChamp: Champion, time: number, direction:number): ActiveInstance | undefined {

		if (this.cooldownTime <= time) {
			if (Math.abs(sourceChamp.champPos - targetChamp.champPos) <= this.RANGE) {
				//console.log("glaciated");
				let statBuild: StatBuild = sourceChamp.statBuild!;
				let castBuffer = new Array<DamageInstance>();

				let damage: number = this.FLATDAMAGE + statBuild.getTotalStat(Stat.AbilityPower) * this.APRATIO;

				let damageInst1 = new DamageInstance(sourceChamp, targetChamp, this.passiveName, DamageType.Magic, damage, time, -1, DamageTag.ActiveSpell | DamageTag.AOE);
				this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);
				let position1: (time: number) => number | undefined = function (time: number): number | undefined {
					return undefined;
				};
				//let expiration1: (time: number) => boolean = function (time: number): boolean {
				//	//console.log("check: " + (startPos + PROJRANGE) + " " + (position(time)!));
				//	return (position1(time)!) * dir >= startPos + abilityProps.PROJRANGE;
				//};

				damageInst1.setBehaviour(this.CASTTIME + this.CASTDELAY, position1, sourceChamp.champPos);

				damageInst1.netCC = new NetCrowdControl(
					new Array<CrowdControl>(
						new CrowdControl(CC.Root, this.DEBUFFDURATION),
						new CrowdControl(CC.Slow, this.DEBUFFDURATION, this.SLOWRATIO),
					),
				);

				castBuffer.push(damageInst1);

				this.cooldownTime = time + this.CASTTIME + this.COOLDOWN * (1 - statBuild.getCDR(CDRType.Item));
				return new ActiveInstance(this.CASTTIME, castBuffer);
			} else {
				console.log("Out of range: " + this.passiveName);
				return undefined;
			}
			
		} else {
			return undefined;
		}
		
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		let apDamage = (this.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0));
		return (
			<span>
				[Active] Damage enemies in a cone up to {this.RANGE} units away, dealing{" "}
				<span className="TextMagic">
					{this.EnhancedText((apDamage + this.FLATDAMAGE) + " = ", statBuild)}(
					<span className="Base">
						{this.FLATDAMAGE}{" "}
					</span>
					<span className={Stat[Stat.AbilityPower]}>
						+ {this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} />{this.EnhancedText(" (" + apDamage + ")", statBuild)}
					</span>
					) magic damage
				</span>
				, and {this.SLOWRATIO * 100}% Slowing all hit for {this.DEBUFFDURATION} second. Enemies in the center are Rooted instead({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown). 
			</span>
		);
	}
}
