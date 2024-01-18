import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { NullMagicMantle } from './NullMagicMantle';

export abstract class NegatronCloak extends Item {
	static itemName = "Negatron Cloak";
	//static searchNames = new Array<string>();
	static image = "Negatron_Cloak_item_HD.webp";
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 900],
		[Stat.MagicResist, 50]
	]);
	static components = new Array<Item>([
		NullMagicMantle
	]);
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Tank | ItemCategory.Support;
	//static passives = new Array<Passive>();
	//public static stackable = this.passives[0];
}