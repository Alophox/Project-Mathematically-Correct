import React, { MouseEvent, useEffect, useState } from 'react';
import { ItemDraggable } from '../Draggable';
import { ItemDroppable } from '../Droppable';
import { ToolTipPosition} from '../store/features/ttHoverSlice';
import { Item } from '../items/Item';
//import { AetherWisp, AmplifyingTome } from '../items/item-objects';
import { ItemToolTip, ItemToolTipTrigger } from '../ToolTip';
import '../UIPanel.css';
import './ItemBuild.css';
import { StatBuild } from './StatBuild';

interface ItemBuildProps{
	items: { item: Item|undefined }[],
	setItems: { setItem: React.Dispatch<React.SetStateAction<Item | undefined>> }[],
	statBuild: StatBuild,
	rerender?:boolean,
	setRerender?: React.Dispatch<React.SetStateAction<boolean>>,
}

export const ItemBuild: React.FC<ItemBuildProps> = ({ items, setItems, statBuild, rerender, setRerender }) => {
		return (
			
			<div className="BuildItemsContainer">
				<BuildItemPanel
					item={items[0].item}
					setItem={setItems[0].setItem}
					index={0}
					key={"item0"}
					statBuild={statBuild}
					rerender={rerender }
					setRerender={setRerender }
				/>
				<BuildItemPanel
					item={items[1].item}
					setItem={setItems[1].setItem}
					index={1}
					key={"item1"}
					statBuild={statBuild}
					rerender={rerender}
					setRerender={setRerender}
				/>
				<BuildItemPanel
					item={items[2].item}
					setItem={setItems[2].setItem}
					index={2}
					key={"item2"}
					statBuild={statBuild}
					rerender={rerender}
					setRerender={setRerender}
				/>
				<BuildItemPanel
					item={items[3].item}
					setItem={setItems[3].setItem}
					index={3}
					key={"item3"}
					statBuild={statBuild}
					rerender={rerender}
					setRerender={setRerender}
				/>
				<BuildItemPanel
					item={items[4].item}
					setItem={setItems[4].setItem}
					index={4}
					key={"item4"}
					statBuild={statBuild}
					rerender={rerender}
					setRerender={setRerender}
				/>
				<BuildItemPanel
					item={items[5].item}
					setItem={setItems[5].setItem}
					index={5}
					key={"item5"}
					statBuild={statBuild}
					rerender={rerender}
					setRerender={setRerender}
				/>
			</div>
				

			
		);
}

interface BuildItemPanelProps {
	item?: Item,
	setItem: React.Dispatch<React.SetStateAction<typeof Item | undefined>>,
	index: number,
	statBuild: StatBuild,
	rerender?: boolean,
	setRerender?: React.Dispatch<React.SetStateAction<boolean>>,
}

const BuildItemPanel: React.FC<BuildItemPanelProps> = ({ item, setItem, statBuild, rerender, setRerender}) => {

	function handleRightClick(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>){
		e.preventDefault();
		setItem(undefined);
		if (setRerender !== undefined) setRerender(!rerender);
	}

	let stacks = (item as typeof Item)?.stackable?.currentStacks;

	//console.log(item)
	return (
		<div className={"ItemBox" }>
			<ItemToolTipTrigger item={item} toSetTTPosition={ToolTipPosition.Right} statBuild={statBuild }>
				<ItemDroppable setItem={setItem} rerender={rerender} setRerender={setRerender }>
					{
						(item !== undefined) ?
							<ItemDraggable item={item} setItem={setItem}>
								<div className="UIPanel BuildItemContainer" onContextMenu={(e) => handleRightClick(e)}>
									
									<img src={require("../items/item-images/" + (item as typeof Item).image)} alt={(item as typeof Item).itemName + " Icon"} />
									<div className="Stacks">
										{stacks}
									</div>
									
								</div>
							</ItemDraggable>
							:
							<div className="UIPanel BuildItemContainer">
							</div>
					}
				</ItemDroppable>
			</ItemToolTipTrigger >
		</div>
		
	);
}