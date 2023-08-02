import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Boots } from './Boots';
import { NullMagicMantle } from './NullMagicMantle';

export abstract class MercurysTreads extends Item {
	static itemName = "Mercury's Treads";
	static searchNames = new Array<string>(
		"boots",
		"mercs",
	);
	static image = "Mercury's_Treads_item_HD.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1100],
		[Stat.MagicResist, 25],
		[Stat.MoveSpeedFlat, 45],
		[Stat.TenacityA, .3],
	]);
	static components = new Array<Item>([
		Boots,
		NullMagicMantle
	]);
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.All;

}
