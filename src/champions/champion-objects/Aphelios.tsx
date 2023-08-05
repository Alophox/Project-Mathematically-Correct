import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Aphelios extends Champion {
	public get getClassName(): string { return "Aphelios" };
	public readonly championName = "Aphelios";
	public readonly epithet = "The Weapon of the Faithful";
	public readonly image = "ApheliosSquare.webp";
	public readonly class = Class.Marksman;
	public readonly rangeType = RangeType.Ranged;
	public readonly adaptiveType = AdaptiveType.Physical;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 580],
		[Stat.HealthRegen, 3.25],
		[Stat.Mana, 348],
		[Stat.ManaRegen, 6.5],
		[Stat.Armor, 26],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 55],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 325],
		[Stat.AttackRange, 550],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 102],
		[Stat.HealthRegen, .55],
		[Stat.Mana, 42],
		[Stat.ManaRegen, .4],
		[Stat.Armor, 4.2],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 3],
		[Stat.AttackSpeed, .021],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .64;
	protected readonly baseAttackWindup = .15333;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed

	/**@todo different guns have different speeds*/
	protected readonly missileSpeed = undefined; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}