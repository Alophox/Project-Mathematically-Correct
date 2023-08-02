import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Item, ItemCategory, ItemType } from '../Item';
import { Sheen } from './Sheen';
import { AetherWisp } from './AetherWisp';
import { FiendishCodex } from './FiendishCodex';
import { Spellblade, SpellbladeSource } from '../item-passives/Spellblade';

export abstract class LichBane extends Item {
	static itemName = "Lich Bane";
	//static searchNames = new Array<string>();
	static image = "Lich_Bane_item.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 85],
		[Stat.AbilityHaste, 15],
		[Stat.MoveSpeedPercent, .08],
	]);
	static components = new Array<Item>([
		Sheen,
		AetherWisp,
		FiendishCodex,
	]);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Spellblade(this.itemName, SpellbladeSource.LichBane),
	);
	//static mythicStats = new Map<Stat, number>([]);
	static additionalTip = "";
}