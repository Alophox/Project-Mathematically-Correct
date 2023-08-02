import { Stat } from '../../Stat';
import { Item, ItemCategory, ItemType } from '../Item';

export abstract class BlastingWand extends Item {
	static itemName = "Blasting Wand";
	//static searchNames = new Array<string>();
	static image = "Blasting_Wand_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 850],
		[Stat.AbilityPower, 40]
	]);
	//static components = [];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage | ItemCategory.Tank;


}