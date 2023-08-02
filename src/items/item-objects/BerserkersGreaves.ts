import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Boots } from './Boots';
import { Dagger } from './Dagger';

export abstract class BerserkersGreaves extends Item {
	static itemName = "Berserker's Greaves";
	static searchNames = new Array<string>(
		"boots",
		"zerker",
	);
	static image = "Berserker's_Greaves_item.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1100],
		[Stat.MoveSpeedFlat, 45],
		[Stat.AttackSpeed, .35],
	]);
	static components = new Array<Item>([
		Boots,
		Dagger,
	]);
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.All;

}
