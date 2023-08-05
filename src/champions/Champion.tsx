import { stat } from "fs";
import { ChampBuild } from "../builds/ChampBuild";
import { CC, CrowdControl, NetCrowdControl } from "../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType } from "../builds/DamageInstance";
import { TICKTIME } from "../builds/ServerConstants";
import { StatBuild } from "../builds/StatBuild";
import { ActiveInstance } from "../items/ActiveInstance";
import { Passive, PassiveTrigger } from "../items/Passive";
import { Stat } from "../Stat";

export enum ResourceType {
	None,
	Mana,
	Energy,
	Rage /**@todo: multiple rages, get them later*/
}
export enum RangeType {
	Melee,
	Ranged
}
export enum AdaptiveType {
	Physical,
	Magic
}
export enum Class {
	Specialist = 0,

	Enchanter	= 1 << 0,
	Catcher		= 1 << 1,
	Controller = Enchanter | Catcher,

	Juggernaut = 1 << 2,
	Diver = 1 << 3,
	Fighter = Juggernaut | Diver,

	Burst = 1 << 4,
	Battlemage = 1 << 5,
	Artillery = 1 << 6,
	Mage = Burst | Battlemage | Artillery,

	Marksman = 1 << 7,

	Assassin = 1 << 8,
	Skirmisher = 1 << 9,
	Slayer = Assassin | Skirmisher,

	Vanguard = 1 << 10,
	Warden = 1 << 11,
	Tank = Vanguard | Warden,
}
//export enum LegacyClass {

//}

export enum Ability {
	None = -1,
	A,
	Q,
	W,
	E,
	R,
	P,
	I,
}

export abstract class Champion {
	/**
	 * MUST SET FOR EACH CHAMPION INDIVIDUALLY
	 */
	public get getClassName(): string { return "Champion" } ;

	public readonly championName: string = "?";
	public readonly epithet: string = "The ?";
	public readonly image: string = "Target_Dummy_TFT_item.webp";
	public readonly class: Class = Class.Specialist;
	public readonly rangeType: RangeType = RangeType.Melee;
	public readonly adaptiveType: AdaptiveType = AdaptiveType.Physical;
	protected readonly _baseStats: Map<Stat, number> = new Map<Stat, number>([[Stat.Armor, 0], [Stat.Health, 0]]);
    public get baseStats(): Map<Stat, number> {
        return this._baseStats;
    }
	public readonly levelStats: Map<Stat, number> = new Map<Stat, number>([]);
	public readonly resourceType: ResourceType = ResourceType.None;
	//some stats are utilized only within the champion


	public readonly baseAttackSpeed: number = 0;
	protected readonly baseAttackWindup: number = 0;
	protected readonly baseAttackWindupModifier: number = 1;
	protected readonly baseAttackSpeedRatio: number | undefined = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed
	/**
	 * returns attack speed ratio, unless it is not defined, whereas it returns base attack speed
	 */
	public get attackSpeedRatio(): number {
		//console.log(this.baseAttackSpeedRatio + "??" + this.baseAttackSpeed + "=" + (this.baseAttackSpeedRatio ?? this.baseAttackSpeed));
		return this.baseAttackSpeedRatio ?? this.baseAttackSpeed;
	}

	public get attackWindup(): number {
		// https://leagueoflegends.fandom.com/wiki/Basic_attack#Windup
		// castTime/windup = baseWindupTime + ((cAttackTime  ×  WindupPercent) – baseWindupTime)  ×  WindupModifier
		let baseWindupTime: number = (1 / this.statBuild!.getBaseStat(Stat.AttackSpeed)) * this.baseAttackWindup;
		let cAttackTime: number = (1 / this.statBuild!.getTotalStat(Stat.AttackSpeed));
		let windup: number = baseWindupTime + ((cAttackTime * this.baseAttackWindup) - baseWindupTime) * this.baseAttackWindupModifier;
		return Math.min(cAttackTime, windup); //windup does not exceed total attack time
	}

