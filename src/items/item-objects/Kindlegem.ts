import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { RubyCrystal } from './RubyCrystal';
export abstract class Kindlegem extends Item {
	static itemName = "Kindlegem";
	//static searchNames = new Array<string>();
	static image = "Kindlegem_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 800],
		[Stat.Health, 200],
		[Stat.AbilityHaste, 10]
	]);
	static components = new Array<Item>(
		RubyCrystal
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Assassin | ItemCategory.Mage | ItemCategory.Tank | ItemCategory.Support;
	//static passives = new Array<ItemPassive>();
}