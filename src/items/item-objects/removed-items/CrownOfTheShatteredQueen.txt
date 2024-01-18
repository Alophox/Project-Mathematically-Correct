import { Item, ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { AmplifyingTome } from './AmplifyingTome';
import { LostChapter } from './LostChapter';
import { Kindlegem } from './Kindlegem';
import { Safeguard } from '../item-passives/Safeguard';
import { Poise } from '../item-passives/Poise';

export abstract class CrownOfTheShatteredQueen extends Item {
	static itemName = "Crown of the Shattered Queen";
	//static searchNames = new Array<string>();
	static image = "Crown_of_the_Shattered_Queen_item_HD.webp"
	static type = ItemType.Mythic;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2800],
		[Stat.AbilityPower, 70],
		[Stat.Health, 250],
		[Stat.Mana, 600],
		[Stat.AbilityHaste, 20],
	]);
	static components = new Array<Item>([
		LostChapter,
		Kindlegem,
		AmplifyingTome,
	]);
	static restrictions = ItemRestrictions.Mythic;
	static itemCategory = ItemCategory.Mage;
	static passives = new Array<Passive>(
		new Safeguard(this.itemName),
		new Poise(this.itemName),
	);
	static mythicStats = new Map<Stat, number>([
		[Stat.MoveSpeedPercent, .01],
		[Stat.AbilityPower, 8],
	]);
	//static additionalTip = "";
}