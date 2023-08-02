import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { AmplifyingTome } from './AmplifyingTome';
import { Passive } from '../Passive';
import { ClothArmor } from './ClothArmor';
import { WitchsPath } from '../item-passives/WitchsPath';

export abstract class SeekersArmguard extends Item {
	static itemName = "Seeker's Armguard";
	//static searchNames = new Array<string>();
	static image = "Seeker's_Armguard_item_HD.webp";
	static type = ItemType.Epic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 1000],
		[Stat.AbilityPower, 30],
		[Stat.Armor, 15]
	]);
	static components = new Array<Item>([
		AmplifyingTome,
		ClothArmor
	]);
	//static restrictions = ;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new WitchsPath(this.itemName),
	);
	//public static stackable = this.passives[0];
}