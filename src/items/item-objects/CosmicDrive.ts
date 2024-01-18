import { Item, ItemCategory, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { FiendishCodex } from './FiendishCodex';
import { AetherWisp } from './AetherWisp';
import { SpellDance } from '../item-passives/SpellDance';
import { Kindlegem } from './Kindlegem';

export abstract class CosmicDrive extends Item {
	static itemName = "Cosmic Drive";
	static searchNames = new Array<string>(
		"hat",
	);
	static image = "Cosmic_Drive_item_HD.webp";
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 80],
		[Stat.Health, 250],
		[Stat.AbilityHaste, 25],
		[Stat.MoveSpeedPercent, .05],
	]);
	static components = [
		FiendishCodex,
		AetherWisp,
		Kindlegem,
	];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new SpellDance(this.itemName),
	);

}