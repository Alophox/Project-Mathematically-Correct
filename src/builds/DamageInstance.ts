import { current } from "@reduxjs/toolkit";
import { Champion } from "../champions/Champion";
import { CrowdControl, NetCrowdControl } from "./CrowdControl";
import { TICKTIME } from "./ServerConstants";
import { Share } from "./Share";
import { StatNet } from "./StatNet";

export enum DamageType {
	Physical,
	Magic,
	True,
	Heal,
	Shield
}
export enum DamageTag {
	None = 0,
	BasicAttack = 1 << 0,
	ActiveSpell = 1 << 1,
	AOE = 1 << 2,
	Periodic = 1 << 3,
	Item = 1 << 4,
	Proc = 1 << 5,
	Pet = 1 << 6,
	NonRedirectable = 1 << 7,
	Indirect = 1 << 8,
}
export enum Targeting {
	None = 0,
	Auto = 1 << 0,
	Direction = 1 << 1,
	Location = 1 << 2,
	Unit = 1 << 3,
	Vector = 1 << 4,

	SkillShot = Direction | Location | Vector,
}

/**
 * @todo: currently damage instances are snapshooting- ie they take the stats from cast, rather than on hit. THEY SHOULD NOT BE SNAPSHOT, but currently are, which messes with calcs using upgradable items, like archangels -> seraphs- if it upgrades mid fight, some instances will be inaccurate
 */
export class DamageInstance {
	public sourceChamp: Champion;
	public targetChamp: Champion;

	public instName: string;

	public damageType: DamageType;
	public damageTags: DamageTag;

	public castInstance: number;

	/**
	 * the ratio at which life steal is applied, if applicable
	 * default 0
	 */
	public applyLifestealEffectiveness: number = 0;

	/**
	 * the ratio at which any vamp is applied, if applicable
	 * default 1, unless the AOE tag is supplied in constructor, where it changes to .33
	 * can override after construction with no ill effect
	 */
	public applyVampEffectiveness: number = 1;

	/**
	 * the ratio at which the source champ will heal from damage dealt.
	 * THIS IS NOT VAMP; change applyVamp for vamp.
	 * THIS IS NOT SPELLVAMP; @todo: spellvamp
	 * this benefits from Heal/Shield power, so apply that in postMitigation calculations
	 * AKA ability drain on the fandom
	 */
	public applyHealing: number = 0;



	/**
	 * @todo: wait till more info on tags 
	 * https://leagueoflegends.fandom.com/wiki/Damage
	 */
	public enableCallForHelp: boolean = false;
	public RespectImmunity: boolean = true;
	public respectDodge: boolean = false;
	public triggerOnHitEvents: boolean = false;
	public triggerDamageEvents: boolean = true;
	

	public damageShares: StatNet = new StatNet();

	private statShares: Array<Share> = new Array<Share>();
	private penFlatShares: Array<Share> = new Array<Share>();
	private penPercShares: Array<Share> = new Array<Share>();
	/**
	 * base is flat, bonus is flat from percent pen
	 */
	public penTotalShares: StatNet = new StatNet();
	public preMitigation: number = 0;
	public postMitigation: number = 0;

	/**
	 * initially the start time of a cast; changes to creation time after damage Inst goes thru cast buffer
	 */
	public startTime: number;
	/**
	 * set in setBehaviour
	 */
	public castDelay: number = 0; //cast time
	/**
	 * function that returns position of damageInst- undefined should be interpreted as hitscan, aka hit
	 * set in setBehaviour
	 * @param time
	 * @returns
	 */
	private position = function (time: number): number | undefined { return undefined; };
	/**
	 * set in setBehaviour
	 */
	private startPos: number = 0;
	/**
	 * function that returns true if the DI expired
	 * set in setBehaviour
	 * @param time
	 * @returns
	 */
	private expiration = function (time: number): boolean { return false; };
	public hitDelay: number = 0; //after hit, such as for periodic effects like morgana's w

