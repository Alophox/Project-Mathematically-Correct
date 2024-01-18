import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { BlightingJewel } from './BlightingJewel';
import { FiendishCodex } from './FiendishCodex';
import { Passive } from '../Passive';
import { LifeFromDeath } from '../item-passives/LifeFromDeath';


export abstract class Cryptbloom extends Item {
	static itemName = "Cryptbloom";
	static image = "Cryptbloom_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2850],
		[Stat.AbilityPower, 70],
		[Stat.MagicPenetrationPercent, .3],
		[Stat.AbilityHaste, 15],
	]);
	static components = new Array<Item>(
		BlightingJewel,
		FiendishCodex
	);
	static restrictions = ItemRestrictions.VoidPen;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new LifeFromDeath(this.itemName),
	);
}