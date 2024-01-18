import { DamageInstance, DamageTag, DamageType } from "../../builds/DamageInstance";
import { CDRType, StatBuild, StatMathType } from "../../builds/StatBuild";
import { Champion } from "../../champions/Champion";
import { StatIcon, TextIcon } from "../../icons/TextIcon";
import { Stat } from "../../Stat";
import { LichBane } from "../item-objects";
import { Sheen } from "../item-objects/Sheen";
import { Passive, PassiveTrigger } from "../Passive";

/**
 * multiple effects can stack
 * damage is overriden by highest value source present
 * if this is edited, change trigger on attack hit as well
 */
export enum SpellbladeSource {
	Sheen = 0,
	EssenceReaver = 1 << 0,
	LichBane = 1 << 1,
	//technically these are unknown, only way to know for sure is having multiple mythics to test
	IcebornGauntlet = 1 << 2,
	TrinityForce = 1 << 3,
	DivineSunderer = 1 << 4,
}

export class Spellblade extends Passive {
	passiveName = "Spellblade";
	sources: SpellbladeSource;

	//additionalTip = "Spellblade Passives from multiple sources will stack everything EXCEPT damage, which is overriden by the highest priority item. See wiki for details.";

	constructor(primarySource: string, source:SpellbladeSource) {
		super(primarySource);
		this.sources = source;
	}

	private props = {
		COOLDOWN: 1.5,
		BUFFDURATION: 10,
		sheen: {
			BASEADRATIO: 1,
		},
		lichBane: {
			BASEADRATIO: 1,
			APRATIO: .5,
			ASBUFF: .5,
		}

	}

	buffEndTime: number = 0;
	cooldownTime: number = 0;
	private damageAmount(sourceChamp: Champion): number {
		switch (this.primarySource) {
			case "Sheen":
				return this.props.sheen.BASEADRATIO * sourceChamp.statBuild!.getBaseStat(Stat.AttackDamage);
			default:
				return 0;
		}
	}

