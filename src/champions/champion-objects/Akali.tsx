import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Akali extends Champion {
	public get getClassName(): string { return "Akali" };
	public readonly championName = "Akali";
	public readonly epithet = "The Rogue Assassin";
	public readonly image = "AkaliSquare.webp";
	public readonly class = Class.Assassin;
	public readonly rangeType = RangeType.Melee;
	public readonly adaptiveType = AdaptiveType.Physical;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 570],
		[Stat.HealthRegen, 9],
		[Stat.Mana, 200],
		[Stat.ManaRegen, 50],
		[Stat.Armor, 23],
		[Stat.MagicResist, 37],
		[Stat.AttackDamage, 62],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 345],
		[Stat.AttackRange, 125],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 119],
		[Stat.HealthRegen, .9],
		[Stat.Armor, 4.7],
		[Stat.MagicResist, 2.05],
		[Stat.AttackDamage, 3.3],
		[Stat.AttackSpeed, .032],
	]);
	public readonly resourceType = ResourceType.Energy;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .625;
	protected readonly baseAttackWindup = .139;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = undefined; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}