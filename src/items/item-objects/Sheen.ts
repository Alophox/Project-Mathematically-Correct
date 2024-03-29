import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Spellblade, SpellbladeSource } from '../item-passives/Spellblade';
import { GlowingMote } from './GlowingMote';

export abstract class Sheen extends Item {
	static itemName = "Sheen";
	static searchNames = new Array<string>(
		"jimmy neutron",
	);
	static image = "Sheen_item_HD.webp"
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1000],
		[Stat.AbilityHaste, 10],
	]);
	static components = [
		GlowingMote,
	];
	//static restrictions = ;
	static itemCategory = ItemCategory.Fighter | ItemCategory.Marksman | ItemCategory.Mage | ItemCategory.Tank;
	static passives = new Array<Passive>(
		new Spellblade(this.itemName, SpellbladeSource.Sheen),
	);

	//static additionalTip = ""
}