	/**
	 * projectile speed of basic attack
	 * this is outside the attack function as it is generally the only difference between basic attack projectiles
	 */
	protected readonly missileSpeed: number | undefined = undefined; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "";


	public statBuild: StatBuild|undefined;

	public level: number = 1;
	public burstSequence: string = "";
	public dpsPriority: string = "";

	public rankOrder: Array<Ability> = new Array<Ability>(
		Ability.R,
		Ability.Q,
		Ability.W,
		Ability.E,
	);
	public rankStart: Array<Ability> = new Array<Ability>(
		Ability.Q,
		Ability.E,
		Ability.W,
	);

	protected ranks: Array<number> = new Array<number>(
		0,//A
		0,//Q
		0,//W
		0,//E
		0,//R
	);

	/**
 * contains proprties for each ability, where abilityProperties[Ability] is the location
 */
	protected readonly abilityProperties = {
		P: {
			NAME: "?",
			get description(): JSX.Element {
				return (
					<div>
						Ability does not exist
					</div>
				);
			},
		},
		A: {
			NAME: "Basic Attack",
		},
		Q: {
			NAME: "?",
			RESOURCEUSED: 0,
			get description(): JSX.Element {
				return (
					<div>
						Ability does not exist
					</div>
				);
			},
		},
		W: {
			NAME: "?",
			RESOURCEUSED: 0,
			get description(): JSX.Element {
				return (
					<div>
						Ability does not exist
					</div>
				);
			},
		},
		E: {
			NAME: "?",
			RESOURCEUSED: 0,
			get description(): JSX.Element {
				return (
					<div>
						Ability does not exist
					</div>
				);
			},
		},
		R: {
			NAME: "?",
			RESOURCEUSED: 0,
			get description(): JSX.Element {
				return (
					<div>
						Ability does not exist
					</div>
				);
			},
		},

	};

	/**
	 * the timestamp until which the champ is casting something
	 */
	protected castingTime: number = 0;
	/**
	 * contains timestamps; add time+CD for timestamp to set
	 */
	protected cooldowns: Array<number> = new Array<number>(
		0,//A
		0,//Q
		0,//W
		0,//E
		0,//R
	); //index is same as Ability enum values
	/**
	 * dash stops at this time stamp(time + time to take dashing)
	 */
	public dashTime: number = 0;
	public dashSpeed: number = 0;

	/**
	 * castInstance is say an ahri W- can be multiple damage instances
	 */
	protected castInstanceTracker: number = 0;
	/**
	 * The currently casting damage instances
	 */
	protected castBuffer: DamageInstance[] = new Array<DamageInstance>();

	/**
	 * holds damage instances that will hit this champion once travel time is completed
	 */
	public damageInstanceBuffer: DamageInstance[] = new Array<DamageInstance>();
	/**
	 * holds damage instances that have completed calculations for aggregation
	 */
	public postCalcDamageInstances: DamageInstance[] = new Array<DamageInstance>();

	/**
	 * source, [passive.name, passive]
	 */
	protected buffBar: Map<string,Map<string,Passive>> = new Map<string,Map<string,Passive>>();

	public champPos: number = 0;
	/**
	 * change to -1 when facing towards negative numbers
	 */
	public direction: number = 1;

	public currentHealth: number = 0;

	public currentResource: number = 0;

	public resourceUsed: number = 0;

	/**
	 * @todo: buffs for shields
	 * @returns total amount fo shields active
	 */
	public getShield(): number {
		return 0;
	}

