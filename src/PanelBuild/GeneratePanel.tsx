import { Dispatch, MouseEvent, MutableRefObject, SetStateAction, useState } from "react";
import { ItemDraggable } from "../Draggable";
import { ItemDroppable } from "../Droppable";
import { Item, ItemCategory } from "../items/Item";
import { AttributeInput, SelectorFilter } from "../PanelSelector/SelectorPanel";
import { ToolTipPosition } from "../store/features/ttHoverSlice";
import { ItemToolTipTrigger } from "../ToolTip";


interface GeneratePanelProps {
	itemCategoryFilter: ItemCategory,
	setItemCategoryFilter: Dispatch<SetStateAction<ItemCategory>>,
	slotPools: MutableRefObject<Array<Array<{ item: Item | undefined }>>>,
	numItemsInBuild: MutableRefObject<number>,
}
export const GeneratePanel: React.FC<GeneratePanelProps> = ({ itemCategoryFilter, setItemCategoryFilter, slotPools, numItemsInBuild }) => {



	const slotPoolElements = [];
	for (let i = 0; i < 6; i++) {
		slotPoolElements.push(<GeneratorSlotSpecs slotNum={i} items={slotPools.current[i]} key={i} />);
	}

	return (
		<div className="GeneratePanel UI">
			Default item pool:
			<SelectorFilter<ItemCategory>
				filter={itemCategoryFilter}
				setFilter={setItemCategoryFilter}
				entries={
					Object.entries(ItemCategory).filter(([key, value]) => !isNaN(Number(ItemCategory[key as keyof typeof ItemCategory])) && key !== 'None')
				}
			/>
			<AttributeInput<number>
				label="Number of Build Items:"
				placeholder="1"
				maxWidth="2.5em"
				valueRef={numItemsInBuild}
				regex={/^[0-9\b]+$/}
				blankValue={1}
				maxLength={1}
			/>

			Warning:
			<br />
			Large item pools with some amount of non-overriden to generate item slots will cause the app to freeze for long periods of time while generating, and even crash.
			<br />
			<br />
			Following item pools override default pool when generating for the respective slot.

			<div className="SlotsContainer">
				{
					slotPoolElements
				}
			</div>

		</div>
	);
}


interface GeneratorSlotSpecsProps {
	slotNum: number,
	items: Array<{ item: Item | undefined }>,
}

export const GeneratorSlotSpecs: React.FC<GeneratorSlotSpecsProps> = ({ slotNum, items }) => {
	//copied from ChampBuild
	/**@todo: make these better*/
	const [item0, setItem0] = useState<Item | undefined>();
	const [item1, setItem1] = useState<Item | undefined>();
	const [item2, setItem2] = useState<Item | undefined>();
	const [item3, setItem3] = useState<Item | undefined>();
	const [item4, setItem4] = useState<Item | undefined>();
	const [item5, setItem5] = useState<Item | undefined>();
	const [item6, setItem6] = useState<Item | undefined>();
	const [item7, setItem7] = useState<Item | undefined>();
	const [item8, setItem8] = useState<Item | undefined>();

	//items = new Array(
	//	{ item: item0 },
	//	{ item: item1 },
	//	{ item: item2 },
	//	{ item: item3 },
	//	{ item: item4 },
	//	{ item: item5 },
	//	{ item: item6 },
	//	{ item: item7 },
	//	{ item: item8 },
	//);
	items[0] = { item: item0 };
	items[1] = { item: item1 };
	items[2] = { item: item2 };
	items[3] = { item: item3 };
	items[4] = { item: item4 };
	items[5] = { item: item5 };
	items[6] = { item: item6 };
	items[7] = { item: item7 };
	items[8] = { item: item8 };

	let setItems = new Array(
		{ setItem: setItem0 },
		{ setItem: setItem1 },
		{ setItem: setItem2 },
		{ setItem: setItem3 },
		{ setItem: setItem4 },
		{ setItem: setItem5 },
		{ setItem: setItem6 },
		{ setItem: setItem7 },
		{ setItem: setItem8 },
	);
	const itemSlots: Array<JSX.Element> = [];
	for (let i = 0; i < items.length; i++) {
		itemSlots.push(
			<SlotItemPanel
				item={items[i].item}
				setItem={setItems[i].setItem}
				key={i}
			/>
		)
	}
	return (
		<div className="UIPanel HalfDark">
			Slot {slotNum + 1} item pool
			<div className="SlotItemsContainer UIPanel FullDark">
				{itemSlots}
			</div>
		</div>

	);
}

interface SlotItemPanelProps {
	item?: Item,
	setItem: React.Dispatch<React.SetStateAction<typeof Item | undefined>>,
}

const SlotItemPanel: React.FC<SlotItemPanelProps> = ({ item, setItem }) => {

	function handleRightClick(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
		e.preventDefault();
		setItem(undefined);
	}
	//console.log(item)
	return (
		<div className={"ItemBox"}>
			<ItemToolTipTrigger item={item} toSetTTPosition={ToolTipPosition.Left}>
				<ItemDroppable setItem={setItem}>
					{
						(item !== undefined) ?
							<ItemDraggable item={item} setItem={setItem}>
								<div className="UIPanel BuildItemContainer" onContextMenu={(e) => handleRightClick(e)}>

									<img src={require("../items/item-images/" + (item as typeof Item).image)} alt={(item as typeof Item).itemName + " Icon"} />


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