import { Stat } from '../../Stat';
import { SapphireCrystal } from './SapphireCrystal';
import { Passive } from '../Passive';
import { RubyCrystal } from './RubyCrystal';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Eternity } from '../item-passives/Eternity';

export abstract class CatalystOfAeons extends Item {
	static itemName = "Catalyst of Aeons";
	//static searchNames = new Array<string>(	);
	static image = "Catalyst_of_Aeons_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1300],
		[Stat.Health, 300],
		[Stat.Mana, 300],
	]);
	static components = new Array<Item>(
		RubyCrystal,
		SapphireCrystal
	);
	static restrictions = ItemRestrictions.MythicComponent;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Eternity(this.itemName),
	);

}