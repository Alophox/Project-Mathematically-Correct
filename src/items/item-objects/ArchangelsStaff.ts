import { Stat } from '../../Stat';
import { Passive } from '../Passive';
import { ManaCharge } from '../item-passives/ManaCharge';
import { TearOfTheGoddess } from './TearOfTheGoddess';
import { ItemCategory, ItemRestrictions, ItemType } from '../Item';
import { Awe } from '../item-passives/Awe';
import { UpgradeableItem } from '../UpgradableItem';
import { Lifeline } from '../item-passives/Lifeline';
import { LostChapter } from './LostChapter';
import { FiendishCodex } from './FiendishCodex';

export abstract class ArchangelsStaff extends UpgradeableItem {
	static baseName = "Archangel's Staff";
	public static upgradeName: string = "Seraph's Embrace";
	private static manaCharge = new ManaCharge(this.baseName);


	static get itemName() {
		//console.log(this.manaCharge.currentStacks);
		if (ManaCharge.INITIALSTACKS < ManaCharge.MAXSTACKS) {
			return this.baseName;
		} else {
			return this.upgradeName;
		}
	}
	static searchNames = new Array<string>(
		"aa",//it actually has this, for whatever reason
		"Archangel's Staff",
		"Seraph's Embrace",
	);
	static get image() {
		if (ManaCharge.INITIALSTACKS < ManaCharge.MAXSTACKS) {
			return "Archangel's_Staff_item_HD.webp";
		} else {
			return "Seraph's_Embrace_item_HD.webp";
		}
	}
	static type = ItemType.Legendary;
	static get stats() {
		if (ManaCharge.INITIALSTACKS < ManaCharge.MAXSTACKS) {
			return new Map<Stat, number>([
				[Stat.Cost, 2900],
				[Stat.AbilityPower, 80],
				[Stat.Mana, 600],
				[Stat.AbilityHaste, 25],
			]);
		} else {
			return new Map<Stat, number>([
				[Stat.Cost, 2900],
				[Stat.AbilityPower, 80],
				[Stat.Mana, 1000],
				[Stat.AbilityHaste, 25],
			]);
		}
		
	}
	static components = [
		LostChapter,
		TearOfTheGoddess,
		FiendishCodex,
	];
	static restrictions = ItemRestrictions.Lifeline | ItemRestrictions.ManaCharge;
	static itemCategory = ItemCategory.Mage;

	private static basePassives = new Array<Passive>(
		new Awe(this.baseName),
		this.manaCharge,
	);
	private static upgradePassives = new Array<Passive>(
		new Awe(this.upgradeName),
		new Lifeline(this.upgradeName),
	);
	static get passives() {
		if (ManaCharge.INITIALSTACKS < ManaCharge.MAXSTACKS) {
			return this.basePassives;
		} else {
			return this.upgradePassives;
		}

	}
	static get stackable() {
		if (ManaCharge.INITIALSTACKS < ManaCharge.MAXSTACKS) {
			return this.manaCharge;
		} else {
			return undefined;
		}
	}

	static get additionalTip() {
		if (ManaCharge.INITIALSTACKS < ManaCharge.MAXSTACKS) {
			return "";
		} else {
			return "The shield from this item used in Effective Health calculations is determined after the Burst sequence is completed, and thus will be less than the maximum amount due to mana usage.";
		}
	}
}