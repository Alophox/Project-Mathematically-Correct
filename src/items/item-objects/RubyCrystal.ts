import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';


export abstract class RubyCrystal extends Item {
	static itemName = "Ruby Crystal";
	static searchNames = new Array<string>(
		"red"
	);
	static image = "Ruby_Crystal_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 400],
		[Stat.Health, 150]
	]);
	//static components = new Array<Item.Item>();
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;
	//static passives = new Array<ItemPassive>();

}