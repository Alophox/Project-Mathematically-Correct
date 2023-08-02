import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { FiendishCodex } from './FiendishCodex';
import { SeekersArmguard } from './SeekersArmguard';
import { Stopwatch } from './Stopwatch';
import { Stasis } from '../item-passives/Stasis';

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
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 80],
		[Stat.Armor, 45],
		[Stat.AbilityHaste, 15],
	]);
	static components = [
		FiendishCodex,
		SeekersArmguard,
		Stopwatch,
	];
	//static restrictions = Item.ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Stasis(this.itemName),
	);
	//tatic additionalTip = "";
}