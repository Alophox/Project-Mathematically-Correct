import { CC, CrowdControl, NetCrowdControl } from "../../builds/CrowdControl";
import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType } from "../../builds/StatBuild";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { Ability, AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Ahri extends Champion{
	public readonly championName	= "Ahri";
	public readonly epithet			= "The Nine-Tailed Fox";
	public readonly image			= "AhriSquare.webp";
	public readonly class			= Class.Burst;
	public readonly rangeType		= RangeType.Ranged;
	public readonly adaptiveType	= AdaptiveType.Magic;
	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 590],
		[Stat.HealthRegen, 2.5],
		[Stat.Mana, 418],
		[Stat.ManaRegen, 8],
		[Stat.Armor, 21],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 53],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 330],
		[Stat.AttackRange, 550],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 96],
		[Stat.HealthRegen, .6],
		[Stat.Mana, 25],
		[Stat.ManaRegen, .8],
		[Stat.Armor, 4.7],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 3],
		[Stat.AttackSpeed, .02],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion


	public readonly baseAttackSpeed = .668;
	protected readonly baseAttackWindup		= .20054;
	protected readonly baseAttackSpeedRatio	= undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = 1750; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "";


	
	public rankOrder: Array<Ability> = new Array<Ability>(
		Ability.R,
		Ability.Q,
		Ability.W,
		Ability.E,
	);

	protected readonly abilityProperties = {
		P: {
			NAME: "Essence Theft",
			APRATIOMINION: .2,
			LEVEL1HEALMINION: 35,
			LEVELUPHEALMINION: 60 / 17,

			APRATIOCHAMP: .3,
			LEVEL1HEALCHAMP: 75,
			LEVELUPHEALCHAMP: 90 / 17,

			champ: this,
			get description(): JSX.Element {
				let level18Minion = this.champ.abilityNumber(18, this.LEVEL1HEALMINION, this.LEVELUPHEALMINION);
				let levelCMinion = this.champ.abilityNumber(this.champ.level, this.LEVEL1HEALMINION, this.LEVELUPHEALMINION);
				let ratioMinion = this.APRATIOMINION * this.champ.statBuild!.getTotalStat(Stat.AbilityPower);

				let level18Champ = this.champ.abilityNumber(18, this.LEVEL1HEALCHAMP, this.LEVELUPHEALCHAMP);
				let levelCChamp = this.champ.abilityNumber(this.champ.level, this.LEVEL1HEALCHAMP, this.LEVELUPHEALCHAMP);
				let ratioChamp = this.APRATIOCHAMP * this.champ.statBuild!.getTotalStat(Stat.AbilityPower);
				return (
					<div>
						Every time Ahri kills a minion or monster, she generates a stack of Essence Fragment. At 9 stacks, they are consumed and Ahri{" "}
						<span className="TextHeal">
							heals{" "}
							{parseFloat((levelCMinion + ratioMinion).toFixed(2))}{" "}
							= (
							<span className="Level">{this.LEVEL1HEALMINION}-{level18Minion} <TextIcon iconName="Level" /> ({parseFloat(levelCMinion.toFixed(2))})</span>{" "}
							+{" "}
								<span className="AbilityPower">{this.APRATIOMINION * 100}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((this.APRATIOMINION * this.champ.statBuild!.getTotalStat(Stat.AbilityPower)).toFixed(2))})</span>
							)
						</span>.
						<br/>
						<br/>
						Every time Ahri gets a takedown on a Champion within 3 seconds of damaging them, Ahri{" "}
						<span className="TextHeal">
							heals{" "}
							{parseFloat((levelCChamp + ratioChamp).toFixed(2))} = (
							<span className="Level">{this.LEVEL1HEALCHAMP}-{level18Champ} <TextIcon iconName="Level" /> ({parseFloat(levelCChamp.toFixed(2))})</span>{" "}
							+{" "}
							<span className="AbilityPower">{this.APRATIOCHAMP * 100}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((ratioChamp).toFixed(2))})</span>
							)
						</span>.
					</div>
				);
			},
		},
		A: {
			NAME: "Basic Attack",
		},
		Q: {
			NAME: "Orb of Deception",

			APRATIO: .45,
			RANK1DMG: 40,
			RANKUPDMG: 25,
			CD: 7,
			CASTTIME: .25,
			PROJSPEED: 1550,
			PROJRANGE: 900, 

			RANK1MANA: 55,
			RANKUPMANA: 10,

			get RESOURCEUSED(): number {
				let rank: number = this.champ.abilityLevel(Ability.Q);
				return this.champ.abilityNumber(rank, this.RANK1MANA, this.RANKUPMANA);;
			},

			champ: this,
			get description(): JSX.Element {
				let rank: number = this.champ.abilityLevel(Ability.Q);
				let baseDamage: number = this.champ.abilityNumber(rank, this.RANK1DMG, this.RANKUPDMG);
				let damage: number = baseDamage + this.champ.statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;
				let ap: number = this.champ.statBuild?.getTotalStat(Stat.AbilityPower) ?? 0;
				return (
					<div>
						Ahri throws her orb out (Q1), dealing{" "}
						<span className="TextMagic">
							{parseFloat(damage.toFixed(2))} = ({this.champ.abilityLevelSpread(Ability.Q, this.RANK1DMG, this.RANKUPDMG, 5)} +{" "}
							<span className="AbilityPower">
								{this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((ap * this.APRATIO).toFixed(2))})
							</span>)
							magic damage
						</span> to targets hit on the way out.{" "}
						<br/>
						<br/>
						At the maximum range, the orb returns to Ahri (Q2), dealing{" "}
						<span className="TextTrue">
							{parseFloat(damage.toFixed(2))} = ({this.champ.abilityLevelSpread(Ability.Q, this.RANK1DMG, this.RANKUPDMG, 5)} +{" "}
							<span className="AbilityPower">
								{this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((ap * this.APRATIO).toFixed(2))})
							</span>)
							true damage
						</span> to targets hit on the way back.{" "}
					</div>
				);
			},
		},
		W: {
			NAME: "Fox-Fire",
			RESOURCEUSED: 30,
			APRATIO: .3,
			RANK1DMG: 50,
			RANKUPDMG: 25,
			RANK1CD: 9,
			RANKUPCD: -1,

			CASTTIME: 0,
			DELAY: .25,
			PROJSPEED: 1400,
			PROJRANGE: 725,

			SUBSEQUENTDMGRATIO: .3,

			champ: this,
			get description(): JSX.Element {
				let rank: number = this.champ.abilityLevel(Ability.W);
				let baseDamage: number = this.champ.abilityNumber(rank, this.RANK1DMG, this.RANKUPDMG);
				let damage: number = baseDamage + this.champ.statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;
				let ap: number = this.champ.statBuild?.getTotalStat(Stat.AbilityPower) ?? 0;
				return (
					<div>
						Ahri gains a burst of <span className="MoveSpeed">40% <StatIcon stat={Stat.MoveSpeedPercent}/> Move Speed</span> that decays over 2 seconds, and creates three fox-fires that orbit her for up to 2.5 seconds.{" "}
						After some time, the fox-fires will target a visible enemy(see wiki for targetting details).{"\n\n"}
						The first fox-fire (W1) to hit will deal{" "}
						<span className="TextMagic">
							{parseFloat(damage.toFixed(2))} = ({this.champ.abilityLevelSpread(Ability.W, this.RANK1DMG, this.RANKUPDMG, 5)} +{" "}
							<span className="AbilityPower">
								{this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((ap * this.APRATIO).toFixed(2))})
							</span>)
							magic damage
						</span>.{" "}
						<br />
						<br />
						Subsequent fox-fire hits (W2, W3) on the same target will deal{" "}
						<span className="TextMagic">
							{parseFloat((damage * this.SUBSEQUENTDMGRATIO).toFixed(2))} = ({this.champ.abilityLevelSpread(Ability.W, this.RANK1DMG * this.SUBSEQUENTDMGRATIO, this.RANKUPDMG * this.SUBSEQUENTDMGRATIO, 5)} +{" "}
							<span className="AbilityPower">
								{this.APRATIO * 100 * this.SUBSEQUENTDMGRATIO}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((ap * this.APRATIO * this.SUBSEQUENTDMGRATIO).toFixed(2))})
							</span>)
							magic damage
						</span> instead.{" "}
					</div>
				);
			},
		},
		E: {
			NAME: "Charm",
			RESOURCEUSED: 60,
			APRATIO: .6,
			RANK1DMG: 80,
			RANKUPDMG: 30,

			RANK1DURATION: 1.2,
			RANKUPDURATION: 0.2,

			CD: 14,
			CASTTIME: .25,
			PROJSPEED: 1550,
			PROJRANGE: 1000,

			get NETCC(): NetCrowdControl{
				let rank: number = this.champ.abilityLevel(Ability.E);
				let duration: number = this.champ.abilityNumber(rank, this.RANK1DURATION, this.RANKUPDURATION);
				return new NetCrowdControl(
					new Array<CrowdControl>(
						new CrowdControl(CC.Charm,duration),
						new CrowdControl(CC.Slow,duration,.65),
					)
				);
			},
			champ: this,
			get description(): JSX.Element {
				let rank: number = this.champ.abilityLevel(Ability.E);
				let baseDamage: number = this.champ.abilityNumber(rank, this.RANK1DMG, this.RANKUPDMG);
				let damage: number = baseDamage + this.champ.statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;
				let ap: number = this.champ.statBuild?.getTotalStat(Stat.AbilityPower) ?? 0;
				return (
					<div>
						Ahri blows a kiss that deals{" "}
						<span className="TextMagic">
							{parseFloat(damage.toFixed(2))} = ({this.champ.abilityLevelSpread(Ability.E, this.RANK1DMG, this.RANKUPDMG, 5)} +{" "}
							<span className="AbilityPower">
								{this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((ap * this.APRATIO).toFixed(2))})
							</span>)
							magic damage
						</span> to the first enemy hit, applying Knock Down,{" "}
						and applying Charm and 65% Slow for {this.champ.abilityLevelSpread(Ability.E, this.RANK1DURATION, this.RANKUPDURATION, 5)} seconds.
		
					</div>
				);
			},
		},
		R: {
			NAME: "Spirit Rush",
			RESOURCEUSED: 100,
			APRATIO: .35,
			RANK1DMG: 60,
			RANKUPDMG: 30,
			RANK1CD: 130,
			RANKUPCD: -25,


			CASTTIME: 0,
			PROJSPEED: 1400,
			PROJRANGE: 600,
			DASHRANGE: 500,
			DASHBASESPEED: 1200,

			champ: this,
			get description(): JSX.Element {
				let rank: number = this.champ.abilityLevel(Ability.E);
				let baseDamage: number = this.champ.abilityNumber(rank, this.RANK1DMG, this.RANKUPDMG);
				let damage: number = baseDamage + this.champ.statBuild!.getTotalStat(Stat.AbilityPower) * this.APRATIO;
				let ap: number = this.champ.statBuild?.getTotalStat(Stat.AbilityPower) ?? 0;
				return (
					<div>
						Ahri dashes to a location within {this.DASHRANGE} units and fires an essence bolt at up to 3 nearby visible enemies, each bolt dealing{" "}
						<span className="TextMagic">
							{parseFloat(damage.toFixed(2))} = ({this.champ.abilityLevelSpread(Ability.R, this.RANK1DMG, this.RANKUPDMG, 3)} +{" "}
							<span className="AbilityPower">
								{this.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} /> ({parseFloat((ap * this.APRATIO).toFixed(2))})
							</span>)
							magic damage
						</span>.
						<br />
						<br />
						{this.NAME} can be recast up to 2 additional times in the next 15 seconds.
						The recast window is extended and an additional recast is obtained for every (P)Essence Theft proc on enemy Champions, up to a max of 3 stored at a time.

					</div>
				);
			},

			/**number of recasts left; cannot recast at 0*/
			charges: 0,
			/**the time until R can no longer be recast*/
			timeWindow: 0,
			/**the internal recast cooldown*/
			INTERNALCD: 1,
			/**the time in which R cannot be recast*/
			delay: 0,
		},

	};

	public currentHealth = 0;
	
	protected champSpecificReset() {
		this.abilityProperties.R.charges = 0;
		this.abilityProperties.R.timeWindow = 0;
		this.abilityProperties.R.delay = 0;
	}

	public castAbilityQ(target: Champion, time: number) {
		let abilityProps = this.abilityProperties.Q;
		let rank: number = this.abilityLevel(Ability.Q);
		let baseDamage: number = this.abilityNumber(rank, abilityProps.RANK1DMG, abilityProps.RANKUPDMG);

		let damage: number = baseDamage + this.statBuild!.getTotalStat(Stat.AbilityPower) * abilityProps.APRATIO;

		let damageInst1 = new DamageInstance(this, target, "Q1", DamageType.Magic, damage, time, this.castInstanceTracker, DamageTag.ActiveSpell | DamageTag.AOE);
		let damageInst2 = new DamageInstance(this, target, "Q2", DamageType.True,  damage, time, this.castInstanceTracker, DamageTag.ActiveSpell | DamageTag.AOE);

		this.addBaseAndPenShares(baseDamage, "Q1", damageInst1);
		damageInst1.addStatShares(this.statBuild!.getTotalStatShares(Stat.AbilityPower), abilityProps.APRATIO);


		this.addBaseAndPenShares(baseDamage, "Q2", damageInst2);
		damageInst2.addStatShares(this.statBuild!.getTotalStatShares(Stat.AbilityPower), abilityProps.APRATIO);

		let startPos = this.champPos;
		let dir = this.direction
		let position1: (time: number) => number | undefined = function (time: number): number | undefined {
			return time * abilityProps.PROJSPEED * dir + startPos;
		};
		let expiration1: (time: number) => boolean = function (time: number): boolean {
			//console.log("check: " + (startPos + PROJRANGE) + " " + (position(time)!));
			return (position1(time)!) * dir >= startPos + abilityProps.PROJRANGE;
		};
		damageInst1.setBehaviour(abilityProps.CASTTIME, position1, startPos, expiration1);
		/**@todo: edit this if we care about outgoing getting eaten by windwall or something else*/
		//missile start speed 60, accel 1900, max 2600
		let position2: (time: number) => number | undefined = function (time: number): number | undefined {
			//speed from accel
			let projASpeed = time * -1900;
			projASpeed = projASpeed < -2600 ? -2600 : projASpeed;
			return time * (projASpeed + (-60)) * dir + startPos + 900 * dir;
		};
		let expiration2: (time: number) => boolean = function (time: number): boolean {
			//console.log((position2(time)!));
			return (position2(time)!) * dir <= startPos;
		};
		damageInst2.setBehaviour(abilityProps.CASTTIME + abilityProps.PROJRANGE / abilityProps.PROJSPEED, position2, startPos, expiration2);
		
		this.castBuffer.push(damageInst1, damageInst2);
		this.castingTime = time + abilityProps.CASTTIME;
		this.cooldowns[Ability.Q] = time + abilityProps.CASTTIME + abilityProps.CD * (1 - this.statBuild!.getCDR(CDRType.BasicAbility));
	}

	/**
	 * @todo: move speed bonus
	 */
	public castAbilityW(target: Champion, time: number) {
		let abilityProps = this.abilityProperties.W;
		let rank: number = this.abilityLevel(Ability.W);

		let baseDamage: number = this.abilityNumber(rank, abilityProps.RANK1DMG, abilityProps.RANKUPDMG);
		let CD: number = this.abilityNumber(rank, abilityProps.RANK1CD, abilityProps.RANKUPCD);

		let damage: number = baseDamage + this.statBuild!.getTotalStat(Stat.AbilityPower) * abilityProps.APRATIO;

		let damageInst1 = new DamageInstance(this, target, "W1", DamageType.Magic, damage, time, this.castInstanceTracker, DamageTag.ActiveSpell);
		let damageInst2 = new DamageInstance(this, target, "W2", DamageType.Magic, damage * abilityProps.SUBSEQUENTDMGRATIO, time, this.castInstanceTracker, DamageTag.ActiveSpell);
		let damageInst3 = new DamageInstance(this, target, "W3", DamageType.Magic, damage * abilityProps.SUBSEQUENTDMGRATIO, time, this.castInstanceTracker, DamageTag.ActiveSpell);

		this.addBaseAndPenShares(baseDamage, "W1", damageInst1);
		damageInst1.addStatShares(this.statBuild!.getTotalStatShares(Stat.AbilityPower), abilityProps.APRATIO);

		this.addBaseAndPenShares(baseDamage * abilityProps.SUBSEQUENTDMGRATIO, "W2", damageInst2);
		damageInst2.addStatShares(this.statBuild!.getTotalStatShares(Stat.AbilityPower), abilityProps.APRATIO * abilityProps.SUBSEQUENTDMGRATIO);

		this.addBaseAndPenShares(baseDamage * abilityProps.SUBSEQUENTDMGRATIO, "W3", damageInst3);
		damageInst3.addStatShares(this.statBuild!.getTotalStatShares(Stat.AbilityPower), abilityProps.APRATIO * abilityProps.SUBSEQUENTDMGRATIO);

		let startPos = this.champPos;
		let dir = this.direction
		let position1: (time: number) => number | undefined = function (time: number): number | undefined {
			return time * abilityProps.PROJSPEED * dir + startPos;
		};
		let position2: (time: number) => number | undefined = function (time: number): number | undefined {
			return time * abilityProps.PROJSPEED * dir + startPos;
		};
		let position3: (time: number) => number | undefined = function (time: number): number | undefined {
			return time * abilityProps.PROJSPEED * dir + startPos;
		};
		damageInst1.setBehaviour(abilityProps.CASTTIME + abilityProps.DELAY, position1, startPos);
		damageInst2.setBehaviour(abilityProps.CASTTIME + abilityProps.DELAY, position2, startPos);
		damageInst3.setBehaviour(abilityProps.CASTTIME + abilityProps.DELAY, position3, startPos);

		this.castBuffer.push(damageInst1, damageInst2, damageInst3);
		this.castingTime = time + abilityProps.CASTTIME;
		this.cooldowns[Ability.W] = time + abilityProps.CASTTIME + CD * (1 - this.statBuild!.getCDR(CDRType.BasicAbility));
	}

	public castAbilityE(target: Champion, time: number) {
		let abilityProps = this.abilityProperties.E;


		let rank: number = this.abilityLevel(Ability.E);

		let baseDamage: number = this.abilityNumber(rank, abilityProps.RANK1DMG, abilityProps.RANKUPDMG);
		

		let damage: number = baseDamage + this.statBuild!.getTotalStat(Stat.AbilityPower) * abilityProps.APRATIO;


		let damageInst1 = new DamageInstance(this, target, "E", DamageType.Magic, damage, time, this.castInstanceTracker, DamageTag.ActiveSpell);

		this.addBaseAndPenShares(baseDamage, "E", damageInst1);
		damageInst1.addStatShares(this.statBuild!.getTotalStatShares(Stat.AbilityPower), abilityProps.APRATIO);
		
		let startPos = this.champPos;
		let dir = this.direction;
		let position1: (time: number) => number | undefined = function (time: number): number | undefined {
			return time * abilityProps.PROJSPEED * dir + startPos;
		};
		let expiration1: (time: number) => boolean = function (time: number): boolean {
			//console.log("check: " + (startPos + abilityProps.PROJRANGE) + " " + (position1(time)!));
			return (position1(time)!) * dir >= startPos + abilityProps.PROJRANGE;
		};
		damageInst1.setBehaviour(abilityProps.CASTTIME, position1, startPos, expiration1);

		damageInst1.netCC = abilityProps.NETCC;

		this.castBuffer.push(damageInst1);
		this.castingTime = time + abilityProps.CASTTIME;
		this.cooldowns[Ability.E] = time + abilityProps.CASTTIME + abilityProps.CD * (1 - this.statBuild!.getCDR(CDRType.BasicAbility));
	}
	public castAbilityR(target: Champion, time: number) {

		let abilityProps = this.abilityProperties.R;


		let rank: number = this.abilityLevel(Ability.R);

		let baseDamage: number = this.abilityNumber(rank, abilityProps.RANK1DMG, abilityProps.RANKUPDMG);
		let CD: number = this.abilityNumber(rank, abilityProps.RANK1CD, abilityProps.RANKUPCD);

		let damage: number = baseDamage + this.statBuild!.getTotalStat(Stat.AbilityPower) * abilityProps.APRATIO;

		if (abilityProps.timeWindow <= time) {
			abilityProps.charges = 3;
			abilityProps.timeWindow = time + 15;
			this.cooldowns[Ability.R] = time + abilityProps.CASTTIME + CD * (1 - this.statBuild!.getCDR(CDRType.UltimateAbility));
		}

		this.dashSpeed = abilityProps.DASHBASESPEED + this.statBuild!.getTotalStat(Stat.MoveSpeed);
		this.dashTime = time + (abilityProps.DASHRANGE / this.dashSpeed);

		let rName = "R" + (4 - abilityProps.charges);

		let damageInst1 = new DamageInstance(this, target, rName, DamageType.Magic, damage, time, this.castInstanceTracker, DamageTag.ActiveSpell);

		this.addBaseAndPenShares(baseDamage, rName, damageInst1);
		damageInst1.addStatShares(this.statBuild!.getTotalStatShares(Stat.AbilityPower), abilityProps.APRATIO);

		let startPos = this.champPos;
		let dir = this.direction;
		let position1: (time: number) => number | undefined = function (time: number): number | undefined {
			return time * abilityProps.PROJSPEED * dir + startPos;
		};
		let expiration1: (time: number) => boolean = function (time: number): boolean {
			return (position1(time)!)*dir >= startPos + abilityProps.PROJRANGE;
		};
		damageInst1.setBehaviour(abilityProps.CASTTIME + (abilityProps.DASHRANGE / this.dashSpeed), position1, startPos, expiration1);

		

		this.castBuffer.push(damageInst1);
		this.castingTime = time + abilityProps.CASTTIME;

		
		abilityProps.charges -= 1;
		abilityProps.delay = time + abilityProps.INTERNALCD;

	}

	protected tryCastTimeCheck(time: number, ability: Ability): boolean {
		if (time >= this.cooldowns[ability] && time >= this.castingTime) {
			return true;
		}
		if (ability === Ability.R) {
			if (this.abilityProperties.R.charges > 0 && this.abilityProperties.R.delay < time && time <= this.abilityProperties.R.timeWindow) {
				return true
			}
		}
		return false;
	}

	protected tryCastCCCheck(time: number, ability: Ability): boolean {
		/**
		 * @todo: cc check
		 */

		//dash check, if applicable
		if (this.dashTime > time) {
			if(ability !== Ability.W) //ahri w can be cast during dashes
				return false;
		}


		return true;
	}

}