import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Focus } from '../item-passives/Focus';
import { Item, ItemCategory, ItemType } from '../Item';
import { ManaCharge } from '../item-passives/ManaCharge';

export abstract class TearOfTheGoddess extends Item {
	static itemName = "Tear of the Goddess";
	//static searchNames = new Array<string>();
	static image = "Tear_of_the_Goddess_item_HD.webp"
	static type = ItemType.Starter;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 400],
		[Stat.Mana, 240]
	]);
	//static components = [];
	//static restrictions = Item.ItemRestrictions.None;
	static itemCategory = ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank;
	static passives = new Array<Passive>(
		new Focus(this.itemName),
		new ManaCharge(this.itemName),
	);
	//static additionalTip = "";
}