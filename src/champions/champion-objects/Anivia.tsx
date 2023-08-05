import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Anivia extends Champion {
	public get getClassName(): string { return "Anivia" };
	public readonly championName = "Anivia";
	public readonly epithet = "The Cryophoenix";
	public readonly image = "AkshanSquare.webp";
	public readonly class = Class.Battlemage;
	public readonly rangeType = RangeType.Ranged;
	public readonly adaptiveType = AdaptiveType.Magic;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 550],
		[Stat.HealthRegen, 5.5],
		[Stat.Mana, 495],
		[Stat.ManaRegen, 8],
		[Stat.Armor, 21],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 51],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 325],
		[Stat.AttackRange, 600],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 92],
		[Stat.HealthRegen, .55],
		[Stat.Mana, 45],
		[Stat.ManaRegen, .8],
		[Stat.Armor, 4.9],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 3.2],
		[Stat.AttackSpeed, .0168],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .625;
	protected readonly baseAttackWindup = .2;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = 1600; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}