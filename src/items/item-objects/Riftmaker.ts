import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { VoidCorruption } from '../item-passives/VoidCorruption';
import { HauntingGuise } from './HauntingGuise';
import { FiendishCodex } from './FiendishCodex';

export abstract class Riftmaker extends Item {
	static itemName = "Riftmaker";
	static searchNames = new Array<string>(
		"velkoz",
	);
	static image = "Riftmaker_item.webp";
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3100],
		[Stat.AbilityPower, 80],
		[Stat.Health, 350],
		[Stat.AbilityHaste, 15],
	]);
	static components = new Array<Item>([
		HauntingGuise,
		FiendishCodex
	]);
	static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new VoidCorruption(this.itemName),
	);
	//static mythicStats = new Map<Stat, number>([
	//	[Stat.Omnivamp, .02],
	//	[Stat.AbilityPower, 8],
	//]);
	//static additionalTip = "";
}