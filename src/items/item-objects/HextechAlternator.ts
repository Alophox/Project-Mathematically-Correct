import { Stat } from '../../Stat';
import { Item, ItemCategory, ItemType } from '../Item';
import { Revved } from '../item-passives/Revved';
import { Passive } from '../Passive';
import { AmplifyingTome } from './AmplifyingTome';
import { RubyCrystal } from './RubyCrystal';

export abstract class HextechAlternator extends Item {
	static itemName = "Hextech Alternator";
	static searchNames = new Array<string>(
		"revolver",
	);
	static image = "Hextech_Alternator_item.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1050],
		[Stat.AbilityPower, 25],
		[Stat.Health, 150],
	]);
	static components = new Array<Item>(
		AmplifyingTome,
		RubyCrystal
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Revved(this.itemName),
	);

}