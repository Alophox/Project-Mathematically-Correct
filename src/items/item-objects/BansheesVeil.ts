import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Annul } from '../item-passives/Annul';
import { VerdantBarrier } from './VerdantBarrier';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { NeedlesslyLargeRod } from './NeedlesslyLargeRod';

export abstract class BansheesVeil extends Item {
	static itemName = "Banshee's Veil";
	static searchNames = new Array<string>(
		"bv",
		"spellshield"
	);
	static image = "Banshee's_Veil_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3100],
		[Stat.AbilityPower, 120],
		[Stat.MagicResist, 50],
	]);
	static components = [
		NeedlesslyLargeRod,
		VerdantBarrier,
	];
	static restrictions = ItemRestrictions.Annul;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Annul(this.itemName),
	);
	static additionalTip = "Annul currently has no impact on any calculations.";
}