	public reset() {
		for (let i: number = 0; i < this.cooldowns.length; i++) {
			this.cooldowns[i] = 0;
		}
		this.triggerPassives(PassiveTrigger.Reset);
		this.damageInstanceBuffer = new Array<DamageInstance>();
		this.postCalcDamageInstances = new Array<DamageInstance>();
		this.castBuffer = new Array<DamageInstance>();
		this.currentHealth = 0;
		this.currentResource = 0;
		this.castingTime = 0;
		this.dashTime = 0;
		this.dashSpeed = 0;
		this.buffBar = new Map<string,Map<string,Passive>>();
		this.champSpecificReset();
	}
	/**
	 * override for individual resets, such as internal cooldowns and stacks and the like
	 */
	protected champSpecificReset() {

	}

	public init() {
		this.currentHealth = this.statBuild!.getTotalStat(Stat.Health);
		switch (this.resourceType) {
			case ResourceType.Mana:
				this.currentResource = this.statBuild!.getTotalStat(Stat.Mana);
				break;
		}
		
		this.initRanks();
	}

	protected initRanks() {
		this.ranks = new Array<number>(
			1,//A
			0,//Q
			0,//W
			0,//E
			0,//R
		);
		let tempLevel = 1;
		for (; tempLevel <= this.level && tempLevel <= this.rankStart.length; tempLevel++) {
			this.ranks[this.rankStart[tempLevel - 1]]++;
		}
		//for every level
		for (; tempLevel <= this.level; tempLevel++) {
			//check every ability, in order
			for (let i = 0; i < this.rankOrder.length; i++) {
				if (this.rankOrder[i] === Ability.R) {
					if (
						this.ranks[this.rankOrder[i]] < 3
						&&
						((tempLevel - 1) % 5 === 0)
					) {
						this.ranks[this.rankOrder[i]]++;
						//console.log(this.ranks[this.rankOrder[i]]);
						break;
					}
				} else if (
					this.ranks[this.rankOrder[i]] < 5
					&&
					this.ranks[this.rankOrder[i]] < Math.ceil(this.level / 2)
				) {
					this.ranks[this.rankOrder[i]]++;
					break;
				}
			}


		}
		//console.log(this.ranks);
	}

	/**
	 * @todo: implement ability order and level interactions
	 * returns ability level of given ability
	 * @param ability
	 */
	protected abilityLevel(ability: Ability): number {

		switch (ability) {
			case Ability.Q:
			case Ability.W:
			case Ability.E:
			case Ability.R:
				return this.ranks[ability];
			default:
				return 1;

		}
	}

	protected abilityLevelPrio(prio: number) {
	}

	/**
	 * input ability rank, lvl1 num, and rankup num value based on rank, or
	 * input level, level1 num, and levelup num for value based on level
	 * @param rankLevel
	 * @param rankLevel1Num
	 * @param rankLevelUpNum
	 * @returns
	 */
	public abilityNumber(rankLevel: number, rankLevel1Num: number, rankLevelUpNum: number): number {
		return rankLevel1Num + (rankLevelUpNum * (rankLevel - 1));
	}

	/**
	 * does a combat tick given an Ability for ability prio, returning true on ability cast or faulty input
	 * @param input
	 * @param time
	 * @param target
	 * @returns true if an ability was cast or a non-ability was input
	 */
	public combatTick(input: Ability, time: number, target: Champion): boolean {
		let removeIndexes: Array<number> = new Array<number>();
		let indexShift: number = 0;

		//console.log("Tick: " + (time /TICKTIME).toFixed(0));
		this.castBuffer.forEach((damageInst, index) => {
			if (damageInst.startTime + damageInst.castDelay <= time) {
				//change timestamp to damageInst creation time, instead of start time
				damageInst.startTime = time;

	
		//		console.log("finished cast: " + damageInst.instName);
		//		console.log("castDelay: " + (damageInst.castDelay /TICKTIME).toFixed(2));

				target.damageInstanceBuffer.push(damageInst);

				removeIndexes.push(index);
			}
		});

		//remove elements outside so that the buffer is not modified during the first loop
		removeIndexes.forEach((index) => {
			this.castBuffer.splice(index + indexShift, 1);
			indexShift--;
		});

		let successfulCast: boolean = this.tryCast(input, time, target);
		return successfulCast;
	}

