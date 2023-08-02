import { Ability, Champion, RangeType } from "../champions/Champion";
import { Item, ItemType } from "../items/Item";
import { Passive, PassiveTrigger } from "../items/Passive";
import { Stat } from "../Stat";
import { DamageInstance, DamageType } from "./DamageInstance";
import { Share } from "./Share";
import { StatNet } from "./StatNet";


export enum StatMathType {
	Flat,
	PercAdditive,
	PercMultiplicative,
}

export enum CDRType {
	BasicAbility,
	UltimateAbility,
	Item,
	ItemAbility, //some items use both item and ability haste
}

export class StatBuild {
	public champName: string;
	public champRangeType: RangeType;
	public champBaseStats: Map<Stat, number>;
	public champBaseAttackSpeed: number;
	public champLevelStats: Map<Stat, number>;
	public champLevel: number;
	public champAttackSpeedRatio: number;
	public items: { item: Item | undefined}[];
	public statNetMap: Map<Stat, StatNet>;
	public itemPassives: Map<string, Passive>;
	public burstInstances: Array<DamageInstance> = new Array<DamageInstance>();
	public dpsInstances: Array<DamageInstance> = new Array<DamageInstance>();
	public sustainInstances: Array<DamageInstance> = new Array<DamageInstance>();
	public abilityInstances: Array<Array<DamageInstance>> = new Array<Array<DamageInstance>>();
	public abilityTotals: Array<number> = new Array<number>();

	private legendaries: number;

	/**
	 * constructs statBuild and attaches it to the champ given
	 * @param champ
	 * @param items
	 */
	constructor(
		champ: Champion,
		items: { item: Item | undefined }[],
	) {
		champ.statBuild = this;

		this.champName = champ.championName;
		this.champRangeType = champ.rangeType;
		this.champBaseStats = champ.baseStats;
		this.champBaseAttackSpeed = champ.baseAttackSpeed;
		this.champLevelStats = champ.levelStats;
		this.champLevel = champ.level;
		this.champAttackSpeedRatio = champ.attackSpeedRatio;
		this.items = items;
		this.statNetMap = new Map<Stat, StatNet>();
		this.itemPassives = new Map<string, Passive>();
		this.legendaries = 0;


		this.itemPassives = new Map<string, Passive>();

		//this.itemPassives.forEach((value: Passive) => {
		//	value.trigger(PassiveTrigger.Reset, champ);
		//});
		
		this.updateStats(champ);


		

		let health = this.getTotalStat(Stat.Health);
		this.addCalcStatShare(Stat.EffectiveHealthPhysical, this.statNetMap.get(Stat.Health), 1);
		this.addCalcStatShare(Stat.EffectiveHealthPhysical, this.statNetMap.get(Stat.Armor), health / 100);
		this.addCalcStatShare(Stat.EffectiveHealthMagic, this.statNetMap.get(Stat.Health), 1);
		this.addCalcStatShare(Stat.EffectiveHealthMagic, this.statNetMap.get(Stat.MagicResist), health / 100);

		this.addCalcStatShare(Stat.EffectiveHealth, this.statNetMap.get(Stat.EffectiveHealthPhysical), .5);
		this.addCalcStatShare(Stat.EffectiveHealth, this.statNetMap.get(Stat.EffectiveHealthMagic), .5);

	}

