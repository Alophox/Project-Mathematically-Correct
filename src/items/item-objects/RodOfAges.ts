import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { AmplifyingTome } from './AmplifyingTome';
import { LostChapter } from './LostChapter';
import { BlastingWand } from './BlastingWand';
import { Eternity } from '../item-passives/Eternity';
import { RodOfAgesPassive } from '../item-passives/RodOfAgesPassive';

export abstract class RodOfAges extends Item {
	static itemName = "Rod of Ages";
	//static searchNames = new Array<string>();
	static image = "Rod_of_Ages_item_HD.webp";
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2800],
		[Stat.AbilityPower, 60],
		[Stat.Health, 400],
		[Stat.Mana, 400],
	]);
	static components = new Array<Item>([
		LostChapter,
		BlastingWand,
		AmplifyingTome,
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;

	private static roaPassive = new RodOfAgesPassive(this.itemName);
	public static stackable = this.roaPassive;
	static passives = new Array<Passive>(
		this.roaPassive,
		new Eternity(this.itemName, this.roaPassive),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.AbilityHaste, 5],
	]);
	//static additionalTip = "";
}