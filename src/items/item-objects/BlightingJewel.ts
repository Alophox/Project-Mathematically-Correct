import { Stat } from '../../Stat';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { AmplifyingTome } from './AmplifyingTome';

export abstract class BlightingJewel extends Item {
	static itemName = "Blighting Jewel";
	static searchNames = new Array<string>(
		"purple",
	);
	static image = "Blighting_Jewel_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1100],
		[Stat.AbilityPower, 25],
		[Stat.MagicPenetrationPercent, .13]
	]);
	static components = new Array<Item>(
		AmplifyingTome
	);
	static restrictions = ItemRestrictions.VoidPen;
	static itemCategory = ItemCategory.Mage;
	//static passives = new Array<ItemPassive>();
}