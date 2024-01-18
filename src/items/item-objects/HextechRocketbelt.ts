import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { HextechAlternator } from './HextechAlternator';
import { Supersonic } from '../item-passives/Supersonic';
import { Kindlegem } from './Kindlegem';

export abstract class HextechRocketbelt extends Item {
	static itemName = "Hextech Rocketbelt";
	static searchNames = new Array<string>(
		"protobelt",
		"rocket belt",
	);
	static image = "Hextech_Rocketbelt_item.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2500],
		[Stat.AbilityPower, 60],
		[Stat.Health, 300],
		[Stat.AbilityHaste, 15],
	]);
	static components = new Array<Item>([
		HextechAlternator,
		Kindlegem,
	]);
	static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Supersonic(this.itemName),
	);
	//static mythicStats = new Map<Stat, number>([
	//	[Stat.MagicPenetrationFlat, 5]
	//]);
	static additionalTip = "Supersonic resets the Attack cooldown- however that is not currently implemented in this calculator.";
}