	public trigger(trigger: PassiveTrigger, sourceChampion: Champion, time?: number, damageInst?: DamageInstance): void {
		switch (trigger) {
			case PassiveTrigger.IndependentStat:
				if (this.buffEndTime >= time!) {
					if(this.sources & SpellbladeSource.LichBane)
						sourceChampion.statBuild?.addStatShare(Stat.AttackSpeed, this.props.lichBane.ASBUFF, false, StatMathType.Flat, this.primarySource, this.passiveName);
				}
				break;
			case PassiveTrigger.OnAttackHit:
				if (this.buffEndTime > time!) {
					let damage: number;
					let damageInst1: DamageInstance;
					let statBuild: StatBuild = sourceChampion.statBuild!;
					switch (this.primarySource) {
					//	case DivineSunderer.itemName:
					//		//todo
					//		damage = this.props.sheen.BASEADRATIO * statBuild.getBaseStat(Stat.AttackDamage);
					//		damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Physical, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);
					//		//do heal?
					//		break;
					//	case TrinityForce.itemName:
					//		//todo
					//		damage = this.props.sheen.BASEADRATIO * statBuild.getBaseStat(Stat.AttackDamage);
					//		damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Physical, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);
					//
					//		break;
					//	case IcebornGauntlet.itemName:
					//		//todo
					//		damage = this.props.sheen.BASEADRATIO * statBuild.getBaseStat(Stat.AttackDamage);
					//		damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Physical, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);
					//		//do slow
					//		break;
						case "Lich Bane":
							damage = this.props.lichBane.BASEADRATIO * statBuild.getBaseStat(Stat.AttackDamage) + this.props.lichBane.APRATIO * statBuild.getTotalStat(Stat.AbilityPower);
							damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Magic, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);
							//console.log("eh???");
							break;
					//	case EssenceReaver.itemName:
					//		//todo
					//		damage = this.props.sheen.BASEADRATIO * statBuild.getBaseStat(Stat.AttackDamage);
					//		damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Physical, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);
					//		//do mana restore
					//		break;
					default: //sheen
						damage = this.props.sheen.BASEADRATIO * statBuild.getBaseStat(Stat.AttackDamage);
						damageInst1 = new DamageInstance(damageInst!.sourceChamp, damageInst!.targetChamp, this.passiveName, DamageType.Physical, damage, time!, damageInst!.castInstance, DamageTag.Item | DamageTag.Proc);
						break;
					}
					

					this.addDmgAndPenShares(damage, this.passiveName, damageInst1, statBuild!);

					damageInst1.applyLifestealEffectiveness = 1;

					damageInst!.targetChamp.handleDamageInst(damageInst1, time!);


					this.buffEndTime = 0;
					this.cooldownTime = time! + this.props.COOLDOWN;
				}
				break;
			case PassiveTrigger.OnAbilityCast:
				if (this.cooldownTime <= time!) {
					if (this.buffEndTime < time!) {
						this.buffEndTime = time! + this.props.BUFFDURATION;
						sourceChampion.statBuild!.updateStats(sourceChampion);
					} else {
						this.buffEndTime = time! + this.props.BUFFDURATION;
					}
					
				}
				break;
			case PassiveTrigger.Reset:
				this.buffEndTime = 0;
				this.cooldownTime = 0;
				break;
		}
	}



	public reconcile(otherPassive: this): boolean {
		//damage source override
		if (otherPassive.sources > this.sources) {
			this.primarySource = otherPassive.primarySource;
		}
		//add other sources to this
		this.sources = this.sources | otherPassive.sources;
		return false;
	}

	private descriptionDamage(statBuild?: StatBuild): JSX.Element {
		let damage: number;
		switch (this.primarySource) {
			case "Sheen":
				damage = (statBuild?.getBaseStat(Stat.AttackDamage) ?? 0) * this.props.sheen.BASEADRATIO;
				return (
					<span>
						<span className="TextPhysical">
							{this.EnhancedText(damage + " = ", statBuild)}(
							<span className={Stat[Stat.AttackDamage]}>
								{this.props.sheen.BASEADRATIO * 100}% <StatIcon stat={Stat.AttackDamage} /> Base Attack Damage{this.EnhancedText(" (" + damage + ")", statBuild)}
							</span>
							) physical damage{" "}
						</span>
						<span className="OnHit">
							<TextIcon iconName={"OnHit"} /> On-Hit{" "}
						</span>
						to the target({this.props.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
					</span>
				);
			case "Lich Bane":
				damage = (statBuild?.getBaseStat(Stat.AttackDamage) ?? 0) * this.props.lichBane.BASEADRATIO + + this.props.lichBane.APRATIO * (statBuild?.getTotalStat(Stat.AbilityPower) ?? 0);
				return (
					<span>
						<span className="TextMagic">
							{this.EnhancedText(damage + " = ", statBuild)}(
							<span className={Stat[Stat.AttackDamage]}>
								{this.props.lichBane.BASEADRATIO * 100}% <StatIcon stat={Stat.AttackDamage} /> Base Attack Damage{this.EnhancedText(" (" + damage + ")", statBuild)}
							</span>
							{" "}
							<span className={Stat[Stat.AbilityPower]}>
								+ {this.props.lichBane.APRATIO * 100}% <StatIcon stat={Stat.AbilityPower} /> Ability Power{this.EnhancedText(" (" + damage + ")", statBuild)}
							</span>
							) magic damage{" "}
						</span>
						<span className="OnHit">
							<TextIcon iconName={"OnHit"} /> On-Hit{" "}
						</span>
						to the target({this.props.COOLDOWN * (1 - (statBuild?.getCDR(CDRType.Item) ?? 0))}s <StatIcon stat={Stat.Cooldown} /> cooldown).
					</span>
				);

			default:
				return <span> damage not implemented</span>;
		}
	}

	DescriptionElement = (statBuild?: StatBuild) => {
		return (
			<span>
				After using an Ability, your next Attack within {this.props.BUFFDURATION} seconds will deal an additional{" "}
				{this.descriptionDamage(statBuild)}
			</span>
		);
	}
}