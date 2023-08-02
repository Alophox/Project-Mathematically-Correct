import React from 'react';
import { DamageInstance, DamageType } from '../builds/DamageInstance';
import { StatBuild } from '../builds/StatBuild';
import { Champion, RangeType } from '../champions/Champion';
import { TextIcon } from '../icons/TextIcon';
import { Stat } from '../Stat';
import { ActiveInstance } from './ActiveInstance';

export enum PassiveTrigger {
	None = 0,
	IndependentStat, //aether wisp's glide, applied after item stats
	DependentStat, //seraph's awe, applied after independent stats
	CapstoneStat, //rabadon's magical opus, applied after everything else is done
	OnAttackCast, //guinsoos
	OnAttackHit, //nashor's tooth, spellblade 2
	OnAbilityCast, //spellblade 1
	OnAbilityHit, //may remove- i don't actually think anything uses this?
	OnAbilityDamage, //luden's
	OnDamageDealt, //black cleaver, night harvester
	OnDamageTaken, //lifeline
	OnAttackTaken, //rock solid
	OnHealTaken, //oblivion orb
	OnShieldTaken, //serpent's fang

	OnTick, //burn debuffs, death's dance, cosmic drive's spelldance

	OnUse, //for stuff that may not always activate, like Lifeline
	Reset, //for resetting to default values
}

export class Passive {
	/**
	 * input "" to not display a passive name in tooltip
	 */
	public passiveName: string = "?";
	//protected triggers: PassiveTrigger = PassiveTrigger.None;
	/**for passives with stacks, to show associated item*/
	public static image: string = "";
	public static MAXSTACKS: number = 0;
	public static INITIALSTACKS: number = 0;
	public currentStacks: number = 0;
	public primarySource: string;

	public additionalTip: string = "";

	constructor(primarySource:string) {
		this.primarySource = primarySource;
	}


	public trigger(trigger: PassiveTrigger, sourceChamp:Champion, time?:number, damageInst?:DamageInstance, target?:Champion): void {

	}

	public useActive(sourceChamp: Champion,targetChamp:Champion, time: number, direction:number): ActiveInstance | undefined {
		return undefined;
	}

	/**
	 * some passives stack(spellblade other effects), others override(spellblade damage); this needs to be implemented in each passive itself
	 * @param otherPassive: another passive of the same type, ie Spellblade will only take another Spellblade
	 */
	public reconcile(otherPassive: this): boolean {
		return false;
		//doing nothing means just one copy exists, and no changes are required- ie only one Glide instance(Aether Wisp), and no better Glide instances exist
		//return true to replace
		//return false if no replace
	}
	/**
	 * returns true if passive has expired and should be removed
	 * @param time
	 * @returns
	 */
	public isExpired(time: number):boolean {
		return false;
	}
	/**
	 * 
	 * @param statBuild: when added, enables enhanced description
	 * @returns the description of the passive, with calculated numbers when statBuild is given
	 */
	public Description(statBuild?: StatBuild): JSX.Element {
		return this.DescriptionElement(statBuild);
	}
	protected EnhancedText(input: string|number, statBuild?: StatBuild) {
		return statBuild && input;
	}
	protected FloatPrecision(float: number, precision: number):number {
		return parseFloat(float.toFixed(precision));
	}
	/**
	 * 
	 * @param meleeText
	 * @param rangedText
	 * @param rangeType: undefined when no selection necessary, ie viewing in item selector
	 * @returns
	 */
	protected RangeSelectorOutput(meleeText: number|string, rangedText: number|string, rangeType: RangeType|undefined):JSX.Element {

		return (
			<span className="rangeselectoroutput">
				(
				<span className={(rangeType === RangeType.Ranged ? "Unselected" : "") }>
					<TextIcon iconName={"Melee" + (rangeType === RangeType.Ranged ? "Unselected" : "")} /> {meleeText}{" "}
				</span>
				|{" "}
				<span className={(rangeType === RangeType.Melee ? "Unselected" : "")}>
					<TextIcon iconName={"Ranged" + (rangeType === RangeType.Melee ? "Unselected" : "")} /> {rangedText}
				</span>
				)
			</span>
		);
	}

	protected addDmgAndPenShares(baseDmg: number, secondarySource: string, damageInst: DamageInstance, statBuild:StatBuild) {
		if (baseDmg > 0)
			damageInst.addShare(baseDmg, this.primarySource, secondarySource);
		switch (damageInst.damageType) {
			case DamageType.Physical:
				damageInst.addPenSharesPassive(statBuild!.getTotalStatShares(Stat.ArmorPenetrationFlat), true, this.primarySource, secondarySource);
				damageInst.addPenSharesPassive(statBuild!.getTotalStatShares(Stat.ArmorPenetrationPercent), false, this.primarySource, secondarySource);

				break;
			case DamageType.Magic:
				damageInst.addPenSharesPassive(statBuild!.getTotalStatShares(Stat.MagicPenetrationFlat), true, this.primarySource, secondarySource);
				damageInst.addPenSharesPassive(statBuild!.getTotalStatShares(Stat.MagicPenetrationPercent), false, this.primarySource, secondarySource);
				break;
			default:
				//no pen
				break;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				No Description Found.
			</span>
		);
	}
}