	/**
	 * updates stats
	 */
	public updateStats(champ: Champion) {
	//	console.log(this.items);
	//	console.log((this.items[0]?.item));
	//	console.log((this.items[0]?.item as typeof Item));
	//	if (this.items[0]?.item != undefined)
	//	console.log((this.items[0]?.item as typeof Item).passives);

		//do every stat between (including)cost and (excluding)cooldown
		for (let i: number = Stat.Cost; i < Stat.Cooldown; i++) {
			this.statNetMap.set(i, new StatNet());
		}


		this.items.forEach((item) => {
			//passives, just in case they changed(ie archangels upgraded to seraphs)
			(item.item as typeof Item)?.passives?.forEach((value: Passive) => {
				//console.log(value.passiveName);
				if (this.itemPassives.has(value.passiveName)) {
					if (this.itemPassives.get(value.passiveName)?.primarySource !== value.primarySource && this.itemPassives.get(value.passiveName)!.reconcile(value)) {
						this.itemPassives.set(value.passiveName, value);
					}
				} else {
					this.itemPassives.set(value.passiveName, value);
				}
					
			});
		});


		//champ base stats
		this.champBaseStats.forEach((amount, stat) => {

			switch (stat) {
				case Stat.MoveSpeedFlat:
					this.addStatShare(Stat.MoveSpeed, amount, true, StatMathType.Flat, this.champName, "Base " + Stat[stat]);
					break
				default:
					this.addStatShare(stat, amount, true, StatMathType.Flat, this.champName, "Base " + Stat[stat]);
					break;
			}
		});
		this.addStatShare(Stat.AttackSpeed, this.champBaseAttackSpeed, true, StatMathType.Flat, this.champName, "Base " + Stat[Stat.AttackSpeed])
		//champ level stats
		this.champLevelStats.forEach((amount, stat) => {
			switch (stat) {
				case Stat.AttackSpeed:
					this.addStatShare(stat, this.convertBonusAS(amount * (Math.max(this.champLevel - 1, 0))), false, StatMathType.PercAdditive, this.champName, "Level " + Stat[stat]);
					break;
				default:
					this.addStatShare(stat, amount * (Math.max(this.champLevel - 1, 0)), true, StatMathType.Flat, this.champName, "Level " + Stat[stat]);
					break;
			}
		});

		this.legendaries = 0;
		//do stat compilation here
		this.items.forEach((item) => {
	//		console.log((item.item as typeof Item)?.itemName);
			(item.item as typeof Item)?.stats?.forEach((amount, stat) => {
	//			console.log(Stat[stat] + ": " + amount);
				switch (stat) {
					case Stat.AttackSpeed:
						this.addStatShare(stat, this.convertBonusAS(amount), false, StatMathType.PercAdditive, (item.item as typeof Item).itemName, Stat[stat]);
						break;
					default:
						this.addStatShare(stat, amount, false, StatMathType.Flat, (item.item as typeof Item).itemName, Stat[stat]);
						break;
				}
			});
			
			if ((item.item as typeof Item)?.type === ItemType.Legendary) {
				this.legendaries++;
			}
		});

		//mythic passives
		this.items.forEach((item) => {
			if ((item.item as typeof Item)?.type === ItemType.Mythic) {
				(item.item as typeof Item).getMythicStats(this.legendaries).forEach((amount, stat) => {
					//console.log(Stat[stat] + " " + amount);
					switch (stat) {
						case Stat.AttackSpeed:
							this.addStatShare(stat, this.convertBonusAS(amount), false, StatMathType.PercAdditive, (item.item as typeof Item).itemName, "Mythic " + Stat[stat]);
							break;
						default:
							this.addStatShare(stat, amount, false, StatMathType.Flat, (item.item as typeof Item).itemName, "Mythic " + Stat[stat]);
							break;
					}
				});
			}
		});

		this.itemPassives.forEach((value: Passive) => {
			value.trigger(PassiveTrigger.IndependentStat, champ);
		});




		//move speed is special
		this.statNetMap.get(Stat.MoveSpeedFlat)?.totalStatShares.forEach((value: Share, index: number) => {
			this.addStatShare(Stat.MoveSpeed, value.amount, false, StatMathType.Flat, value.primarySource, value.secondarySource);
		});
		this.statNetMap.get(Stat.MoveSpeedPercent)?.totalStatShares.forEach((value: Share, index: number) => {
			this.addStatShare(Stat.MoveSpeed, this.statNetMap.get(Stat.MoveSpeed)!.flatStat * value.amount, false, StatMathType.PercAdditive, value.primarySource, value.secondarySource);
		});
		//tenacity is special
		let tenacityA = 1;
		this.statNetMap.get(Stat.TenacityA)?.totalStatShares.forEach((value: Share, index: number) => {
			tenacityA *= (1-value.amount);
		});
		tenacityA = 1 - tenacityA;
		this.statNetMap.get(Stat.TenacityA)?.totalStatShares.forEach((value: Share, index: number) => {
			this.addStatShare(Stat.Tenacity, (value.amount / this.statNetMap.get(Stat.TenacityA)!.totalStat) * tenacityA, false, StatMathType.PercAdditive, value.primarySource, value.secondarySource);
		});

		let tenacityB = 1;
		this.statNetMap.get(Stat.TenacityB)?.totalStatShares.forEach((value: Share, index: number) => {
			tenacityB *= (1 - value.amount);
		});
		tenacityB = 1 - tenacityB;
		this.statNetMap.get(Stat.TenacityB)?.totalStatShares.forEach((value: Share, index: number) => {
			this.addStatShare(Stat.Tenacity, (value.amount / this.statNetMap.get(Stat.TenacityB)!.totalStat) * tenacityB, false, StatMathType.PercAdditive, value.primarySource, value.secondarySource);
		});

		let tenacityC = 1;
		this.statNetMap.get(Stat.TenacityC)?.totalStatShares.forEach((value: Share, index: number) => {
			tenacityC *= (1 - value.amount);
		});
		tenacityC = 1 - tenacityC;
		this.statNetMap.get(Stat.TenacityC)?.totalStatShares.forEach((value: Share, index: number) => {
			this.addStatShare(Stat.Tenacity, (value.amount / this.statNetMap.get(Stat.TenacityC)!.totalStat) * tenacityC, false, StatMathType.PercAdditive, value.primarySource, value.secondarySource);
		});
		//slow resist is special
		let slowResist =1;
		this.statNetMap.get(Stat.SlowResist)?.totalStatShares.forEach((value: Share, index: number) => {
			slowResist *= (1 - value.amount);
		});
		slowResist = 1 - slowResist;
		//mod so the flat values reflect the actual percent slow resist, as this stacks multiplicatively
		this.statNetMap.get(Stat.SlowResist)?.modStatShareTotal(slowResist / this.getTotalStat(Stat.SlowResist));

		
		this.itemPassives.forEach((value: Passive) => {
			value.trigger(PassiveTrigger.DependentStat, champ);
		});
		this.itemPassives.forEach((value: Passive) => {
			value.trigger(PassiveTrigger.CapstoneStat, champ);
		});
		//console.log("ability power: " + this.statNetMap.get(Stat.AbilityPower)?.totalStat);
	}

