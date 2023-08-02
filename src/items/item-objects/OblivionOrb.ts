import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { Passive } from '../Passive';
import { Cursed } from '../item-passives/Cursed';

export abstract class OblivionOrb extends Item {
	static itemName = "Oblivion Orb";
	static searchNames = new Array<string>(
		"grievous",
	);
	static image = "Oblivion_Orb_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 800],
		[Stat.AbilityPower, 30]
	]);
	static components = new Array<Item>([
		AmplifyingTome,
	]);
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage | ItemCategory.Support;
	static passives = new Array<Passive>(
		new Cursed(this.itemName),
	);

}