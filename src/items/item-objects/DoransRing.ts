import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Focus } from '../item-passives/Focus';
import { Item, ItemCategory, ItemType } from '../Item';
import { Drain } from '../item-passives/Drain';


export abstract class DoransRing extends Item {
	static itemName = "Doran's Ring";
	//static searchNames = new Array<string>();
	static image = "Doran's_Ring_item.webp"
	static type = ItemType.Starter;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 400],
		[Stat.AbilityPower, 15],
		[Stat.Health, 70],
	]);
	//static components = [];
	//static restrictions = Item.ItemRestrictions.None;
	static itemCategory = ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank;
	static passives = new Array<Passive>(
		new Focus(this.itemName),
		new Drain(this.itemName),
	);
	//static additionalTip = "";
}