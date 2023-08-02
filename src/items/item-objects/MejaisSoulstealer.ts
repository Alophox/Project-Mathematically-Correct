import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Glory } from '../item-passives/Glory';
import { Dread } from '../item-passives/Dread';

export abstract class MejaisSoulstealer extends Item {
	static itemName = "Mejai's Soulstealer";
	static searchNames = new Array<string>(
		"book"
	);
	static image = "Mejai's_Soulstealer_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1600],
		[Stat.AbilityPower, 20],
		[Stat.Health, 100],
	]);
	static components = [
		//DarkSeal,
	];
	static restrictions = ItemRestrictions.Glory;
	static itemCategory = ItemCategory.Mage;

	private static glory = new Glory(this.itemName);
	public static stackable = this.glory;
	static passives = new Array<Passive>(
		this.glory,
		new Dread(this.itemName, this.glory),
	);
	//static additionalTip = "";
}