import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Annul } from '../item-passives/Annul';
import { FiendishCodex } from './FiendishCodex';
import { VerdantBarrier } from './VerdantBarrier';
import { Item, ItemCategory, ItemType } from '../Item';

export abstract class BansheesVeil extends Item {
	static itemName = "Banshee's Veil";
	static searchNames = new Array<string>(
		"bv",
		"spellshield"
	);
	static image = "Banshee's_Veil_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2600],
		[Stat.AbilityPower, 80],
		[Stat.MagicResist, 45],
		[Stat.AbilityHaste, 10],
	]);
	static components = [
		FiendishCodex,
		VerdantBarrier,
	];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Annul(this.itemName),
	);
	static additionalTip = "Annul currently has no impact on any calculations.";
}