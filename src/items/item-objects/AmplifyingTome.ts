import { Stat } from '../../Stat';
import { Item, ItemCategory, ItemType } from '../Item';

export abstract class AmplifyingTome extends Item {
	static itemName = "Amplifying Tome";
	static searchNames = new Array<string>(
		"amptome",
		"book",
	);
	static image = "Amplifying_Tome_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 400],
		[Stat.AbilityPower, 20]
	]);
	//static components = [];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Marksman | ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;


}