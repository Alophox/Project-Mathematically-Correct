import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { RubyCrystal } from './RubyCrystal';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { AmplifyingTome } from './AmplifyingTome';
import { Madness } from '../item-passives/Madness';

export abstract class HauntingGuise extends Item {
	static itemName = "Haunting Guise";
	//static searchNames = new Array<string>(	);
	static image = "Haunting_Guise_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1300],
		[Stat.AbilityPower, 35],
		[Stat.Health, 200],
	]);
	static components = new Array<Item>(
		AmplifyingTome,
		RubyCrystal,
	);
	static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Madness(this.itemName),
	);

}