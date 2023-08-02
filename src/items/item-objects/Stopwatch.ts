import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Stasis } from '../item-passives/Stasis';

export abstract class Stopwatch extends Item {
	static itemName = "Stopwatch";
	static searchNames = new Array<string>(
		"zhg",
		"zonyas",
		"zhonyas",
	);
	static image = "Stopwatch_item_HD.webp"
	static type = ItemType.Basic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 750],
	]);
	//static components = [];
	//static restrictions = ;
	static itemCategory = ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Stasis(this.itemName),
	);

	static additionalTip = "Stopwatch cannot be purchased if a Guardian Angel or a Zhonya's Hourglass is owned(you can still complete the other item)."
}