import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Dread, Glory } from '../item-passives';


export abstract class DarkSeal extends Item {
	static itemName = "Dark Seal";
	static searchNames = new Array<string>(
		"noxian"
	);
	static image = "Dark_Seal_item_HD.webp"
	static type = ItemType.Starter;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 350],
		[Stat.AbilityPower, 15],
		[Stat.Health, 50],
	]);
	//static components = [];
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