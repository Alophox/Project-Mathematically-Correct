import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { AetherWisp } from './AetherWisp';
import { HextechAlternator } from './HextechAlternator';
import { Stormraider } from '../item-passives/Stormraider';
import { Squall } from '../item-passives/Squall';

export abstract class Stormsurge extends Item {
	static itemName = "Stormsurge";
	//static searchNames = new Array<string>();
	static image = "Stormsurge_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2900],
		[Stat.AbilityPower, 100],
		[Stat.MagicPenetrationFlat, 10],
		[Stat.MoveSpeedPercent, .05],
	]);
	static components = new Array<Item>([
		AetherWisp,
		HextechAlternator,
	]);
	static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Stormraider(this.itemName),
		new Squall(this.itemName),
	);
	//static mythicStats = new Map<Stat, number>([]);
	//static additionalTip = "";
}