import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Boots } from './Boots';

export abstract class IonianBootsOfLucidity extends Item {
	static itemName = "Ionian Boots of Lucidity";
	//static searchNames = new Array<string>();
	static image = "Ionian_Boots_of_Lucidity_item_HD.webp"
	static type = ItemType.Boots;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 900],
		[Stat.AbilityHaste, 15],
		[Stat.MoveSpeedFlat, 45],
		[Stat.SummonerSpellHaste, 12],
	]);
	static components = new Array<Item>([
		Boots,
	]);
	static restrictions = ItemRestrictions.Boots;
	static itemCategory = ItemCategory.All;

}
