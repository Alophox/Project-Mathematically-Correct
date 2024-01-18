import { Stat } from "../../Stat";
import { AdaptiveType, Champion, Class, RangeType, ResourceType } from "../Champion";


export class TargetDummy extends Champion {
	public get getClassName(): string { return "TargetDummy" };


	public readonly championName = "Target Dummy";
	public readonly epithet = "The Training Dummy";
	public readonly image = "Target_Dummy_TFT_item.webp";
	//public readonly class = Class.Burst;
	//public readonly rangeType = RangeType.Ranged;
	//public readonly adaptiveType = AdaptiveType.Magic;
	/**
	 * can be edited, such as when setting attributes- only this champion will have this feature
	 */
	public static staticBaseStats = new Map<Stat, number>([
		[Stat.Health, 1000],
//		[Stat.HealthRegen, 0],
		[Stat.Armor, 0],
		[Stat.MagicResist, 0],
		//[Stat.MoveSpeedFlat, 0],
	]);
	public get baseStats(): Map<Stat, number> {
		return TargetDummy.staticBaseStats;
	};

	/**
	 * can be edited, such as when setting attributes- only this champion will have this feature
	 */
	public levelStats = new Map<Stat, number>([
		[Stat.Health, 0],
//		[Stat.HealthRegen, 0],
		[Stat.Armor, 0],
		[Stat.MagicResist, 0],
	]);
	public readonly resourceType = ResourceType.None;

	//some stats are utilized only within the champion
	//protected readonly baseAttackSpeed = .668;
	//protected readonly baseAttackWindup = .20054;
	//protected readonly baseAttackSpeedRatio = -1; //ASRatio is -1 when not explicitly stated, meaning it'd be the same as base attack speed
	//protected readonly missileSpeed = 1750; //-1 when non-existent, aka hitscan, such as melee or lasers like senna or vel'koz

	public readonly additionalTip: string = "";


	public init() {
		this.currentHealth = this.statBuild!.getTotalStat(Stat.Health);
	}
}