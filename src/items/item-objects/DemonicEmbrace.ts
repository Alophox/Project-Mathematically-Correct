import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { BlastingWand } from './BlastingWand';
import { GiantsBelt } from './GiantsBelt';
import { AmplifyingTome } from './AmplifyingTome';
import { DarkPact } from '../item-passives/DarkPact';
import { AzakanaGaze } from '../item-passives/AzakanaGaze';

export abstract class DemonicEmbrace extends Item {
	static itemName = "Demonic Embrace";
	static searchNames = new Array<string>(
		"helmet",
	);
	static image = "Demonic_Embrace_item.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 75],
		[Stat.Health, 350],
	]);
	static components = new Array<Item>([
		BlastingWand,
		GiantsBelt,
		AmplifyingTome,
	]);
//	static restrictions = ;
	static itemCategory = ItemCategory.Mage | ItemCategory.Tank;
	static passives = new Array<Passive>(
		new DarkPact(this.itemName),
		new AzakanaGaze(this.itemName),
	);
	//static mythicStats = new Map<Stat, number>();
	//static additionalTip = "";
}