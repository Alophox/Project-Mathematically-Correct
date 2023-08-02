import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { LostChapter } from './LostChapter';
import { FiendishCodex } from './FiendishCodex';
import { Agony } from '../item-passives/Agony';
import { Torment } from '../item-passives/Torment';

export abstract class LiandrysAnguish extends Item {
	static itemName = "Liandry's Anguish";
	static searchNames = new Array<string>(
		"last shadow",
		"ls",
	);
	static image = "Liandry's_Anguish_item.webp"
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3200],
		[Stat.AbilityPower, 80],
		[Stat.Mana, 600],
		[Stat.AbilityHaste, 20],
	]);
	static components = new Array<Item>([
		LostChapter,
		FiendishCodex
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Agony(this.itemName),
		new Torment(this.itemName),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.AbilityHaste, 5]
	]);
	//static additionalTip = "";
}