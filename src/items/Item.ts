import { Stat } from '../Stat';
import { Passive } from './Passive';

export enum ItemType {
	/**no accessible item should have this afaik*/
	None = 0, 
	/**completed boots*/
	Boots = 1 << 0,
	/**< 500 cost, *usually* doesn't build into anything(tear, boots are exceptions) */
	Starter = 1 << 1,
	/**items without components that are components */
	Basic = 1 << 2,
	/**items with components that are components */
	Epic = 1 << 3,
	/** completed items*/
	Legendary = 1 << 4, 
	/**more restricted completed items */
	Mythic = 1 << 5,

	

	All = ~(~0 << 6),
}

//unless otherwise stated, all restrictions are one of that item group
export enum ItemRestrictions {
	None = 0,
	SupportJungle = 1 << 0,
	ManaCharge = 1 << 1,
	Lifeline = 1 << 2,
	Mythic = 1 << 3,
	Boots = 1 << 4,
	Glory = 1 << 5,
	/**
	 * mythic components cannot be with other mythic components or mythics
	 * equal to mythic cause we don't care about completing items after components have been bought
	 */
	MythicComponent = Mythic,
}

/**
 * these will not match 1:1 to whats in game, as the game has some... inaccuracies(why is dagger in assassin??? no atk spd items there...)
 */
export enum ItemCategory {
	None = 0,
	Fighter = 1 << 0,
	Marksman = 1 << 1,
	Assassin = 1 << 2,
	Mage = 1 << 3,
	Tank = 1 << 4,
	Support = 1 << 5,
	All = ~(~0 << 6), //shift should be one more than last flag shift
}

/**
* Root item class
* 
* @
*/
export abstract class Item {
	//private static _instance: Item;
	public static itemName: string = "?";
	public static searchNames: Array<string> = [];
	public static image: string = "Aether_Wisp_item_HD.webp"; //TODO: generic default item error image
	public static type: ItemType = ItemType.None;
	public static stats: Map<Stat, number> = new Map<Stat, number>([[Stat.Cost, 0]]);

	public static components: Array<Item> = new Array<Item>();
	public static restrictions: ItemRestrictions = ItemRestrictions.None;
	public static itemCategory: ItemCategory = ItemCategory.None;
	public static stackable: Passive | undefined;
	public static passives: Array<Passive> = new Array<Passive>();
	//mythic passive
	public static mythicStats: Map<Stat, number>; //every instance given for every legendary

	public static additionalTip: string = "";

	/**
	 * Returns mythic stats given by the mythic passive(s) when given the number of legendaries
	 * 
	 * @remarks
	 * intended to be used when type = mythic
	 * 
	 * @param legendaries - number of legendaries in the build
	 * @returns Stats gained by the mythic passive(s), if any
	 */
	public static getMythicStats(legendaries: number): Map<Stat, number> {
		if (this.mythicStats === undefined || legendaries < 1)
			return new Map<Stat, number>();

		let givenMythicStats: Map<Stat, number> = new Map<Stat, number>();
		this.mythicStats.forEach((value: number, key: Stat) => {
			//console.log(value + " " + value * legendaries);
			givenMythicStats.set(key, value * legendaries);
		});
		return givenMythicStats;
	}

}