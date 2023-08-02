import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';


export abstract class ClothArmor extends Item {
	static itemName = "Cloth Armor";
	//static searchNames = new Array<string>();
	static image = "Cloth_Armor_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 300],
		[Stat.Armor, 15]
	]);
	//static components = new Array<Item.Item>();
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;
	//static passives = new Array<ItemPassive>();

}