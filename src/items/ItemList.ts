import { Item, ItemCategory, ItemRestrictions, ItemType } from './Item';
import * as ItemObjects from './item-objects';
import * as PassiveObjects from './item-passives';
import { Passive } from './Passive';
import { UpgradeableItem } from './UpgradableItem';

export abstract class ItemList {
	public static allItems: Map<string, Item> = new Map(Object.values(ItemObjects).map(item => [(item as typeof UpgradeableItem).baseName ?? item.itemName, item]));
	public static allPassives: Array<typeof Passive> = Object.keys(PassiveObjects).map((passive) => PassiveObjects[passive as keyof typeof PassiveObjects] as typeof Passive);
	public static stackPassives: Array<typeof Passive> = this.allPassives.filter((passive) => {return passive.MAXSTACKS > 0;});
	/**
	 * @todo: categories and item types
	 * @param categories
	 * @param itemTypes
	 * @param searchTerm
	 * @returns
	 */
	public static getFilteredItems(categories: ItemCategory, itemTypes: ItemType, searchTerm: string): Array<Item> {

		let filteredItems: Array<Item> = new Array<Item>();

		filteredItems = Object.values(ItemObjects);

		if (itemTypes !== 0)
			filteredItems = filteredItems.filter((item) => {
				if ((item as typeof Item).type & itemTypes) {
					return true;
				} else {
					return false;
				}
			});

		if (categories !== 0)
			filteredItems = filteredItems.filter((item) => {
				if ((item as typeof Item).itemCategory & categories) {
					return true;
				} else {
					return false;
				}
			});

		searchTerm = stringConvert(searchTerm);

		if (searchTerm !== '')
			filteredItems = filteredItems.filter(item => {
				if (stringConvert((item as typeof Item).itemName).includes(searchTerm))
					return true;
				let includes: boolean = false;
				(item as typeof Item).searchNames.forEach(keyword => {
					if (stringConvert(keyword).includes(searchTerm)) {
						includes = true;
						return;
					}
				});
				return includes;
			});

		return filteredItems;
	}

	/**
	 * @todo: overrides
	 * @param defaultCategories
	 * @returns
	 */
	public static getGeneratedBuilds(defaultCategories: ItemCategory, slotPools: Array<Array<{item: Item|undefined} >>, size: number): Array<Array<Item>> {
		let generatedBuilds = new Array<Array<Item>>();

		let defaultItems = new Array<Item>();
		this.allItems.forEach((item, itemName) => {
			//if item is in default categories
			if ((item as typeof Item).itemCategory & defaultCategories) {
				//if item is completed item
				//currently have to make an exception for boots... figure out something better later, cause slightly magical footwear exists(tho that might just end up being slapped on as a passive? idk)
				if ((item as typeof Item).type === ItemType.Legendary || (item as typeof Item).type === ItemType.Mythic || ((item as typeof Item).type === ItemType.Boots && (item as typeof Item).itemName !== "Boots")) {
					defaultItems.push(item);
				}
			}
		});
		if (size > 0) {
			size = Math.min(6, size);

			let newSlotPools = new Array<Array<Item>>();
			for (let i = 0; i < size; i++) {
				newSlotPools.push(new Array<Item>());
				for (let j = 0; j < slotPools[i].length; j++) {
					if (slotPools[i][j].item !== undefined)
						newSlotPools[i].push(slotPools[i][j].item as typeof Item);
				}
			}

			this.recursiveGenerateBuilds(0, defaultItems,newSlotPools, size, new Array<Item>(), generatedBuilds);
		}
		

		return generatedBuilds;
	}

	/**
	 * i'm rebuilding this stupid function, and it's just as confusing as it was the first time
	 * at least I can reuse the comment... it's essentially the same, just in ts rather than c#
	 * and with the new slotPools, far less filters
	 * 
	 * oh no this is going to be really confusing
	 * Essentially: find all combinations of items and make each one
	 * do this by getting first item then looping through all items after for next item
	 * do this recursively until you are looking X layers deep, where X is how many items are going in a build.
	 * @param defaultIndex: index in default items
	 * @param defaultItems: default item pool
	 * @param slotPools: overrides for individual slots
	 * @param itemsRemaining: how items left, or layers left
	 * @param currentBuildAttempt: current item combo
	 * @param generatedBuilds: modified in the function, this is the end result
	 * @returns
	 */
	private static recursiveGenerateBuilds(defaultIndex: number, defaultItems: Array<Item>, slotPools: Array<Array<Item>>, itemsRemaining:number, currentBuildAttempt:Array<Item>, generatedBuilds:Array<Array<Item>>) {
		//no more
		if (itemsRemaining === 0) {
			//possibility that array is by reference when pushed, so best to avoid that entirely with ...
			generatedBuilds.push(new Array<Item>(...currentBuildAttempt));
			return;
		}


		let currentRestrictions: ItemRestrictions = ItemRestrictions.None;
		currentBuildAttempt.forEach((item) => {
			currentRestrictions = currentRestrictions | (item as typeof Item).restrictions;
		});

		let currentItem: typeof Item;
		let slotPoolIndex = currentBuildAttempt.length

		let loopStartIndex: number;
		let loopArray: Array<Item>;
		let isDefault: boolean;
		if (slotPools[slotPoolIndex].length === 0) {
			//default
			loopStartIndex = defaultIndex;
			isDefault = true;
			loopArray = defaultItems;

		} else {
			//itemPool override
			loopStartIndex = 0;
			isDefault = false;
			loopArray = slotPools[slotPoolIndex];
		}

		for (let i: number = loopStartIndex; i < loopArray.length; i++) {
			currentItem = (loopArray.at(i) as typeof Item);
			//if item isnt restricted by other items
			if (!(currentItem.restrictions & currentRestrictions) && !this.itemExistsInBuild(currentItem, currentBuildAttempt)) {
				//add item
				currentBuildAttempt.push(currentItem);
				/**
				* i+1: don't allow the current item to be gotten again(NO DUPS) if default, +0 otherwise
				*/
				this.recursiveGenerateBuilds(i + (isDefault ? 1 : 0), defaultItems, slotPools, itemsRemaining - 1, currentBuildAttempt, generatedBuilds);
				//remove current item so that we can replace it in the next loop
				currentBuildAttempt.pop();
			}
		}
		
	}
	private static itemExistsInBuild(item: Item, build: Array<Item>): boolean {
		let itemExists = false;
		for (let i = 0; i < build.length; i++) {
			if ((build[i] as typeof Item).itemName === (item as typeof Item).itemName) {
				itemExists = true;
				break;
			}
		}
		return itemExists;
	}
}

function stringConvert(input: string): string {
	input = input.replace(/[\s,'-]/g, "").toLowerCase();
	return input;
}