import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { BlastingWand } from './BlastingWand';
import { LostChapter } from './LostChapter';
import { Echo } from '../item-passives/Echo';

export abstract class LudensTempest extends Item {
	static itemName = "Luden's Tempest";
	static searchNames = new Array<string>(
		"boomstick",
	);
	static image = "Luden's_Tempest_item_HD.webp"
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3200],
		[Stat.AbilityPower, 80],
		[Stat.MagicPenetrationFlat, 6],
		[Stat.Mana, 600],
		[Stat.AbilityHaste, 20],
		
	]);
	static components = new Array<Item>([
		LostChapter,
		BlastingWand
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Echo(this.itemName),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.MagicPenetrationFlat, 5]
	]);
	//static additionalTip = "";
}