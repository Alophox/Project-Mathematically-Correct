import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { HextechAlternator } from './HextechAlternator';
import { FiendishCodex } from './FiendishCodex';
import { Hypershot } from '../item-passives/Hypershot';
export abstract class HorizonFocus extends Item {
	static itemName = "Horizon Focus";
	//static searchNames = new Array<string>();
	static image = "Horizon_Focus_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2700],
		[Stat.AbilityPower, 90],
		[Stat.AbilityHaste, 20],
	]);
	static components = new Array<Item>(
		HextechAlternator,
		FiendishCodex,
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Hypershot(this.itemName),
	);
	//static additionalTip = "";
}