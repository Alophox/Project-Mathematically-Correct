import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Boots } from './Boots';
import { ClothArmor } from './ClothArmor';
import { Passive } from '../Passive';
import { PlatedSteelcapsPassive } from '../item-passives/PlatedSteelcapsPassive';

export abstract class PlatedSteelcaps extends Item {
	static itemName = "Plated Steelcaps";
	static searchNames = new Array<string>(
		"boots",
		"ninja tabi",
	);
	static image = "Plated_Steelcaps_item_HD.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1100],
		[Stat.Armor, 20],
		[Stat.MoveSpeedFlat, 45],
	]);
	static components = new Array<Item>([
		Boots,
		ClothArmor,
	]);
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.All;
	static passives = new Array<Passive>(
		new PlatedSteelcapsPassive(this.itemName),
	);
}
