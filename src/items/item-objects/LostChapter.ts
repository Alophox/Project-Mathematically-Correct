import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { SapphireCrystal } from './SapphireCrystal';
import { Passive } from '../Passive';
import { Enlighten } from '../item-passives/Enlighten';

export abstract class LostChapter extends Item {
	static itemName = "Lost Chapter";
	static searchNames = new Array<string>(
		"book",
	);
	static image = "Lost_Chapter_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1100],
		[Stat.AbilityPower, 40],
		[Stat.Mana, 300],
		[Stat.AbilityHaste, 10]
	]);
	static components = new Array<Item>(
		AmplifyingTome,
		SapphireCrystal
	);
	static restrictions = ItemRestrictions.MythicComponent;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Enlighten(this.itemName),
	);

}