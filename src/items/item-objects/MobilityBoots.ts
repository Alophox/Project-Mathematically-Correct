import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Boots } from './Boots';
import { Passive } from '../Passive';

export abstract class MobilityBoots extends Item {
	static itemName = "Mobility Boots";
	static searchNames = new Array<string>(
		"boots",
		"mobies",
		"mobis",
		"zoomers",
	);
	static image = "Mobility_Boots_item_HD.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1000],
		[Stat.MoveSpeedFlat, 25],
	]);
	static components = new Array<Item>([
		Boots,
	]);
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.All;
	static passives = new Array<Passive>(

	);
}
