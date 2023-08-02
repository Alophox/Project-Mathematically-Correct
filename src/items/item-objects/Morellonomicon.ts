import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { Passive } from '../Passive';
import { OblivionOrb } from './OblivionOrb';
import { HextechAlternator } from './HextechAlternator';
import { Affliction } from '../item-passives/Affliction';

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
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 90],
		[Stat.MagicPenetrationFlat, 10],
		[Stat.Health, 200],
	]);
	static components = new Array<Item>([
		OblivionOrb,
		HextechAlternator,
		AmplifyingTome,
	]);
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Affliction(this.itemName),
	);

}