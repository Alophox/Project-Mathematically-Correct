import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { LostChapter } from './LostChapter';
import { Kindlegem } from './Kindlegem';
import { AmplifyingTome } from './AmplifyingTome';
import { Glaciate } from '../item-passives/Glaciate';

export abstract class Everfrost extends Item {
	static itemName = "Everfrost";
	static searchNames = new Array<string>(
		"GLP",
		"hose",
		"supersoaker",
	);
	static image = "Everfrost_item.webp"
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2800],
		[Stat.AbilityPower, 70],
		[Stat.Health, 250],
		[Stat.Mana, 600],
		[Stat.AbilityHaste, 20],

	]);
	static components = new Array<Item>([
		LostChapter,
		Kindlegem,
		AmplifyingTome,
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Glaciate(this.itemName),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.AbilityPower, 10]
	]);
	//static additionalTip = "";
}