	/**
	 * handles damage for a tick
	 * @param time timestamp currently looking at
	 * @param isPostTime if this is done in remainingDamageTicks()
	 */
	public handleDamageTick(time: number, isPostTime?: boolean) {
		if (!(isPostTime ?? false)) {
			//console.log("trigggggered");
			this.triggerPassives(PassiveTrigger.OnTick, time, undefined, this);
		}
			

		this.handleDamageTickBuffer(time);

		if (!(isPostTime ?? false)) {
			//do MP5 / HP5, which happens every .5 seconds at 1/10 HP5 stat
			//console.log((time % .5) < TICKTIME);
			if ((time % .5) < TICKTIME) {
				let healing = this.statBuild!.getTotalStat(Stat.HealthRegen) * .1;

				let healingInst: DamageInstance = new DamageInstance(this, this, "HP0.5", DamageType.Heal, healing, time, -1);
				healingInst.postMitigation = healing;
				healingInst.addTotalShares(this.statBuild!.getTotalStatShares(Stat.HealthRegen), .1);
				this.handleHealShieldDI(healingInst, time);

				this.handleResourceRegen();
			}
		}
		
	}

	/**
	 * called from handleDamageTick every .5 seconds
	 * override if special
	 */
	public handleResourceRegen() {

		switch (this.resourceType) {
			case ResourceType.Mana:
				this.currentResource = Math.min(this.currentResource + this.statBuild!.getTotalStat(Stat.ManaRegen) * .1, this.statBuild!.getTotalStat(Stat.Mana));
				break;
		}
	}

	public handleDamageTickBuffer(time: number) {
		let removeIndexes: Array<number> = new Array<number>();
		let indexShift: number = 0;
		//console.log("Tick: " + (time / TICKTIME).toFixed(0));
		this.damageInstanceBuffer.forEach((damageInst, index) => {
			/**
			 * @todo: delayed damage
			*/
			if (damageInst.didHit(time, time - TICKTIME, this.champPos)) {
				this.handleDamageInst(damageInst, time);
				//remove element
				removeIndexes.push(index);


			} else if (damageInst.isExpired(time)) { //damage inst no longer exists
				//remove element
				console.log("Expired: " + this.damageInstanceBuffer[index].instName);
				removeIndexes.push(index);
			}
		});

		//remove elements outside so that the buffer is not modified during the first loop
		removeIndexes.forEach((index) => {
			this.damageInstanceBuffer.splice(index + indexShift, 1);
			indexShift--;
		});
	}

	public handleDamageInst(damageInst: DamageInstance, time: number, canReduce:boolean = true) {
		//console.log("ability hit: " + damageInst.instName + " for " + damageInst.preMitigation);

		//on ability hit

		//resist
		if (canReduce) {
			this.resistDamageInst(damageInst);
		}
		

		if (!(damageInst.damageTags === DamageTag.None)) {
			//damage has been taken
			this.triggerPassives(PassiveTrigger.OnDamageTaken, time, damageInst);
			//console.log((damageInst.damageTags & DamageTag.ActiveSpell));
			//on ability damage
			if ((damageInst.damageTags & DamageTag.ActiveSpell) && damageInst.postMitigation > this.getShield()) {
				damageInst.sourceChamp.triggerPassives(PassiveTrigger.OnAbilityDamage, time, damageInst);
			}
			//on attack damage
			if ((damageInst.damageTags & DamageTag.BasicAttack)) {
				damageInst.sourceChamp.triggerPassives(PassiveTrigger.OnAttackHit, time, damageInst);
			}
			//on damage
			damageInst.sourceChamp.triggerPassives(PassiveTrigger.OnDamageDealt, time, damageInst);

		}
		

		//do damage application
		this.currentHealth = Math.max(0,this.currentHealth - damageInst.postMitigation);
		//send DI to source champ for healing calcs and storage
		damageInst.sourceChamp.calcPostMitigationDI(damageInst, time);
	}

