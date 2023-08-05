import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Azir extends Champion {
	public get getClassName(): string { return "Azir" };
	public readonly championName = "Azir";
	public readonly epithet = "The Emperor of the Sands";
	public readonly image = "AzirSquare.webp";
	public readonly class = Class.Marksman | Class.Mage;
	public readonly rangeType = RangeType.Ranged;
	public readonly adaptiveType = AdaptiveType.Magic;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 550],
		[Stat.HealthRegen, 7],
		[Stat.Mana, 320],
		[Stat.ManaRegen, 8],
		[Stat.Armor, 22],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 52],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 335],
		[Stat.AttackRange, 525],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 119],
		[Stat.HealthRegen, .75],
		[Stat.Mana, 40],
		[Stat.ManaRegen, .8],
		[Stat.Armor, 5],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 3.5],
		[Stat.AttackSpeed, .06],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .625;
	protected readonly baseAttackWindup = .15625;
	protected readonly baseAttackSpeedRatio = .694; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = undefined; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}