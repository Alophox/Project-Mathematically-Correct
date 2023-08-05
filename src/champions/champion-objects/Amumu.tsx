import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Amumu extends Champion {
	public get getClassName(): string { return "Amumu" };
	public readonly championName = "Amumu";
	public readonly epithet = "The Sad Mummy";
	public readonly image = "AmumuSquare.webp";
	public readonly class = Class.Vanguard;
	public readonly rangeType = RangeType.Melee;
	public readonly adaptiveType = AdaptiveType.Magic;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 685],
		[Stat.HealthRegen, 0.85],
		[Stat.Mana, 285],
		[Stat.ManaRegen, 7.4],
		[Stat.Armor, 30],
		[Stat.MagicResist, 32],
		[Stat.AttackDamage, 53],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 335],
		[Stat.AttackRange, 125],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 94],
		[Stat.HealthRegen, .85],
		[Stat.Mana, 40],
		[Stat.ManaRegen, .55],
		[Stat.Armor, 4],
		[Stat.MagicResist, 2.05],
		[Stat.AttackDamage, 3.8],
		[Stat.AttackSpeed, .0218],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .736;
	protected readonly baseAttackWindup = .23384;
	protected readonly baseAttackSpeedRatio = .638; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = undefined; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}