	/**
	 * given a damage Inst with target this, resist it
	 * @param damageInst: damage instance targeting this
	 */
	public resistDamageInst(damageInst: DamageInstance) {
		let resist = 0;
		switch (damageInst.damageType) {
			case DamageType.Physical:
				resist = this.statBuild!.getTotalStat(Stat.Armor);
				break;
			case DamageType.Magic:
				resist = this.statBuild!.getTotalStat(Stat.MagicResist);
				break;
			case DamageType.True:
				break;
		}
		damageInst.applyResist(resist);
		//console.log("applied resist");
	}

	public addCrowdControl(cc?: CrowdControl, netCC?: NetCrowdControl) {
		/**
		 * @todo: crowd control adding and tracking and removing and stuff, need for tracking cc score
		 */
	}

	public calcPostMitigationDI(damageInst: DamageInstance, time: number) {
		let healing: number = 0;

		let healingInst: DamageInstance = new DamageInstance(this, this, damageInst.instName + " Leech", DamageType.Heal, healing, time, damageInst.castInstance);

		let lifeSteal = damageInst.postMitigation * damageInst.applyLifestealEffectiveness * this.statBuild!.getTotalStat(Stat.LifeSteal);
		healing += lifeSteal;
		healingInst.addLeechShares(this.statBuild!.statNetMap.get(Stat.LifeSteal)?.totalStatShares, lifeSteal);


		let omnivamp = damageInst.postMitigation * damageInst.applyVampEffectiveness * this.statBuild!.getTotalStat(Stat.Omnivamp);
		healing += omnivamp;
		healingInst.addLeechShares(this.statBuild!.statNetMap.get(Stat.Omnivamp)?.totalStatShares, omnivamp);

		if (damageInst.damageType === DamageType.Physical) {
			let physVamp = damageInst.postMitigation * damageInst.applyVampEffectiveness * this.statBuild!.getTotalStat(Stat.PhysicalVamp)
			healing += physVamp;
			healingInst.addLeechShares(this.statBuild!.statNetMap.get(Stat.PhysicalVamp)?.totalStatShares, physVamp);
		}
			

		//this benefits from heal shield power, whereas lifesteal and vamps do not
		/**@todo: implement shares for this*/
		healing += damageInst.postMitigation * damageInst.applyHealing * (1 + this.statBuild!.getTotalStat(Stat.HealShieldPower));

		
		healingInst.preMitigation = healing;
		healingInst.postMitigation = healing;
		
		this.handleHealShieldDI(healingInst, time);

		this.postCalcDamageInstances.push(damageInst);
		
	}

	public handleHealShieldDI(healShieldInst: DamageInstance, time: number) {

		if (healShieldInst.preMitigation > 0) {
			healShieldInst.postMitigation = healShieldInst.preMitigation;
			if (healShieldInst.damageType === DamageType.Heal) {
				//console.log("healing: " + healShieldInst.instName + " for " + healShieldInst.preMitigation);
				this.triggerPassives(PassiveTrigger.OnHealTaken, time, healShieldInst);
			}
			if (healShieldInst.damageType === DamageType.Shield) {
				//console.log("shielding: " + healShieldInst.instName + " for " + healShieldInst.preMitigation);
				this.triggerPassives(PassiveTrigger.OnShieldTaken, time, healShieldInst);
			}
			
			this.postCalcDamageInstances.push(healShieldInst);
		}
	}

