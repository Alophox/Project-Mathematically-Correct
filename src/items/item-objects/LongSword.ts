import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';

export abstract class LongSword extends Item {
	static itemName = "Long Sword";
	//static searchNames = new Array<string>();
	static image = "Long_Sword_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 350],
		[Stat.AttackDamage, 10]
	]);
	//static components = [];
	//static restrictions = Item.ItemRestrictions.None;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Assassin;


}