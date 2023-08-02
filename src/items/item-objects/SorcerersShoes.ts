import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Boots } from './Boots';

export abstract class SorcerersShoes extends Item {
	static itemName = "Sorcerer's Shoes";
	static searchNames = new Array<string>(
		"boots",
		"sorcs",
	);
	static image = "Sorcerer's_Shoes_item.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1100],
		[Stat.MagicPenetrationFlat, 18],
		[Stat.MoveSpeedFlat, 45],
	]);
	static components = new Array<Item>([
		Boots,
	]);
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.All;

}