	/**
	 * returns true if ability cast. false otherwise
	 * @param input
	 * @param time
	 * @param target
	 * @returns
	 */
	public tryCast(input:Ability, time:number, target:Champion): boolean {

		let inputUsed: boolean = false;
		let damageInst: DamageInstance;

	//	if (input !== Ability.None)
	//		console.log("TryCast " + Ability[input]);

		//try items first
		this.triggerActives(time, target);

		//ability not learned, consider cast
		if (this.abilityLevel(input) === 0) return true;
		
		switch (input) {
			case Ability.A:
				if (this.tryCastTimeCheck(time, input) && this.tryCastCCCheck(time, input)) {
					if (this.tryCastRangeCheck(input, target)) {
						//console.log("cast A");
						damageInst = new DamageInstance(this, target, "A", DamageType.Physical, 0, time, this.castInstanceTracker, DamageTag.BasicAttack);
						this.onAttack(time, damageInst);
						this.attack(damageInst, time);
						inputUsed = true;
					}
				}
				break;
			case Ability.Q:
				if (this.tryCastTimeCheck(time, input) && this.tryCastCCCheck(time, input)) {
					if (this.tryCastRangeCheck(input, target)) {
						if (this.tryCastResourceCheck(input)) {
							this.triggerPassives(PassiveTrigger.OnAbilityCast, time);
							this.castAbilityQ(target, time);
							inputUsed = true;
						}
					}
				}
				break;
			case Ability.W:
				if (this.tryCastTimeCheck(time, input) && this.tryCastCCCheck(time, input)) {
					if (this.tryCastRangeCheck(input, target)) {
						if (this.tryCastResourceCheck(input)) {
							this.triggerPassives(PassiveTrigger.OnAbilityCast, time);
							this.castAbilityW(target, time);
							inputUsed = true;
						}
						
					}
				}
				break;
			case Ability.E:
				if (this.tryCastTimeCheck(time, input) && this.tryCastCCCheck(time, input)) {
					if (this.tryCastRangeCheck(input, target)) {
						if (this.tryCastResourceCheck(input)) {
							this.triggerPassives(PassiveTrigger.OnAbilityCast, time);
							this.castAbilityE(target, time);
							inputUsed = true;
						}
					}
				}
				break;
			case Ability.R:
				if (this.tryCastTimeCheck(time, input) && this.tryCastCCCheck(time, input)) {
					if (this.tryCastRangeCheck(input, target)) {
						if (this.tryCastResourceCheck(input)) {
							this.triggerPassives(PassiveTrigger.OnAbilityCast, time);
							this.castAbilityR(target, time);
							inputUsed = true;
						}
					}
				}
				break;
			default:
				/**@todo: movement, ie energized passive interactions*/
				
				inputUsed = true;
				break;
		}
		if (inputUsed && input !== Ability.None) {
			this.castInstanceTracker++;
			//console.log("Start Cast " + Ability[input]);
		}
		return inputUsed;
	}

	/**
	 * 
	 * @param time: current time
	 * @param ability: ability/index in cooldowns
	 * @returns true if time is greater than cooldown and castingtime
	 */
	protected tryCastTimeCheck(time: number, ability: Ability): boolean {
		if (time >= this.cooldowns[ability] && time >= this.castingTime)
			return true;
		return false;
	}
	/**
	 * override when some abilities can be used during cc-like conditions, like tryndamere r
	 * @param time: current time
	 * @param ability: ability used
	 */
	protected tryCastCCCheck(time: number, ability: Ability): boolean {

		/**
		 * @todo: cc check
		 */

		//dash check, if applicable
		if (this.dashTime > time) {
			return false;
		}


		return true;
	}

	/**
	 * override when other abilities are targeted(ie not a skillshot)
	 * @param ability
	 * @param target
	 * @returns
	 */
	protected tryCastRangeCheck(ability: Ability, target: Champion):boolean {
		let distance = Math.abs(this.champPos - target.champPos);
		switch (ability) {
			case Ability.A:
				if (distance > (this.baseStats.get(Stat.AttackRange) ?? 0)) {
					console.log("Out of Range: " + Ability[ability] + " at " + distance);
					return false;
				}
				break;
		}
		return true;
	}

