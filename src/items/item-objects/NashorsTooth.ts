import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { RecurveBow } from './RecurveBow';
import { BlastingWand } from './BlastingWand';
import { FiendishCodex } from './FiendishCodex';
import { IcathianBite } from '../item-passives/IcathianBite';
export abstract class NashorsTooth extends Item {
	static itemName = "Nashor's Tooth";
	static searchNames = new Array<string>(
		"nashors"
	);
	static image = "Nashor's_Tooth_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 3000],
		[Stat.AbilityPower, 90],
		[Stat.AttackSpeed, .5],
		[Stat.AbilityHaste, 15],
	]);
	static components = new Array<Item>(
		RecurveBow,
		BlastingWand,
		FiendishCodex
	);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new IcathianBite(this.itemName),
	);
	//static additionalTip = "";
}