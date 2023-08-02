import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { NeedlesslyLargeRod } from './NeedlesslyLargeRod';
import { MagicalOpus } from '../item-passives/MagicalOpus';

export abstract class RabadonsDeathcap extends Item {
	static itemName = "Rabadon's Deathcap";
	static searchNames = new Array<string>(
		"banksys",
		"dc",
		"dcap",
		"hat",
	);
	static image = "Rabadon's_Deathcap_item.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3600],
		[Stat.AbilityPower, 120]
	]);
	static components = new Array<Item>([
		NeedlesslyLargeRod,
		NeedlesslyLargeRod,
	]);
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new MagicalOpus(this.itemName),
	);

}