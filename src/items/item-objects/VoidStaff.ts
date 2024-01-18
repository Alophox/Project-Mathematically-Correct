import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { BlightingJewel } from './BlightingJewel';
import { BlastingWand } from './BlastingWand';

export abstract class VoidStaff extends Item {
	static itemName = "Void Staff";
	static image = "Void_Staff_item.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 80],
		[Stat.MagicPenetrationPercent, .4]
	]);
	static components = new Array<Item>(
		BlightingJewel,
		BlastingWand
	);
	static restrictions = ItemRestrictions.VoidPen;
	static itemCategory = ItemCategory.Mage;
	//static passives = new Array<ItemPassive>();
}