	protected tryCastResourceCheck(ability: Ability.Q | Ability.W | Ability.E | Ability.R): boolean {
		let resourceCheck: number = this.abilityProperties[Ability[ability] as ("Q" | "W" | "E" | "R")].RESOURCEUSED;
		if (resourceCheck <= this.currentResource) {

			this.resourceUsed = resourceCheck;
			this.currentResource -= resourceCheck;
			//console.log("current: " + this.currentResource+ " | minus: " + this.resourceUsed);
			return true;
		} else {
			return false;
		}
		
	}


	/**
	 * @todo: implement the following
	 */
	
	//public useActiveItem() {
	//
	//}
	public onAttack(time: number, damageInst: DamageInstance) {
		this.triggerPassives(PassiveTrigger.OnAttackCast, time, damageInst);
	}
	public attack(damageInst: DamageInstance, time: number) {
		damageInst.addPreMitigationDamage(this.statBuild!.getTotalStat(Stat.AttackDamage));
		damageInst.addStatShares(this.statBuild!.statNetMap.get(Stat.AttackDamage)?.totalStatShares, 1);
		damageInst.applyLifestealEffectiveness = 1;

		this.addBaseAndPenShares(0, "A", damageInst);

		let windup = this.attackWindup;
		let startPos = this.champPos;
		let dir = this.direction;
		let position: (time: number) => number|undefined;
		if (this.missileSpeed !== undefined) {
			let projSpeed = this.missileSpeed;
			position = function (time: number): number | undefined { return time * projSpeed * dir + startPos };
		} else {
			position = function (time: number): number | undefined { return undefined };
		}
		damageInst.setBehaviour(windup, position, startPos);

		this.castBuffer.push(damageInst);
		this.castingTime = time + windup;
		//dont drop frames when chaining autos
		//cause that didn't happen in practice tool with only autos
		if (time - this.cooldowns[Ability.A] < TICKTIME) {
			this.cooldowns[Ability.A] = this.cooldowns[Ability.A] + (1 / this.statBuild!.getTotalStat(Stat.AttackSpeed));
		} else {
			this.cooldowns[Ability.A] = time + (1 / this.statBuild!.getTotalStat(Stat.AttackSpeed));
		}
		
	//	console.log("----")
	//	console.log(time)
	//	console.log(windup);
	//	console.log((this.statBuild!.getTotalStat(Stat.AttackSpeed)));
	//	console.log((1 / this.statBuild!.getTotalStat(Stat.AttackSpeed)));
		//console.log("castBuffer length = " + this.castBuffer.length);
		//console.log("auto attacked: " + this.statBuild!.getTotalStat(Stat.AttackDamage));
	}
	public onAttackHit(time:number, damageInst: DamageInstance) {

		this.triggerPassives(PassiveTrigger.OnAttackHit, time, damageInst);

	}
	public castAbilityQ(target: Champion, time: number) {

	}
	public castAbilityW(target: Champion, time: number) {

	}
	public castAbilityE(target: Champion, time: number) {

	}
	public castAbilityR(target: Champion, time: number) {

	}

	/**
	 * triggers item passives- use triggerActives for actives
	 * @param trigger
	 * @param time
	 * @param damageInst
	 * @param target
	 */
	public triggerPassives(trigger: PassiveTrigger, time?: number, damageInst?: DamageInstance, target?:Champion) {
		//statbuild passives
		this.statBuild!.itemPassives.forEach((value: Passive) => {
			value.trigger(trigger, this, time, damageInst, target);
		});

		//buffs and debuffs, such as liandrys burn
		let removeMap = new Map<string, string>();
		this.buffBar.forEach((sourceMap, source) => {
			sourceMap.forEach((passive, passiveName) => {
				if (time !== undefined && passive.isExpired(time)) {
					removeMap.set(source, passiveName);
				} else {
					passive.trigger(trigger, this, time, damageInst, target);
				}
			});
		});

		removeMap.forEach((passiveName, source) => {
			this.buffBar.get(source)?.delete(passiveName);
		});
	}