	public netCC: NetCrowdControl = new NetCrowdControl();
	/**
	 * 
	 * @param sourceChamp: the champion causing this damage inst
	 * @param targetChamp: the champion getting this damage inst
	 * @param damageType: the type of damage dealt
	 * @param damage
	 * @param time: timestamp this was started
	 * @param startPos
	 * @param range
	 * @param castInstance
	 * @param damageTags
	 */
	constructor(sourceChamp: Champion, targetChamp: Champion, name:string, damageType: DamageType, damage: number, time: number, castInstance: number, damageTags?:DamageTag) {
		this.sourceChamp = sourceChamp;
		this.targetChamp = targetChamp;
		this.instName = name;
		this.damageType = damageType;
		this.preMitigation = damage;
		this.startTime = time;
		this.castInstance = castInstance;
		this.damageTags = damageTags ?? DamageTag.None;
		//if aoe, default to 33% vamp effectiveness
		if (this.damageTags & DamageTag.AOE) this.applyVampEffectiveness = .33;
	}
	/**
	 * sets delay and movement behaviour of the damage instance
	 * expiration only needs to be set for untargeted abilities; targeted abilities need to check range in tryCastRangeCheck
	 * @param castDelay: time to cast
	 * @param position: function that returns position when given a time, or undefined for instant
	 * @param expiration: function that returns if damageInst has gone beyond range or some other condition such that it no longer exists
	 * @param hitDelay: delay of damage, such as periodic damage after the first tick, ie morgana w or rumble r
	 */
	public setBehaviour(castDelay: number, position: (time: number) => number|undefined, startPos:number, expiration?: (time: number) => boolean, hitDelay?: number) {
		this.castDelay = castDelay;
		this.position = position;
		this.startPos = startPos;
		if(expiration !== undefined)
			this.expiration = expiration;
		this.hitDelay = hitDelay ?? 0;
	}

	/**
	 * add share but secondary source is = Base + primarySource
	 * @param amount: typically base damage
	 * @param primarySource: this is typically the ability
	 */
	public addBaseShare(amount: number, primarySource: string) {
		let share = new Share(amount, primarySource, "Base " + primarySource);
		this.statShares.push(share);
	}
	/**
	 * like other shares, does not modify preMitigation or postMitigation
	 * @param amount
	 * @param primarySource
	 * @param secondarySource
	 */

	public addShare(amount: number, primarySource: string, secondarySource: string) {
		let share = new Share(amount, primarySource, secondarySource);
		this.statShares.push(share);
	}

	/**
	 * adds stat shares that will be converted to damage shares later
	 * @param shares
	 * @param ratio
	 * @returns
	 */
	public addStatShares(shares: Array<Share> | undefined, ratio: number) {
		if (shares === undefined) return;
		shares.forEach((share) => {
			let newShare = new Share(share.amount * ratio, share.primarySource, share.secondarySource);
			this.statShares.push(newShare);
		});
	}

	/**
	 * for use with life steal and vamp
	 * @param shares: shares for lifesteal or form of vamp
	 * @param sharesLeeched: health gained from shares given; NOT TOTAL HEALING
	 */
	public addLeechShares(shares: Array<Share> | undefined, sharesLeeched: number) {
		if (shares === undefined) return;

		let totalLeachRatio = 0;
		shares.forEach((share) => {
			totalLeachRatio += share.amount;
		});

		shares.forEach((share) => {
			//turn % leach into flat leached
			share.amount = share.amount / totalLeachRatio * sharesLeeched;
			this.statShares.push(share);
			this.damageShares.addBaseStatShare(share.amount,share.primarySource, share.secondarySource);
		});
	}

	/**
	 * for use with stuff like raw healing, which don't get converted and need to immediately be damage shares
	 * @param shares
	 * @param ratio
	 * @returns
	 */
	public addTotalShares(shares: Array<Share> | undefined, ratio: number) {
		if (shares === undefined) return;
		shares.forEach((share) => {
			this.damageShares.addBaseStatShare(share.amount * ratio, share.primarySource, share.secondarySource);
		});
	}

	/**
	 * for use with stuff that give bonus damage, but not in a new instance, or base damage that isn't recalculated later(like healing)
	 * @param damage
	 * @param primarySource
	 * @param secondarySource
	 */
	public addTotalShare(amount: number, primarySource: string, secondarySource: string) {
		this.damageShares.addBonusStatShareTotal(amount, primarySource, secondarySource);
	}

	public addPenShares(shares: Array<Share>, isFlat: boolean) {
		shares.forEach((share) => {
			if(isFlat)
				this.penFlatShares.push(share);
			else
				this.penPercShares.push(share);
		});
	}
	/**
	 * for item passive damage, which in game tracks entire instance- dont want pen to be seperately done
	 * @param shares: pen shares
	 * @param isFlat: perc or flat shares
	 * @param primarySource
	 * @param secondarySource
	 */
	public addPenSharesPassive(shares: Array<Share>, isFlat: boolean, primarySource: string, secondarySource: string) {

		shares.forEach((share) => {
			if (isFlat)
				this.penFlatShares.push(new Share(share.amount, primarySource, secondarySource));
			else
				this.penPercShares.push(new Share(share.amount, primarySource, secondarySource));
		});
	}

