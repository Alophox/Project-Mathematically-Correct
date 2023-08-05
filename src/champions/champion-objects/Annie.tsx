import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Annie extends Champion {
	public get getClassName(): string { return "Annie" };
	public readonly championName = "Annie";
	public readonly epithet = "The Dark Child";
	public readonly image = "AnnieSquare.webp";
	public readonly class = Class.Burst;
	public readonly rangeType = RangeType.Ranged;
	public readonly adaptiveType = AdaptiveType.Magic;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 560],
		[Stat.HealthRegen, 5.5],
		[Stat.Mana, 418],
		[Stat.ManaRegen, 8],
		[Stat.Armor, 19],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 50],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 335],
		[Stat.AttackRange, 625],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 102],
		[Stat.HealthRegen, .55],
		[Stat.Mana, 25],
		[Stat.ManaRegen, .8],
		[Stat.Armor, 4.7],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 2.65],
		[Stat.AttackSpeed, .0136],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .579;
	protected readonly baseAttackWindup = .19579;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = 1200; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}