	addStatShare(stat: Stat, amount: number, isBase: boolean, statMathType: StatMathType, primarySource: string, secondarySource: string) {
		if (!this.statNetMap.has(stat)) {
			this.statNetMap.set(stat, new StatNet())
		}
		if (isBase) {
			this.statNetMap.get(stat)?.addBaseStatShare(amount, primarySource, secondarySource);
		} else {
			switch (statMathType) {
				case StatMathType.Flat:
					this.statNetMap.get(stat)?.addBonusStatShareFlat(amount, primarySource, secondarySource);
					break;
				case StatMathType.PercAdditive:
					this.statNetMap.get(stat)?.addBonusStatSharePerc(amount, primarySource, secondarySource);
					break;
				case StatMathType.PercMultiplicative:
					this.statNetMap.get(stat)?.addBonusStatShareTotal(amount, primarySource, secondarySource);
					break;
			} 
		}
	}

	/**
	 * adds statnet to another statnet(of type stat) at given ratio
	 * returns and does nothing if statNet is undefined
	 * @param stat
	 * @param statNet
	 * @param ratio
	 */
	addCalcStatShare(stat: Stat, statNet: StatNet | undefined, ratio: number) {
		if (statNet === undefined) return;
		statNet.totalStatShares.forEach((share) => {
			this.addStatShare(stat, share.amount * ratio, true, StatMathType.Flat, share.primarySource, share.secondarySource);
		});
	}



