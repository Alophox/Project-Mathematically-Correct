import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Boots } from './Boots';

export abstract class BootsOfSwiftness extends Item {
	static itemName = "Boots of Swiftness";
	static searchNames = new Array<string>(
		"swifties",
	);
	static image = "Boots_of_Swiftness_item_HD.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 900],
		[Stat.MoveSpeedFlat, 60],
		[Stat.SlowResist, .25],
	]);
	static components = new Array<Item>([
		Boots,
	]);
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.All;

}
