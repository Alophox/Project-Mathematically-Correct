import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { Passive } from '../Passive';
import { Glide } from '../item-passives/Glide';
import { Item, ItemCategory, ItemType } from '../Item';

export abstract class AetherWisp extends Item {
	static itemName = "Aether Wisp";
	static searchNames = new Array<string>(
		"spooky ghost",
	);
	static image = "Aether_Wisp_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 850],
		[Stat.AbilityPower, 35]
	]);
	static components = new Array<Item>([
		AmplifyingTome,
	]);
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Glide(this.itemName),
	);
	
}