import React, { Dispatch, SetStateAction } from 'react';
import { Champion } from './champions/Champion';
import { Item } from "./items/Item";
import { UpgradeableItem } from './items/UpgradableItem';
import { Stat } from './Stat';

interface ItemDraggableProps {
	item: Item,
	children?: React.ReactNode,
	setItem?: Dispatch<SetStateAction<typeof Item | undefined>> | Dispatch<SetStateAction<Champion | undefined>>,
};

export const ItemDraggable: React.FC<ItemDraggableProps> = ({ item, children, setItem }) => {
	return (
		<Draggable obj={item} setObj={setItem }>
			{children }
		</Draggable>
	);
};

interface ChampDraggableProps {
	champ: Champion,
	children?: React.ReactNode,
	setChamp?: Dispatch<SetStateAction<Champion | undefined>>
};

export const ChampDraggable: React.FC<ChampDraggableProps> = ({ champ, children, setChamp }) => {
	return (
		<Draggable obj={champ} setObj={setChamp }>
			{children}
		</Draggable>
	);

	
};

/**
 * setObj is only needed when the draggable needs to clear the object when grabbed
 */
interface DraggableProps {
	obj: Item | Champion,
	children?: React.ReactNode,
	setObj?: Dispatch<SetStateAction<typeof Item|undefined>> | Dispatch<SetStateAction<Champion|undefined>>,
};

const Draggable: React.FC<DraggableProps> = ({ obj, children, setObj }) => {
	var img: HTMLImageElement;
	var div: HTMLDivElement;
	let dimension: number = 54;

	const isItem = (object: Item | Champion): object is Item => {
		return (object as typeof Item).itemName !== undefined;
	}

	function handleDragStart(e: React.DragEvent<HTMLDivElement>) {
		//img needs to be rendered somewhere in order for width to work, so we render it inside a div inside the body, off the screen
		img = document.createElement("img");
		if (isItem(obj)) {
			img.src = require("./items/item-images/" + (obj as typeof Item).image);
		} else {
			img.src = require("./champions/champion-images/" + (obj as Champion).image);
		}
		img.style.width = dimension + "px";
		div = document.createElement("div");
		div.appendChild(img);
		div.style.position = "absolute";
		div.style.top = "0px";
		div.style.left = "-500px";
		document.body.appendChild(div);
		e.dataTransfer.setDragImage(div, dimension / 2, dimension / 2);
		if (isItem(obj)) {
			//items are stringified by item name, as abstract classes cannot be stringified
			e.dataTransfer.setData('item', JSON.stringify((obj as typeof UpgradeableItem).baseName ?? (obj as typeof Item).itemName));
		} else {
			//console.log((obj as Champion).constructor.name);
			e.dataTransfer.setData('champ', JSON.stringify((obj as Champion).constructor.name));
		}

	}
	function handleDrag(e: React.DragEvent<HTMLDivElement>) {
	}
	function handleDragEnd(e: React.DragEvent<HTMLDivElement>) {
		div?.remove();
	//	setTimeout(() => {
			if (setObj !== undefined) {
				setObj(undefined);
			}
	//	}, 2); //timeout of 1 prevents deletion of object reference when dropping onto self
	}

	return (
		<div className="draggable" draggable onDragStart={(event) => handleDragStart(event)} onDrag={(event) => handleDrag(event)} onDragEnd={(event) => handleDragEnd(event)}>
			{children}
		</div>
	);
}