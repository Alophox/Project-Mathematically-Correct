import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { BlastingWand } from './BlastingWand';
import { GiantsBelt } from './GiantsBelt';
import { AmplifyingTome } from './AmplifyingTome';
import { Rimefrost } from '../item-passives/Rimefrost';

export abstract class RylaisCrystalScepter extends Item {
	static itemName = "Rylai's Crystal Scepter";
	static searchNames = new Array<string>(
		"rylais",
	);
	static image = "Rylai's_Crystal_Scepter_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2600],
		[Stat.AbilityPower, 75],
		[Stat.Health, 400],
	]);
	static components = new Array<Item>([
		BlastingWand,
		GiantsBelt,
		AmplifyingTome,
	]);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Rimefrost(this.itemName),
	);
	//static mythicStats = new Map<Stat, number>([]);
	static additionalTip = "";
}