import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { LostChapter } from './LostChapter';
import { Fire } from '../item-passives/Fire';
import { HextechAlternator } from './HextechAlternator';
import { Load } from '../item-passives/Load';

export abstract class LudensCompanion extends Item {
	static itemName = "Luden's Companion";
	static searchNames = new Array<string>(
		"boomstick",
	);
	static image = "Luden's_Companion_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2900],
		[Stat.AbilityPower, 95],
		[Stat.Mana, 600],
		[Stat.AbilityHaste, 20],
		
	]);
	static components = new Array<Item>([
		LostChapter,
		HextechAlternator
	]);
	static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	private static load = new Load(this.itemName);
	public static stackable = this.load;
	static passives = new Array<Passive>(
		this.load,
		new Fire(this.itemName,this.load),
	);
	//static mythicStats = new Map<Stat, number>([
	//	[Stat.MagicPenetrationFlat, 5]
	//]);
	//static additionalTip = "";
}