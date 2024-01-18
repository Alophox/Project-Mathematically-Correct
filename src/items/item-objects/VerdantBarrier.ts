import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { Passive } from '../Passive';
import { NullMagicMantle } from './NullMagicMantle';
import { Annul } from '../item-passives';

export abstract class VerdantBarrier extends Item {
	static itemName = "Verdant Barrier";
	static searchNames = new Array<string>(
		"necklace",
	);
	static image = "Verdant_Barrier_item_HD.webp";
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1800],
		[Stat.AbilityPower, 40],
		[Stat.MagicResist, 30]
	]);
	static components = new Array<Item>([
		AmplifyingTome,
		NullMagicMantle
	]);
	static restrictions = ItemRestrictions.Annul;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Annul(this.itemName),
	);
	//public static stackable = this.passives[0];
}