import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { Passive } from '../Passive';
import { NullMagicMantle } from './NullMagicMantle';
import { Adaptive } from '../item-passives/Adaptive';

export abstract class VerdantBarrier extends Item {
	static itemName = "Verdant Barrier";
	static searchNames = new Array<string>(
		"necklace",
	);
	static image = "Verdant_Barrier_item_HD.webp";
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1000],
		[Stat.AbilityPower, 20],
		[Stat.MagicResist, 25]
	]);
	static components = new Array<Item>([
		AmplifyingTome,
		NullMagicMantle
	]);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Adaptive(this.itemName),
	);
	//public static stackable = this.passives[0];
}