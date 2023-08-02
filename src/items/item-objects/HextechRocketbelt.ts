import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { AmplifyingTome } from './AmplifyingTome';
import { HextechAlternator } from './HextechAlternator';
import { BlastingWand } from './BlastingWand';
import { Supersonic } from '../item-passives/Supersonic';

export abstract class HextechRocketbelt extends Item {
	static itemName = "Hextech Rocketbelt";
	static searchNames = new Array<string>(
		"protobelt",
		"rocket belt",
	);
	static image = "Hextech_Rocketbelt_item.webp"
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3200],
		[Stat.AbilityPower, 90],
		[Stat.MagicPenetrationFlat, 6],
		[Stat.Health, 250],
		[Stat.AbilityHaste, 15],
	]);
	static components = new Array<Item>([
		HextechAlternator,
		BlastingWand,
		AmplifyingTome,
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Supersonic(this.itemName),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.MagicPenetrationFlat, 5]
	]);
	static additionalTip = "Supersonic resets the Attack cooldown- however that is not currently implemented in this calculator.";
}