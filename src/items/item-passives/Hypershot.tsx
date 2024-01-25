import { CC } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { Passive, PassiveTrigger } from "../Passive";

export class Hypershot extends Passive {
	passiveName = "Hypershot";
	additionalTip = "The Ability that procs this also benefits from the damage increase. Pets and non-immobilizing traps do not proc this effect. Due to rather static nature of champion positions in this calculator, ALL abilities with max range >= trigger range will have this effect.";
	//following are total over duration
	static DAMAGERATIO = .1;

	static DURATION = 6;

	TRIGGERRANGE = 600;
	//TRIGGERTARGETTING = Targeting.SkillShot;
	//TRIGGERCC = CC.Immobilizing | CC.Slow;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		if (trigger === PassiveTrigger.OnAbilityDamage) {
			if (!(damageInst!.damageTags & DamageTag.Pet)) {
				if (damageInst!.distanceFromCast(damageInst!.targetChamp) >= this.TRIGGERRANGE || damageInst!.maxRange >= this.TRIGGERRANGE) {

					
					if (damageInst!.targetChamp.addBuff(new HypershotDebuff(this.primarySource, time!, damageInst!.sourceChamp), damageInst!.sourceChamp.championName)) {
						//console.log("debuff added");
						let hyperDamage = damageInst!.postMitigation * Hypershot.DAMAGERATIO;
						damageInst!.addTotalShare(hyperDamage, this.primarySource, this.passiveName);
					}
					
				}
			}
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		
		return (
			<span>
				Dealing Ability damage to a Champion with a non-targeted Ability at more than 700 units distance from cast point or slowing or immobilizing them reveals them and increases your damage dealt to them by {Hypershot.DAMAGERATIO * 100}% for {Hypershot.DURATION} seconds.
			</span>
		);
	}
}

class HypershotDebuff extends Passive {
	passiveName = "Hypershot";


	startTime: number;
	endTime: number;
	sourceChamp: Champion;

	constructor(primarySource: string, startTime: number, sourceChamp: Champion) {
		super(primarySource);
		this.startTime = startTime;
		this.endTime = startTime + Hypershot.DURATION;
		this.sourceChamp = sourceChamp;
	}

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {

		if (trigger === PassiveTrigger.OnDamageTaken) {
			//console.log("hypershotted");
			let hyperDamage = damageInst!.postMitigation * Hypershot.DAMAGERATIO;
			damageInst!.addTotalShare(hyperDamage, this.primarySource, this.passiveName);
		}
	}

	public reconcile(otherPassive: this):boolean {
		this.endTime = otherPassive.endTime;
		return false;
	}

	public isExpired(time: number): boolean {
		return time > this.endTime;
	}
}