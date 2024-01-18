import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Torment } from '../item-passives/Torment';
import { HauntingGuise } from './HauntingGuise';
import { BlastingWand } from './BlastingWand';
import { Suffering } from '../item-passives/Suffering';

export abstract class LiandrysTorment extends Item {
	static itemName = "Liandry's Torment";
	static searchNames = new Array<string>(
		"last shadow",
		"ls",
	);
	static image = "Liandry's_Anguish_item.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 90],
		[Stat.Health, 300]
	]);
	static components = new Array<Item>([
		HauntingGuise,
		BlastingWand
	]);
	static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Suffering(this.itemName),
		new Torment(this.itemName),
	);
	//static mythicStats = new Map<Stat, number>([
	//	[Stat.AbilityHaste, 5]
	//]);
	//static additionalTip = "";
}