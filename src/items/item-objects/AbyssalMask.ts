import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { Unmake } from '../item-passives/Unmake';
import { Kindlegem } from './Kindlegem';
import { NegatronCloak } from './NegatronCloak';
import { Item, ItemCategory, ItemType } from '../Item';

export abstract class AbyssalMask extends Item {
	static itemName = "Abyssal Mask";
	static searchNames = new Array<string>();
	static image = "Abyssal_Mask_item_HD.webp"
	static type = ItemType.Legendary;
	static stats = new Map<Stat, number>([
		[Stat.Cost, 2400],
		[Stat.Health, 300],
		[Stat.MagicResist, 60],
		[Stat.AbilityHaste, 10],
	]);
	static components = [
		Kindlegem,
		NegatronCloak,
	];
	//static restrictions = ItemRestrictions.None;
	static itemCategory = ItemCategory.Tank;
	static passives = new Array<Passive>(
		new Unmake(this.itemName),
	);
	static additionalTip = "";
}