	/**
	 * triggers item actives- use triggerPassives for everything else
	 * @param time
	 * @param target
	 */
	public triggerActives(time: number, target: Champion) {
		//let activeBuffer = new Array<DamageInstance>();
		let activeInstance: undefined | ActiveInstance;
		this.statBuild!.itemPassives.forEach((value: Passive) => {
			if (this.castingTime > time) return;
			activeInstance = value.useActive(this, target, time, this.direction);
			if (activeInstance !== undefined) {
				this.castBuffer.push(...activeInstance.castBuffer);
				this.castingTime = time + activeInstance.castTime;
			}
		});
	}

	protected addBaseAndPenShares(baseDmg:number, baseSource:string, damageInst: DamageInstance) {
		if(baseDmg > 0)
			damageInst.addBaseShare(baseDmg, baseSource);
		switch (damageInst.damageType) {
			case DamageType.Physical:
				damageInst.addPenShares(this.statBuild!.getTotalStatShares(Stat.ArmorPenetrationFlat), true);
				damageInst.addPenShares(this.statBuild!.getTotalStatShares(Stat.ArmorPenetrationPercent), false);

				break;
			case DamageType.Magic:
				damageInst.addPenShares(this.statBuild!.getTotalStatShares(Stat.MagicPenetrationFlat), true);
				damageInst.addPenShares(this.statBuild!.getTotalStatShares(Stat.MagicPenetrationPercent), false);
				break;
			case DamageType.True:
				//no pen
				break;
		}
	}

	/**
	 * dont add source if buff does not care who applied it, such as black cleaver
	 * returns false when buff already exists, for items that check that
	 * @param buff
	 * @param source
	 */
	public addBuff(buff: Passive, source?:string): boolean {
		if (source === undefined)
			source = "any";
		if (!this.buffBar.has(source)) {
			this.buffBar.set(source, new Map<string, Passive>());
		} 
		//reconcile multiple instances
		if (this.buffBar.get(source)!.has(buff.passiveName)) {
			this.buffBar.get(source)!.get(buff.passiveName)!.reconcile(buff);
			return false;
		} else { //else add cause its new
			this.buffBar.get(source)!.set(buff.passiveName, buff);
			return true;
		}

	}

	public abilityDescription(ability: Ability): JSX.Element {
		let abilityProps = this.abilityProperties;

		function renderSwitch(ability: Ability): JSX.Element {
			switch (ability) {
				case Ability.Q:
					return (abilityProps.Q.description);
				case Ability.W:
					return (abilityProps.W.description);
				case Ability.E:
					return (abilityProps.E.description);
				case Ability.R:
					return (abilityProps.R.description);
				case Ability.P:
					return (abilityProps.P.description);
				default:
					return (
						<div>
							Ability does not exist.
						</div>
					);
			}
		}
		return (
			<div className="description">
				{renderSwitch(ability) }
			</div>
		);
	}
	public abilityName(ability: Ability): JSX.Element {
		let abilityProps = this.abilityProperties;

		return (
			<div className="abilityname">
				{abilityProps[Ability[ability] as keyof typeof abilityProps].NAME}
			</div>
		);
	}
	public abilityLevelSpread(ability: Ability, rank1Num:number, rankUpNum:number, maxRank:number): JSX.Element {
		let spread = new Array<number>();
		for (let i = 1; i <= maxRank; i++) {
			spread.push(rank1Num + (rankUpNum * (i - 1)));
		}
		return (
			<span className="TextTT">
				{spread.map((value, index) => {
					return (

						<span key={index}>
							{(index === 0) && (<span>[ </span>)}
							{(index > 0) && (<span> / </span>)}
							<span className={(index + 1 === this.abilityLevel(ability)) ? "Selected" : "Unselected"}>
								{value}
							</span>
							{(index === maxRank-1) && (<span> ]</span>)}
						</span>

					);
				
				}) }
			</span>
		);
	}
}