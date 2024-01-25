import { CC } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType, Targeting } from "../../builds/DamageInstance";
import { CDRType, StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Passive, PassiveTrigger } from "../Passive";

export class Focus extends Passive {
	passiveName = "Focus";
	additionalTip = "This doesn't do anything in this calculator.";
	//following are total over duration
	static DAMAGERATIO = .1;

	static DURATION = 3;

	COOLDOWN = 30;
	REVEALRADIUS = 1400;
	//TRIGGERTARGETTING = Targeting.SkillShot;
	//TRIGGERCC = CC.Immobilizing | CC.Slow;

	public trigger(trigger: PassiveTrigger, sourceChamp?: Champion, time?: number, damageInst?: DamageInstance): void {
		//if (trigger === PassiveTrigger.OnAbilityDamage) {
		//	if (!(damageInst!.damageTags & DamageTag.Pet)) {
		//		if (damageInst!.distanceFromCast(damageInst!.targetChamp) >= this.TRIGGERRANGE || damageInst!.maxRange >= this.TRIGGERRANGE) {
		//
		//			
		//			//if (damageInst!.targetChamp.addBuff(new HypershotDebuff(this.primarySource, time!, damageInst!.sourceChamp), damageInst!.sourceChamp.championName)) {
		//			//	//console.log("debuff added");
		//			//}
		//			
		//		}
		//	}
		//}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		
		return (
			<span>
				Triggering Hypershot will grant vision of the area {this.REVEALRADIUS} units around the target and apply Hypershot's debuff to enemy champions within the area revealed for {Focus.DURATION} seconds({this.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
			</span>
		);
	}
}

//class HypershotDebuff extends Passive {
//	passiveName = "Hypershot";
//
//
//	startTime: number;
//	endTime: number;
//	sourceChamp: Champion;
//
//	constructor(primarySource: string, startTime: number, sourceChamp: Champion) {
//		super(primarySource);
//		this.startTime = startTime;
//		this.endTime = startTime + Hypershot.DURATION;
//		this.sourceChamp = sourceChamp;
//	}
//
//	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {
//
//		if (trigger === PassiveTrigger.OnDamageTaken) {
//			//console.log("hypershotted");
//			let hyperDamage = damageInst!.postMitigation * Hypershot.DAMAGERATIO;
//			damageInst!.addTotalShare(hyperDamage, this.primarySource, this.passiveName);
//		}
//	}
//
//	public reconcile(otherPassive: this):boolean {
//		this.endTime = otherPassive.endTime;
//		return false;
//	}
//
//	public isExpired(time: number): boolean {
//		return time > this.endTime;
//	}
//}