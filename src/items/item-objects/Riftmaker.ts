import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { BlastingWand } from './BlastingWand';
import { LeechingLeer } from './LeechingLeer';
import { VoidCorruption } from '../item-passives/VoidCorruption';

export abstract class Riftmaker extends Item {
	static itemName = "Riftmaker";
	static searchNames = new Array<string>(
		"velkoz",
	);
	static image = "Riftmaker_item.webp";
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3200],
		[Stat.AbilityPower, 70],
		[Stat.Health, 300],
		[Stat.AbilityHaste, 15],
		[Stat.Omnivamp, .07],
	]);
	static components = new Array<Item>([
		LeechingLeer,
		BlastingWand
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new VoidCorruption(this.itemName),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.Omnivamp, .02],
		[Stat.AbilityPower, 8],
	]);
	//static additionalTip = "";
}