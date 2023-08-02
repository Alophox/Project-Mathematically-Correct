import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { RubyCrystal } from './RubyCrystal';

export abstract class LeechingLeer extends Item {
	static itemName = "Leeching Leer";
	static searchNames = new Array<string>(
		"wota",
		"catalyst",
	);
	static image = "Leeching_Leer_item.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1300],
		[Stat.AbilityPower, 20],
		[Stat.Health, 250],
		[Stat.Omnivamp, .05]
	]);
	static components = new Array<Item>(
		AmplifyingTome,
		RubyCrystal
	);
	static restrictions = ItemRestrictions.MythicComponent;
	static itemCategory = ItemCategory.Mage;
	//static passives = new Array<Passive>();

}