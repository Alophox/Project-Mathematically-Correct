import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Steeltipped } from '../item-passives/Steeltipped';
import { Dagger } from './Dagger';
export abstract class RecurveBow extends Item {
	static itemName = "Recurve Bow";
	//static searchNames = new Array<string>();
	static image = "Recurve_Bow_item.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 700],
		[Stat.AttackSpeed, .15],
	]);
	static components = new Array<Item>(
		Dagger
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Steeltipped(this.itemName),
	);
	//static additionalTip = "";
}