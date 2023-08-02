import { DamageInstance, DamageType } from "../../builds/DamageInstance";
import { StatBuild } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { Passive, PassiveTrigger } from "../Passive";

export class GrievousWounds extends Passive {
	startTime: number;
	endTime: number;
	sourceChamp: Champion;
	modifier: number;
	constructor(primarySource: string, secondarySource:string, startTime: number, duration: number, modifier:number, sourceChamp: Champion) {
		super(primarySource);
		this.startTime = startTime;
		this.endTime = startTime + duration;
		this.sourceChamp = sourceChamp;
		this.passiveName = "(GW)" + secondarySource;
		this.modifier = modifier;
	}

	public trigger(trigger: PassiveTrigger, sourceChampion?: Champion, time?: number, damageInst?: DamageInstance, target?: Champion): void {

		if (trigger === PassiveTrigger.OnHealTaken) {
			//console.log("gw for " + damageInst!.preMitigation * this.modifier);
			let healReduced = damageInst!.preMitigation * this.modifier;
			let antiHeal: DamageInstance = new DamageInstance(this.sourceChamp, damageInst!.targetChamp,this.passiveName,DamageType.True,healReduced,time!,-1);

			this.addDmgAndPenShares(healReduced, this.passiveName, antiHeal, this.sourceChamp.statBuild!);

			damageInst!.targetChamp.handleDamageInst(antiHeal, time!);
		}
	}

	public reconcile(otherPassive: this):boolean {
		this.endTime = otherPassive.endTime;
		this.passiveName = otherPassive.passiveName;
		this.sourceChamp = otherPassive.sourceChamp;
		return false;
	}

	public isExpired(time: number): boolean {
		return time > this.endTime;
	}
}