	private addTotalPenShare(amount:number, primary:string, secondary:string) {
		this.penTotalShares.addBonusStatSharePerc(amount, primary, secondary)
	}


	public addPreMitigationDamage(damage: number) {
		this.preMitigation += damage;
	}

	/**
	 * gets if the positionToHit was passed over by the position algorithm
	 * @param time
	 * @param positionToHit
	 */
	public didHit(currentTime:number, pastTime:number, positionToHit: number): boolean {
		//hits on frame created cause it's a beam, or hitscan attack
		if (this.position(currentTime) === undefined) return true;

		//cnan't hit on frame created if projectile
		if (pastTime < this.startTime) return false;

		//console.log(currentTime.toFixed(3));


		let currentPos = (this.position(currentTime - this.startTime)!);
		let leftMostPos: number = (this.position(pastTime - this.startTime)!);
		let rightMostPos: number;

	//	if(this.instName === "E")
		//console.log(this.instName + ": current: " + currentPos.toFixed(2) + " | last: " + leftMostPos.toFixed(2) );

		//if proj is going outward, which is most of them
		if (leftMostPos < currentPos) {
			rightMostPos = currentPos;
		} else { //else proj is going backwards(typically a boomerang returning)
			rightMostPos = leftMostPos;
			leftMostPos = currentPos;
		}
		
		//console.log(leftMostPos + " <= " + positionToHit + " <= " + rightMostPos);

		//return true if proj has crossed posToHit
		return (leftMostPos <= positionToHit && positionToHit <= rightMostPos);
	}

	public isExpired(time: number):boolean {
		return this.expiration(time - this.startTime);
	}

	/**
	 * only use when didHit returns true, or during post-hit calcs
	 * @param time
	 * @returns
	 */
	public distanceFromCast(hitChamp:Champion) {
		return Math.abs(this.startPos - hitChamp.champPos);
	}

	/**
	 * applies resistance to damage
	 * @param resist: total resistance(ie armor or MR)
	 */
	public applyResist(resist: number) {
		//raw damage
		this.statShares.forEach((value) => {
			this.damageShares.addBaseStatShare(value.amount, value.primarySource, value.secondarySource);
		});
		


		let resistMod: number = 100 / (100 + resist);

		//modify non-pen shares
		this.damageShares.modStatShareTotal(resistMod);

		if (resist > 0) {
			let resistPercentPenTotal: number = 0; //total magic percent pen
			let resistPercentPenSum: number = 0; //sum of magic percent pens to get flat pen values each contribute

			this.penPercShares.forEach((value: Share, index) => {
				resistPercentPenTotal = 1 - ((1 - resistPercentPenTotal) * (1 - value.amount));
				resistPercentPenSum += value.amount;
			});
			let resistFlatPenFromPercent = (resist * (resistPercentPenTotal));
			this.penPercShares.forEach((value: Share, index) => {
				this.addTotalPenShare(value.amount / resistPercentPenSum * resistFlatPenFromPercent, value.primarySource, value.secondarySource);
			});


			this.penFlatShares.forEach((value, index) => {
				this.penTotalShares.addBaseStatShare(value.amount, value.primarySource, value.secondarySource);
			});

			if (this.penTotalShares.totalStat > resist) {
				let overPenMod = resist / this.penTotalShares.totalStat;
				this.penTotalShares.modStatShareTotal(overPenMod);
			}
		}
		

		//resist after pen
		let resistModPostPen = 100 / (100 + resist - this.penTotalShares.totalStat);
		this.postMitigation = this.preMitigation * resistModPostPen;

	//	let resistPenDamageShare = 1 - (resistMod / resistModPostPen);

		let penDamage = this.postMitigation - (this.preMitigation * resistMod);


		this.penTotalShares.totalStatShares.forEach((value) => {
			//pen damage share= flat pen give / total pen * penDamage
			this.damageShares.addBonusStatShareFlat((value.amount/this.penTotalShares.totalStat)*penDamage, value.primarySource, value.secondarySource);
		});
	}

	/**
	 * modify post mitigation and related shares by multiplying by mod
	 * @param mod
	 */
	public modPostMitDamage(mod:number) {
		this.postMitigation *= mod;

		this.damageShares.modStatShareTotal(mod);
	}
}