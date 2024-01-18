import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';

export abstract class NeedlesslyLargeRod extends Item {
	static itemName = "Needlessly Large Rod";
	static searchNames = new Array<string>(
		"nlr"
	);
	static image = "Needlessly_Large_Rod_item.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1250],
		[Stat.AbilityPower, 70]
	]);
	//static components = [];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;


}