	public getTotalStat(stat: Stat): number {
		if (stat !== Stat.AttackSpeed) {
			return this.statNetMap.get(stat)?.totalStat ?? 0;
		} else {
			/**
			 * @todo: zeri is not like the other girls
			 */
			return Math.min((this.statNetMap.get(stat)?.totalStat ?? 0),2.5);
		}
	}

	/**
	 * given a stat, returns an array of shares for that stat, or an empty array if no shares were found
	 * @param stat
	 * @returns an array of shares, or an empty array of shares if none are found in the statnetmap
	 */
	public getTotalStatShares(stat: Stat): Share[] {
		return this.statNetMap.get(stat)?.totalStatShares ?? new Array<Share>();
	}

	public getBonusStat(stat: Stat): number {
		return this.statNetMap.get(stat)?.bonusStat ?? 0;
	}

	public getBaseStat(stat: Stat): number {
		return this.statNetMap.get(stat)?.baseStat ?? 0;
	}

	/**
	 * returns cdr- multiply a CD by 1- cdr to get new cd
	 * @param type
	 * @returns
	 */
	public getCDR(type: CDRType): number {
		let cdr: number = 0;
		let statVal = 0;
		switch (type) {
			/**@todo: other haste types*/
			case CDRType.BasicAbility:
				statVal = this.getTotalStat(Stat.AbilityHaste);
				break;
			case CDRType.Item:
				statVal = this.getTotalStat(Stat.ItemHaste);
				break;
			case CDRType.ItemAbility:
				statVal = this.getTotalStat(Stat.ItemHaste) + this.getTotalStat(Stat.AbilityHaste);
				break;
		}
		cdr = statVal / (statVal + 100);
		return cdr;
	}

	/**
	 * returns the flat increase to AS
	 * @param bonusAS: the bonus AS %
	 */
	private convertBonusAS(bonusAS: number): number {
		return this.champAttackSpeedRatio * bonusAS;
	}

	public calcBurst(burstInstances: Array<DamageInstance>) {
		//console.log("numInst = " +burstInstances.length);
		this.burstInstances = new Array<DamageInstance>();
		let type:StatMathType;
		burstInstances.filter(
			(DI) => DI.damageType !== DamageType.Heal && DI.damageType !== DamageType.Shield
		).forEach((DI) => {
			switch (DI.damageType) {
				case DamageType.Physical:
					type = StatMathType.Flat;
					break;
				case DamageType.Magic:
					type = StatMathType.PercAdditive;
					break;
				case DamageType.True:
					type = StatMathType.PercMultiplicative;
					break;
			}
			//console.log(DI.instName + ":");
			DI.damageShares.totalStatShares.forEach((share) => {
				this.addStatShare(Stat.Burst, share.amount, false, type, share.primarySource, share.secondarySource);
				//console.log(share.primarySource + " " + share.secondarySource + " " + share.amount);
			});
			//console.log(DI.postMitigation + " " + DamageType[DI.damageType]);
			this.burstInstances.push(DI);
		});

		burstInstances.filter(
			(DI) => DI.damageType === DamageType.Shield
		).forEach((DI) => {
			DI.damageShares.totalStatShares.forEach((share) => {
				this.addStatShare(Stat.Shield, share.amount, false, StatMathType.Flat, share.primarySource, share.secondarySource);
				//console.log(share.primarySource + " " + share.secondarySource + " " + share.amount);
			});
		});


		this.statNetMap.set(Stat.EffectiveHealthPhysical, new StatNet());
		this.statNetMap.set(Stat.EffectiveHealthMagic, new StatNet());
		this.statNetMap.set(Stat.EffectiveHealth, new StatNet());
		let health = this.getTotalStat(Stat.Health) + this.getTotalStat(Stat.Shield);

		this.addCalcStatShare(Stat.EffectiveHealthPhysical, this.statNetMap.get(Stat.Health), 1);
		this.addCalcStatShare(Stat.EffectiveHealthPhysical, this.statNetMap.get(Stat.Shield), 1);
		this.addCalcStatShare(Stat.EffectiveHealthPhysical, this.statNetMap.get(Stat.Armor), health / 100);
		this.addCalcStatShare(Stat.EffectiveHealthMagic, this.statNetMap.get(Stat.Health), 1);
		this.addCalcStatShare(Stat.EffectiveHealthMagic, this.statNetMap.get(Stat.Shield), 1);
		this.addCalcStatShare(Stat.EffectiveHealthMagic, this.statNetMap.get(Stat.MagicResist), health / 100);
	
		this.addCalcStatShare(Stat.EffectiveHealth, this.statNetMap.get(Stat.EffectiveHealthPhysical), .5);
		this.addCalcStatShare(Stat.EffectiveHealth, this.statNetMap.get(Stat.EffectiveHealthMagic), .5);
	}

