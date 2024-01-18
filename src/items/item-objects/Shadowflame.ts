import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { HextechAlternator } from './HextechAlternator';
import { NeedlesslyLargeRod } from './NeedlesslyLargeRod';
import { Cinderbloom } from '../item-passives/Cinderbloom';
export abstract class Shadowflame extends Item {
	static itemName = "Shadowflame";
	//static searchNames = new Array<string>();
	static image = "Shadowflame_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3200],
		[Stat.AbilityPower, 120],
		[Stat.MagicPenetrationFlat, 12],

	]);
	static components = new Array<Item>(
		HextechAlternator,
		NeedlesslyLargeRod,
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Cinderbloom(this.itemName),
	);
	//static additionalTip = "";
}