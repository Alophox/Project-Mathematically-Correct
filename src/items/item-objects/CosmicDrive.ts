import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { FiendishCodex } from './FiendishCodex';
import { AetherWisp } from './AetherWisp';
import { AmplifyingTome } from './AmplifyingTome';
import { SpellDance } from '../item-passives/SpellDance';

export abstract class CosmicDrive extends Item {
	static itemName = "Cosmic Drive";
	static searchNames = new Array<string>(
		"hat",
	);
	static image = "Cosmic_Drive_item_HD.webp";
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 100],
		[Stat.AbilityHaste, 30],
		[Stat.MoveSpeedPercent, .05],
	]);
	static components = [
		FiendishCodex,
		AetherWisp,
		AmplifyingTome,
	];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new SpellDance(this.itemName),
	);

}