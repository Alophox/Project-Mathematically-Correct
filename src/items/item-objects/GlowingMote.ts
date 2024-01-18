import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';


export abstract class GlowingMote extends Item {
	static itemName = "Glowing Mote";
	//static searchNames = new Array<string>();
	static image = "Glowing_Mote_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 250],
		[Stat.AbilityHaste, 5]
	]);
	//static components = new Array<Item.Item>();
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;
	//static passives = new Array<ItemPassive>();

}