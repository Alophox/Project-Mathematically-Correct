import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { LostChapter } from './LostChapter';
import { FiendishCodex } from './FiendishCodex';
import { Scorn } from '../item-passives/Scorn';
import { Hatefog } from '../item-passives/Hatefog';

export abstract class Malignance extends Item {
	static itemName = "Malignance";
	//static searchNames = new Array<string>();
	static image = "Malignance_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2800],
		[Stat.AbilityPower, 80],
		[Stat.Mana, 600],
		[Stat.AbilityHaste, 20],
		
	]);
	static components = new Array<Item>([
		LostChapter,
		FiendishCodex
	]);
	static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Scorn(this.itemName),
		new Hatefog(this.itemName)
	);
	//static mythicStats = new Map<Stat, number>([
	//	[Stat.MagicPenetrationFlat, 5]
	//]);
	//static additionalTip = "";
}