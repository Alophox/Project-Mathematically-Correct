import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { RubyCrystal } from './RubyCrystal';
export abstract class GiantsBelt extends Item {
	static itemName = "Giant's Belt";
	//static searchNames = new Array<string>();
	static image = "Giant's_Belt_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 900],
		[Stat.Health, 350],
	]);
	static components = new Array<Item>(
		RubyCrystal
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;
	//static passives = new Array<ItemPassive>();
}