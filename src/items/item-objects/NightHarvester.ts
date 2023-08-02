import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { HextechAlternator } from './HextechAlternator';
import { FiendishCodex } from './FiendishCodex';
import { AmplifyingTome } from './AmplifyingTome';
import { Soulrend } from '../item-passives/Soulrend';

export abstract class NightHarvester extends Item {
	static itemName = "Night Harvester";
	static searchNames = new Array<string>(
		"dark",
		"scythe",
	);
	static image = "Night_Harvester_item.webp"
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3200],
		[Stat.AbilityPower, 90],
		[Stat.Health, 300],
		[Stat.AbilityHaste, 25],

	]);
	static components = new Array<Item>([
		HextechAlternator,
		FiendishCodex,
		AmplifyingTome,
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Soulrend(this.itemName),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.AbilityHaste, 5]
	]);
	static additionalTip = "";
}