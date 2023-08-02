import React, { Dispatch, SetStateAction } from 'react';
import { Champion, Class } from './champions/Champion';
import { Item } from "./items/Item";
import { ItemList } from './items/ItemList';
import * as ChampionObjects from './champions/champion-objects';
interface ItemDroppableProps {
	setItem: Dispatch<SetStateAction<typeof Item | undefined>>,
	rerender?: boolean,
	setRerender?: React.Dispatch<React.SetStateAction<boolean>>,
	children?: React.ReactNode,
};

export const ItemDroppable: React.FC<ItemDroppableProps> = ({ setItem, rerender, setRerender, children }) => {
	return (
		<Droppable obj={setItem} objType={Item} rerender={rerender} setRerender={setRerender }>
			{children}
		</Droppable>
	);
};

interface ChampDroppableProps {
	champ: Dispatch<SetStateAction<Champion|undefined>>,
	children?: React.ReactNode,
};

export const ChampDroppable: React.FC<ChampDroppableProps> = ({ champ, children }) => {
	return (
		<Droppable obj={champ} objType={Champion }>
			{children}
		</Droppable>
	);


};

interface DroppableProps {
	obj: Dispatch<SetStateAction<typeof Item|undefined>> | Dispatch<SetStateAction<Champion|undefined>>,
	objType: Item | Champion,
	rerender?:boolean,
	setRerender?: React.Dispatch<React.SetStateAction<boolean>>,
	children?: React.ReactNode,
};

const Droppable: React.FC<DroppableProps> = ({ obj, objType, rerender, setRerender, children }) => {

	const isItem = (object: Item | Champion | undefined): object is Item => {
		return (object as typeof Item).itemName !== undefined;
	}
	const isChampion = (object: any): object is Champion => {
		return (object).championName !== undefined;
	}
	function enableDropping(e: React.DragEvent<HTMLDivElement>) {
		e.preventDefault();
	}
	/**
	 * when dropping, drop as item or champion correctly, pending on the type given
	 * @param e: the event triggering this method
	 */
	function handleDrop(e: React.DragEvent<HTMLDivElement>) {
		//console.log(e.dataTransfer.getData('obj'));
		let dropObj: Item | Champion | undefined;

		//if invalid input, don't do anything
		if (e.dataTransfer.getData('item') === "" && e.dataTransfer.getData('champ') === "") return;

		if (isItem(objType) && e.dataTransfer.getData('item') !== "") {
			//items are stringified by item name, as abstract classes cannot be stringified
			//ItemList contains allItems, which is a Map<string, Item> which is actually Map<Item.itemName, Item>
			dropObj = ItemList.allItems.get(JSON.parse(e.dataTransfer.getData('item')));
		} else if (!isItem(objType) && e.dataTransfer.getData('champ') !== ""){
			//similar situation for champions
			let temp: keyof typeof ChampionObjects = (JSON.parse(e.dataTransfer.getData('champ')));
			dropObj = new ChampionObjects[temp]();
		}

		if (dropObj === undefined) {
			console.error("Error in Droppable: " + e.dataTransfer.getData('item') + e.dataTransfer.getData('champ') + " not found in " + (isItem(objType) ? "items" : "champions"))
			return;
		}
		setTimeout(() => {
			if (isItem(dropObj) && isItem(objType)) {

				(obj as Dispatch<SetStateAction<Item>>)(() => dropObj as typeof Item);
				if (setRerender !== undefined) setRerender(!rerender);

			} else if ((objType == Champion) && isChampion(dropObj)) {

				(obj as Dispatch<SetStateAction<Champion>>)(dropObj);
			}
		}, 1); //timeout of 1 prevents deletion of object reference when dropping onto self, and also has the sideeffect of updating tooltip location
	}


	return (
		<div className="droppable" onDragOver={enableDropping} onDrop={handleDrop }>
			{children}
		</div>
	);
}