	public calcDPS(dpsInstances: Array<DamageInstance>, duration:number) {
		//console.log("numInst = " +burstInstances.length);
		this.dpsInstances = new Array<DamageInstance>();
		this.sustainInstances = new Array<DamageInstance>();
		let type: StatMathType;

		dpsInstances.filter(
			(DI) => DI.damageType !== DamageType.Heal && DI.damageType !== DamageType.Shield
		).forEach((DI) => {
			switch (DI.damageType) {
				case DamageType.Physical:
					type = StatMathType.Flat;
					break;
				case DamageType.Magic:
					type = StatMathType.PercAdditive;
					break;
				case DamageType.True:
					type = StatMathType.PercMultiplicative;
					break;
			}

			DI.modPostMitDamage(1 / duration);
	//		if(DI.instName === "A")
	//		console.log(DI.instName + ":");
			DI.damageShares.totalStatShares.forEach((share) => {
				this.addStatShare(Stat.DamagePerSecond, share.amount, false, type, share.primarySource, share.secondarySource);
				//console.log(share.primarySource + " " + share.secondarySource + " " + (share.amount));
			});
			//console.log(DI.postMitigation + " " + DamageType[DI.damageType]);

			this.dpsInstances.push(DI);
		});

		type = StatMathType.Flat;
		dpsInstances.filter(
			(DI) => DI.damageType === DamageType.Heal
		).forEach((DI) => {
			
			DI.modPostMitDamage(1 / duration);

			//console.log(DI.instName + ":");
			DI.damageShares.totalStatShares.forEach((share) => {
				this.addStatShare(Stat.Sustain, share.amount, false, type, share.primarySource, share.secondarySource);
				//console.log(share.primarySource + " " + share.secondarySource + " " + share.amount);
			});
			//console.log(DI.postMitigation + " " + DamageType[DI.damageType]);

			this.sustainInstances.push(DI);
		});


		let effectiveHealth = this.getTotalStat(Stat.EffectiveHealth);
		//console.log(this.getTotalStat(Stat.DamagePerSecond) + " * " + effectiveHealth + " + " + this.getTotalStat(Stat.Sustain));
		//(DPS+Sustain)*EffHP/1000
		this.addCalcStatShare(Stat.DuelingScore, this.statNetMap.get(Stat.DamagePerSecond), effectiveHealth / 1000);
		this.addCalcStatShare(Stat.DuelingScore, this.statNetMap.get(Stat.Sustain), effectiveHealth / 1000);
	}

	public calcAbility(abilityInstances: Array<DamageInstance>, ability: Ability) {
		//console.log("numInst = " +abilityInstances.length);
		this.abilityInstances[ability] = new Array<DamageInstance>();
		this.abilityTotals[ability] = 0;

		abilityInstances.filter(
			(DI) => DI.damageType !== DamageType.Heal && DI.damageType !== DamageType.Shield
		).forEach((DI) => {


			if (
				Ability[DI.instName.charAt(0) as keyof typeof Ability] !== undefined
				&&
				(
					DI.instName.charAt(1) === "" //no char
					||
					!isNaN(parseInt(DI.instName.charAt(1))) //number
				)
			) { //is ability inst
				this.abilityInstances[ability].push(DI);
				this.abilityTotals[ability] += DI.postMitigation;
			}
		});
	}

}