import { Stat } from "../Stat";
import { Share } from "./Share";

export class StatNet {
	public baseStat: number = 0;
	public baseStatShares: Array<Share> = [];
	public bonusStat: number = 0;
	public bonusStatShares: Array<Share> = [];
	/**
	 * The stat's base + flat additons
	 */
	public flatStat: number = 0;
	/**
	 * The stat's base + flat + (additive)percent additions, pre-passive
	 */
	public percStat: number = 0;

	/**
	 * The stat's base + flat + (additive)percent + (multiplicative)percent additions
	 */
	public get totalStat():number {
		return this.baseStat + this.bonusStat;
	}

	public get totalStatShares(): Array<Share> {
		return this.baseStatShares.concat(this.bonusStatShares);
	}

	public addBaseStatShare(amount: number, primarySource: string, secondarySource: string) {
		this.baseStatShares.push(new Share(amount, primarySource, secondarySource));
		this.baseStat += amount;
		this.flatStat += amount;
		this.percStat += amount;
	}
	/**
	 * Flat as in origin of stat bonus is a flat mod; dont use this method for percent mods
	 * @param amount
	 * @param primarySource
	 * @param secondarySource
	 */
	public addBonusStatShareFlat(amount: number, primarySource: string, secondarySource: string) {
		this.addBonusStatShareTotal(amount, primarySource, secondarySource);
		this.flatStat += amount;
		this.percStat += amount;
	}
	public addBonusStatSharePerc(amount: number, primarySource: string, secondarySource: string) {
		this.addBonusStatShareTotal(amount, primarySource, secondarySource);
		this.percStat += amount;
	}
	public addBonusStatShareTotal(amount: number, primarySource: string, secondarySource: string) {
		this.bonusStatShares.push(new Share(amount, primarySource, secondarySource));
		this.bonusStat += amount;
	}

	/**
	 * modifies all stats by multiplying by mod
	 * @param mod: the multiplier to mod with
	 */
	public modStatShareTotal(mod: number) {
		this.baseStat *= mod;
		this.flatStat *= mod;
		this.percStat *= mod;
		this.baseStatShares.forEach((value: Share) => {
			value.amount *= mod;
		});
		this.bonusStatShares.forEach((value: Share) => {
			value.amount *= mod;
		});
	}
}