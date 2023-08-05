import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Alistar extends Champion {
	public get getClassName(): string { return "Alistar" };
	public readonly championName = "Alistar";
	public readonly epithet = "The Minotaur";
	public readonly image = "AlistarSquare.webp";
	public readonly class = Class.Vanguard;
	public readonly rangeType = RangeType.Melee;
	public readonly adaptiveType = AdaptiveType.Magic;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 685],
		[Stat.HealthRegen, 8.5],
		[Stat.Mana, 350],
		[Stat.ManaRegen, 8.5],
		[Stat.Armor, 47],
		[Stat.MagicResist, 32],
		[Stat.AttackDamage, 62],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 330],
		[Stat.AttackRange, 125],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 120],
		[Stat.HealthRegen, .85],
		[Stat.Mana, 40],
		[Stat.ManaRegen, .8],
		[Stat.Armor, 4.7],
		[Stat.MagicResist, 2.05],
		[Stat.AttackDamage, 3.75],
		[Stat.AttackSpeed, .02125],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .625;
	protected readonly baseAttackWindup = .3;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = undefined; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}