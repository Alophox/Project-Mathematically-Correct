import { Stat } from '../../Stat';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';


export abstract class Boots extends Item {
	static itemName = "Boots";
	//static searchNames = new Array<string>();
	static image = "Boots_item_HD.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 300],
		[Stat.MoveSpeedFlat, 25]
	]);
	//static components = new Array<Item.Item>();
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.Mage;
	//static passives = new Array<ItemPassive>();

}