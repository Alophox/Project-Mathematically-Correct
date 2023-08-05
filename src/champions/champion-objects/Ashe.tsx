import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Ashe extends Champion {
	public get getClassName(): string { return "Ashe" };
	public readonly championName = "Ashe";
	public readonly epithet = "The Frost Archer";
	public readonly image = "AsheSquare.webp";
	public readonly class = Class.Marksman;
	public readonly rangeType = RangeType.Ranged;
	public readonly adaptiveType = AdaptiveType.Physical;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 640],
		[Stat.HealthRegen, 3.5],
		[Stat.Mana, 280],
		[Stat.ManaRegen, 7],
		[Stat.Armor, 26],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 59],
		[Stat.CriticalStrikeDamage, 1],
		[Stat.MoveSpeedFlat, 325],
		[Stat.AttackRange, 600],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 101],
		[Stat.HealthRegen, .55],
		[Stat.Mana, 35],
		[Stat.ManaRegen, .65],
		[Stat.Armor, 4.6],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 2.95],
		[Stat.AttackSpeed, .0333],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .658;
	protected readonly baseAttackWindup = .2193;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = 2500; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}