import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class AurelionSol extends Champion {
	public get getClassName(): string { return "AurelionSol" };
	public readonly championName = "Aurelion Sol";
	public readonly epithet = "The Star forger";
	public readonly image = "Aurelion_SolSquare.webp";
	public readonly class = Class.Battlemage;
	public readonly rangeType = RangeType.Ranged;
	public readonly adaptiveType = AdaptiveType.Magic;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 620],
		[Stat.HealthRegen, 5.5],
		[Stat.Mana, 530],
		[Stat.ManaRegen, 8],
		[Stat.Armor, 22],
		[Stat.MagicResist, 30],
		[Stat.AttackDamage, 55],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 335],
		[Stat.AttackRange, 550],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 90],
		[Stat.HealthRegen, .55],
		[Stat.Mana, 40],
		[Stat.ManaRegen, .75],
		[Stat.Armor, 4],
		[Stat.MagicResist, 1.3],
		[Stat.AttackDamage, 3.2],
		[Stat.AttackSpeed, .015],
	]);
	public readonly resourceType = ResourceType.Mana;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .625;
	protected readonly baseAttackWindup = .2;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed

	/**@todo missing actual speed*/
	protected readonly missileSpeed = 1000; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}