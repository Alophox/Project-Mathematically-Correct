import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Akshan extends Champion {
	public get getClassName(): string { return "Akshan" };
	public readonly championName = "Akshan";
	public readonly epithet = "The Rogue Sentinel";
	public readonly image = "AkshanSquare.webp";
	public readonly class = Class.Marksman | Class.Assassin;
	public readonly rangeType = RangeType.Ranged;
	public readonly adaptiveType = AdaptiveType.Physical;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 630],
		[Stat.HealthRegen, 3.75],
		[Stat.Mana, 350],
		[Stat.ManaRegen, 8.2],
		[Stat.Armor, 26],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 52],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 330],
		[Stat.AttackRange, 500],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 104],
		[Stat.HealthRegen, .65],
		[Stat.Mana, 40],
		[Stat.ManaRegen, .7],
		[Stat.Armor, 4.2],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 3.5],
		[Stat.AttackSpeed, .04],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .638;
	protected readonly baseAttackWindup = .1333;
	protected readonly baseAttackSpeedRatio = .4; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = 2000; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}