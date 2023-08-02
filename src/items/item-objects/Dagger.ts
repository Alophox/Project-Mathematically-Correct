import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';


export abstract class Dagger extends Item {
	static itemName = "Dagger";
	//static searchNames = new Array<string>();
	static image = "Dagger_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 300],
		[Stat.AttackSpeed, .12]
	]);
	//static components = new Array<Item.Item>();
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman |  ItemCategory.Mage;
	//static passives = new Array<ItemPassive>();

}