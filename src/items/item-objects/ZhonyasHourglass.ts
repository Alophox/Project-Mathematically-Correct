import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { SeekersArmguard } from './SeekersArmguard';
import { TimeStop } from '../item-passives/TimeStop';
import { NeedlesslyLargeRod } from './NeedlesslyLargeRod';

export abstract class ZhonyasHourglass extends Item {
	static itemName = "Zhonya's Hourglass";
	static searchNames = new Array<string>(
		"zhg",
		"zonyas",
		"zhonyas",
	);
	static image = "Zhonya's_Hourglass_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3250],
		[Stat.AbilityPower, 120],
		[Stat.Armor, 50],
	]);
	static components = [
		NeedlesslyLargeRod,
		SeekersArmguard,
	];
	//static restrictions = Item.ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new TimeStop(this.itemName),
	);
	//static additionalTip = "";
}