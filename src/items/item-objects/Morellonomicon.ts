import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { OblivionOrb } from './OblivionOrb';
import { Affliction } from '../item-passives/Affliction';
import { FiendishCodex } from './FiendishCodex';

export abstract class Morellonomicon extends Item {
	static itemName = "Morellonomicon";
	static searchNames = new Array<string>(
		"nmst",
		"grievous",
		"last shadow",
		"book",
		"forbidden book",
	);
	static image = "Morellonomicon_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2200],
		[Stat.AbilityPower, 90],
		[Stat.AbilityHaste, 15],
	]);
	static components = new Array<Item>([
		OblivionOrb,
		FiendishCodex,
	]);
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Affliction(this.itemName),
	);

}