import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';

export abstract class SapphireCrystal extends Item {
	static itemName = "Sapphire Crystal";
	static searchNames = new Array<string>(
		"blue",
	);
	static image = "Sapphire_Crystal_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 350],
		[Stat.Mana, 250]
	]);
	//static components = [];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;


}