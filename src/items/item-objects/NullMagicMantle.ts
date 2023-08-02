import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';


export abstract class NullMagicMantle extends Item {
	static itemName = "Null-Magic Mantle";
	//static searchNames = new Array<string>();
	static image = "Null-Magic_Mantle_item.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 450],
		[Stat.MagicResist, 25]
	]);
	//static components = new Array<Item.Item>();
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;
	//static passives = new Array<ItemPassive>();

}