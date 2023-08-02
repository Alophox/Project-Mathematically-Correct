import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
export abstract class FiendishCodex extends Item {
	static itemName = "Fiendish Codex";
	static searchNames = new Array<string>(
		"book",
	);
	static image = "Fiendish_Codex_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 900],
		[Stat.AbilityPower, 35],
		[Stat.AbilityHaste, 10]
	]);
	static components = new Array<Item>(
		AmplifyingTome
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage | ItemCategory.Support;
	//static passives = new Array<ItemPassive>();
}