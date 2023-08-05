import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class Aatrox extends Champion {
	public get getClassName(): string { return "Aatrox" };
	public readonly championName = "Aatrox";
	public readonly epithet = "The Darkin Blade";
	public readonly image = "AatroxSquare.webp";
	public readonly class = Class.Juggernaut;
	public readonly rangeType = RangeType.Melee;
	public readonly adaptiveType = AdaptiveType.Physical;

	protected readonly _baseStats = new Map<Stat, number>([
		[Stat.Health, 650],
		[Stat.HealthRegen, 3],
		[Stat.Armor, 38],
		[Stat.MagicResist, 32],
		[Stat.AttackDamage, 60],
		[Stat.CriticalStrikeDamage, 1.75],
		[Stat.MoveSpeedFlat, 345],
		[Stat.AttackRange, 175],
	]);
	public readonly levelStats = new Map<Stat, number>([
		[Stat.Health, 114],
		[Stat.HealthRegen, 1],
		[Stat.Armor, 4.45],
		[Stat.MagicResist, 2.05],
		[Stat.AttackDamage, 5],
		[Stat.AttackSpeed, .025],
	]);
	public readonly resourceType = ResourceType.None;

	//some stats are utilized only within the champion
	public readonly baseAttackSpeed = .651;
	protected readonly baseAttackWindup = .19737;
	protected readonly baseAttackSpeedRatio = undefined; //ASRatio is undefined when not explicitly stated, meaning it'd be the same as base attack speed


	protected readonly missileSpeed = undefined; //undefined when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "This champion does not have Abilities implemented";

}