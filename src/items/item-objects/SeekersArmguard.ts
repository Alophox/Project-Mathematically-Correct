import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { Passive } from '../Passive';
import { ClothArmor } from './ClothArmor';
import { TimeStop } from '../item-passives/TimeStop';

export abstract class SeekersArmguard extends Item {
	static itemName = "Seeker's Armguard";
	//static searchNames = new Array<string>();
	static image = "Seeker's_Armguard_item_HD.webp";
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1600],
		[Stat.AbilityPower, 45],
		[Stat.Armor, 25]
	]);
	static components = new Array<Item>([
		AmplifyingTome,
		ClothArmor,
		AmplifyingTome
	]);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new TimeStop(this.itemName),
	);
	//public static stackable = this.passives[0];
}