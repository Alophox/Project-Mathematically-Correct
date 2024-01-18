import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { MinionDamageBuff } from '../item-passives/MinionDamageBuff';
import { Item, ItemCategory, ItemType } from '../Item';
import { Restoration } from '../item-passives/Restoration';


export abstract class DoransRing extends Item {
	static itemName = "Doran's Ring";
	//static searchNames = new Array<string>();
	static image = "Doran's_Ring_item.webp"
	static type = ItemType.Starter;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 400],
		[Stat.AbilityPower, 18],
		[Stat.Health, 90],
	]);
	//static components = [];
	//static restrictions = Item.ItemRestrictions.None;
	static itemCategory = ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank;
	static passives = new Array<Passive>(
		new MinionDamageBuff(this.itemName),
		new Restoration(this.itemName),
	);
	//static additionalTip = "";
}