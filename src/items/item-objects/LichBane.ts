import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Sheen } from './Sheen';
import { AetherWisp } from './AetherWisp';
import { Spellblade, SpellbladeSource } from '../item-passives/Spellblade';
import { HextechAlternator } from './HextechAlternator';

export abstract class LichBane extends Item {
	static itemName = "Lich Bane";
	//static searchNames = new Array<string>();
	static image = "Lich_Bane_item.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3100],
		[Stat.AbilityPower, 100],
		[Stat.AbilityHaste, 15],
		[Stat.MoveSpeedPercent, .08],
	]);
	static components = new Array<Item>([
		Sheen,
		AetherWisp,
		HextechAlternator,
	]);
	static restrictions = ItemRestrictions.Spellblade;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Spellblade(this.itemName, SpellbladeSource.LichBane),
	);
	//static mythicStats = new Map<Stat, number>([]);
	static additionalTip = "The bonus attack speed remains for as long as the Spellblade buff remains.";
}