import React, { Dispatch, MouseEvent, MutableRefObject, SetStateAction, useRef, useState } from 'react';
import '../UIPanel.css';
import './SelectorPanel.css';
import './GridLayout.css';
import { Item, ItemCategory, ItemType } from '../items/Item';
import { ItemList } from '../items/ItemList';
import { ChampToolTipTrigger, ItemToolTipTrigger } from '../ToolTip';
import { ChampionList } from '../champions/ChampionList';
import { Champion } from '../champions/Champion';
import { TargetDummy } from '../champions/champion-objects';
import { ChampDraggable, ItemDraggable } from '../Draggable';
import { ChampDroppable } from '../Droppable';
import { ToggleButtonState, ToggleButtonStateFlag } from '../ToggleButton';
import { ToolTipPosition } from '../store/features/ttHoverSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCalcAttr } from '../store/features/calculatorAttributes';
import { Stat, StatNameReplace } from '../Stat';
import { StatIcon } from '../icons/TextIcon';
import { Passive } from '../items/Passive';
/**
 * @todo: implement champion stacks selector and editor
 * @todo: implement runes selector and editor
 */
enum ShowSelector {
	Champion,
	Item,
	ChampAttributes, //level, sequence, priority, etc.
	ItemAttributes, //archangels stacks, etc.
	//Stacks, //show stackable followed by ally | enemy
	Runes, //ally enemy separate maybe?
}

interface SelectorPanelProps {
	allyChamp: Champion|undefined,
	setAllyChamp: React.Dispatch<React.SetStateAction<Champion|undefined>>,
	enemyChamp: Champion|undefined,
	setEnemyChamp: React.Dispatch<React.SetStateAction<Champion|undefined>>,
	defaultChamp: Champion,
	setDefaultChamp:Dispatch<SetStateAction<Champion>>,
}

export const SelectorPanel: React.FC<SelectorPanelProps> = ({ allyChamp, setAllyChamp, enemyChamp, setEnemyChamp, defaultChamp, setDefaultChamp }) => {
	const [selector, setSelector] = useState<number>(ShowSelector.Champion)

	//function renderSwitch(showSelector: ShowSelector)
	//{
	//	switch (showSelector) {
	//		case ShowSelector.Champion:
	//			return <SelectPanel itemSelect={false} />;
	//		case ShowSelector.Item:
	//			return <SelectPanel itemSelect={true} />;
	//		case ShowSelector.ChampAttributes:
	//			return <ChampAttributes setDefaultChamp={setDefaultChamp} />
	//		case ShowSelector.ItemAttributes:
	//			return <ItemAttributes setDefaultChamp={setDefaultChamp} />
	//		default: //champion
	//			return <SelectPanel itemSelect={false} />;
	//	}
	//}

	return (
		<div className="UIPanel SelectorPanel">
			<ChampionViewerPanel
				allyChamp={allyChamp}
				setAllyChamp={setAllyChamp}
				enemyChamp={enemyChamp}
				setEnemyChamp={setEnemyChamp}
				defaultChamp={defaultChamp}
			/>
			<div className="SelectorButtonContainer UIPanel">
				<div className={"SelectorButton"}>
					<ToggleButtonState<ShowSelector>
						label={"Edit Champions"}
						currentState={selector}
						toSetState={ShowSelector.Champion}
						setState={setSelector}
					/>
				</div>
				<div className={"SelectorButton"}>
					<ToggleButtonState<ShowSelector>
						label={"Edit Items"}
						currentState={selector}
						toSetState={ShowSelector.Item}
						setState={setSelector}
					/>
				</div>
				<div className={"SelectorButton"}>
					<ToggleButtonState<ShowSelector>
						label={"Edit Champ Attributes"}
						currentState={selector}
						toSetState={ShowSelector.ChampAttributes}
						setState={setSelector}
					/>
				</div>
				<div className={"SelectorButton"}>
					<ToggleButtonState<ShowSelector>
						label={"Edit Item Attributes"}
						currentState={selector}
						toSetState={ShowSelector.ItemAttributes}
						setState={setSelector}
					/>
				</div>
			</div>
			{/* have to keep these active to save their states, particularly so switching between selectors doesn't get rid of item filters */ }
			<SelectPanel itemSelect={false} viewable={selector === ShowSelector.Champion} />
			<SelectPanel itemSelect={true} viewable={selector === ShowSelector.Item} />

			{(selector === ShowSelector.ChampAttributes) && (<ChampAttributes setDefaultChamp={setDefaultChamp} />)}
			{(selector === ShowSelector.ItemAttributes) && (<ItemAttributes setDefaultChamp={setDefaultChamp} />)}
		</div>
	);
}

interface ChampionViewerPanelProps {
	allyChamp: Champion|undefined,
	setAllyChamp: React.Dispatch<React.SetStateAction<Champion|undefined>>,
	enemyChamp: Champion|undefined,
	setEnemyChamp: React.Dispatch<React.SetStateAction<Champion|undefined>>,
	defaultChamp: Champion,
}

const ChampionViewerPanel: React.FC<ChampionViewerPanelProps> = ({allyChamp, setAllyChamp, enemyChamp, setEnemyChamp, defaultChamp }) => {

	

	return (
		<div className="UIPanel ChampionViewer">
			<div className="UIPanel Ally">	
				{"Ally"}
				<div> {/* this div makes it so the TTTrigger doesn't overflow' */ }
					<ChampViewPanel
						champ={allyChamp}
						setChamp={setAllyChamp}
						defaultChamp={defaultChamp}

					/>
				</div>
				
			</div>
			<div className="UIPanel Enemy">
				{"Enemy"}
				<div>
					<ChampViewPanel
						champ={enemyChamp}
						setChamp={setEnemyChamp}
						defaultChamp={defaultChamp}

					/>
				</div>
				
			</div>
		</div>
	);
}
interface ChampViewPanelProps {
	champ: Champion|undefined,
	setChamp: React.Dispatch<React.SetStateAction<Champion|undefined>>
	defaultChamp: Champion,

}
const ChampViewPanel: React.FC<ChampViewPanelProps> = ({champ, setChamp, defaultChamp }) => {
	function handleRightClick(e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) {
		e.preventDefault();
		setChamp(undefined);
	}
	return (
		<ChampToolTipTrigger champ={(champ !== undefined) ? champ : defaultChamp} toSetTTPosition={ToolTipPosition.Right }>
			<ChampDroppable champ={setChamp}>
				{
					((champ !== undefined) ?
						
						<ChampDraggable champ={champ} setChamp={setChamp}>
							
							<div className="rightclickhandler" onContextMenu={(e) => handleRightClick(e)}>
								<DisplayPanel
									imageURL={require("../champions/champion-images/" + champ.image)}
									label={champ.championName}
								/>
							</div>
							
						</ChampDraggable>
					:
						<div className="rightclickhandler" onContextMenu={(e) => handleRightClick(e)}>
							<DisplayPanel
								imageURL={require("../champions/champion-images/" + defaultChamp.image)}
								label={defaultChamp.championName}
							/>
						</div>
					)
				}

			</ChampDroppable>
		</ChampToolTipTrigger>
	);
}


interface SelectPanelProps {
	itemSelect: boolean;
	viewable: boolean;
}

const SelectPanel: React.FC<SelectPanelProps> = ({ itemSelect, viewable }) => {
	const [searchTermItem, setSearchTermItem] = useState('');
	const [searchTermChamp, setSearchTermChamp] = useState('');

	const [itemCategoryFilter, setItemCategoryFilter] = useState<ItemCategory>(ItemCategory.None);
	const [itemTypeFilter, setItemTypeFilter] = useState<ItemType>(ItemType.None);
	//let itemList: Array<Item> = ItemList.getFilteredItems(ItemCategory.All, ItemType.Legendary);

	function getItemList() {
		return ItemList.getFilteredItems(itemCategoryFilter, itemTypeFilter, searchTermItem);
	}

	function getChampionList() {
		return ChampionList.getFilteredChampions(searchTermChamp);
	}
	return (
		viewable ? (
			<div className="SelectPanel">
				<div>
					<input
						name={itemSelect ? "ItemSearch" : "ChampionSearch"}
						placeholder={itemSelect ? "Enter item..." : "Enter champion..."}
						className="UITextInput"
						style={{
							width: "100%",
							height: "100%",
							padding: "3px",
						}}
						value={itemSelect ? searchTermItem : searchTermChamp}
						onChange={event => { itemSelect ? setSearchTermItem(event.target.value) : setSearchTermChamp(event.target.value); }}
					/>
				</div>


				<div className="UIPanel">
					{
						itemSelect ?
							<div>
								<SelectorFilter<ItemCategory>
									filter={itemCategoryFilter}
									setFilter={setItemCategoryFilter}
									entries={
										Object.entries(ItemCategory).filter(([key, value]) => !isNaN(Number(ItemCategory[key as keyof typeof ItemCategory])) && key !== 'None')
									}
								/>
								<div className="UIPanel" />
								<SelectorFilter<ItemType>
									filter={itemTypeFilter}
									setFilter={setItemTypeFilter}
									entries={
										Object.entries(ItemType).filter(([key, value]) => !isNaN(Number(ItemType[key as keyof typeof ItemType])) && key !== 'None')
									}
								/>

							</div>

							:
							"Champion Sorting here(if applicable)"
					}
				</div>
				<div className="UIPanel GridContainer ItemGrid">
					{
						itemSelect ?
							getItemList().map(function (item, index) {
								return (
									<ItemSelector
										item={item}
										index={index}
										key={(item as typeof Item).itemName}
									/>
								);
							})
							:
							getChampionList().map(function (champ, index) {
								return (
									<ChampSelector
										champ={champ}
										index={index}
										key={(champ).championName}
									/>
								);
							})

					}
				</div>

			</div>

		) : <div/>
		);
}

interface SelectorFilterProps<T> {
	filter: T,
	setFilter: Dispatch<SetStateAction<T>>,
	entries: Array<[string, string | T]>,
}
/**
 * only use with filter and setFilter of numbers/number enums
 * @param props
 * @returns
 */
export const SelectorFilter = <T extends number,>( props: SelectorFilterProps<T> ) => {
	return (
		<div className="SelectorButtonContainer">
			{
				props.entries.map(([key, value]) => {
					return (
						<div className={"SelectorButton"} key={key }>
							<ToggleButtonStateFlag
								currentState={props.filter as number}
								toSetState={value as number}
								setState={props.setFilter as Dispatch<SetStateAction<number>>}
								label={key}
							/>
						</div>
					)
				})
			}
		</div>
	);
}


interface DisplayPanelProps {
	imageURL: string,
	label: string
}

const DisplayPanel: React.FC<DisplayPanelProps> = ({ imageURL, label }) => {
	return (
		<div className="displaypanel">
			<div style={{ height: ".25em" }} />
	
				<img src={imageURL} alt="" className="DisplayImage" />
	
			<div className="Label">
				{label}
			</div>
		</div>

	);
}

interface ItemSelectorProps {
	item: Item,
	index: number,
}

const ItemSelector: React.FC<ItemSelectorProps> = ({ item, index }) => {
	return (
		<ItemToolTipTrigger item={item} toSetTTPosition={ToolTipPosition.Right }>
			<ItemDraggable item={item}>
				<div className="UIPanel GridItem ImageLabelContainer" key={index}>
					<div className="Image">
						<img src={require("../items/item-images/" + (item as typeof Item).image)} alt="" />
					</div>
					<label className="Label">
						{(item as typeof Item).itemName}
					</label>
				</div>
			</ItemDraggable>
		</ItemToolTipTrigger>
		
	);
}

interface ChampSelectorProps {
	champ: Champion,
	index: number,

}

const ChampSelector: React.FC<ChampSelectorProps> = ({ champ, index }) => {
	return (
		<ChampToolTipTrigger champ={champ} toSetTTPosition={ToolTipPosition.Right }>
			<ChampDraggable champ={champ}>
				<div className="UIPanel GridItem ImageLabelContainer" key={index}>
					<div className="Image">
						<img src={require("../champions/champion-images/" + (champ).image)} alt="" />
					</div>
					<label className="Label">
						{(champ).championName}
					</label>
				</div>
			</ChampDraggable>
			
		</ChampToolTipTrigger>

	);
}

interface ChampAttributesProps {
	setDefaultChamp:Dispatch<SetStateAction<Champion>>
}

const ChampAttributes: React.FC<ChampAttributesProps> = ({setDefaultChamp }) => {
	const dispatch = useAppDispatch();
	const calculatorAttributes = useAppSelector((state) => state.calculatorAttributes)

	const allyLevel = useRef(calculatorAttributes.allyLevel);
	const enemyLevel = useRef(calculatorAttributes.enemyLevel);
	const allyBurstSequence = useRef(calculatorAttributes.burstSequence);
	const allyDPSPriority = useRef(calculatorAttributes.dpsPriority);

	const tdBaseHealth = useRef<number>(TargetDummy.staticBaseStats.get(Stat.Health) ?? 0);
	const tdBaseArmor = useRef<number>(TargetDummy.staticBaseStats.get(Stat.Armor) ?? 0);
	const tdBaseMR = useRef<number>(TargetDummy.staticBaseStats.get(Stat.MagicResist) ?? 0);

	function handleAttributeSet() {

		dispatch(setCalcAttr(allyLevel.current,allyBurstSequence.current,allyDPSPriority.current, enemyLevel.current));

		//console.log("worked: " +allyDPSPriority.current);
	}

	function handleTargetDummyStatSet() {
		//only do update when stat changes
		if (
			TargetDummy.staticBaseStats.get(Stat.Health) !== tdBaseHealth.current ||
			TargetDummy.staticBaseStats.get(Stat.Armor) !== tdBaseArmor.current ||
			TargetDummy.staticBaseStats.get(Stat.MagicResist) !== tdBaseMR.current
		) {
			TargetDummy.staticBaseStats = new Map<Stat, number>([
				[Stat.Health, tdBaseHealth.current],
				[Stat.Armor, tdBaseArmor.current],
				[Stat.MagicResist, tdBaseMR.current],
			]);
			setDefaultChamp(new TargetDummy());
		}
	
	}

	return (
		<div className="AttributesPanel UIPanel">
			Range between champions is currently set to 500 units.
			<AttributeInput<number>
				label="Ally Level:"
				placeholder="1"
				maxWidth="2.5em"
				valueRef={allyLevel}
				regex={/^[0-9\b]+$/}
				handleAttributeSet={handleAttributeSet}
				blankValue={1}
				maxLength={2}
			/>
			<AttributeInput<string>
				label="Burst Sequence:"
				placeholder="q, w, e, r, a"
				maxWidth="6em"
				valueRef={allyBurstSequence}
				regex={/^[aAqQwWeErR\b]+$/}
				handleAttributeSet={handleAttributeSet}
			/>
			<AttributeInput<string>
				label="DPS Priority:"
				placeholder="q, w, e, r, a"
				maxWidth="6em"
				valueRef={allyDPSPriority}
				regex={/^[aAqQwWeErR\b]+$/}
				handleAttributeSet={handleAttributeSet}
			/>

			<AttributeInput<number>
				label="Enemy Level:"
				placeholder="1"
				maxWidth="2.5em"
				valueRef={enemyLevel}
				regex={/^[0-9\b]+$/}
				handleAttributeSet={handleAttributeSet}
				blankValue={1}
				maxLength={2}
			/>

			Target Dummy Stats:
			<AttributeInput<number>
				label={<span>Base <StatIcon stat={Stat.Health}/> Health:</span>}
				placeholder="1"
				maxWidth="5em"
				valueRef={tdBaseHealth}
				regex={/^[0-9\b]+$/}
				handleAttributeSet={handleTargetDummyStatSet}
				blankValue={1}
				maxLength={6}
			/>
			<AttributeInput<number>
				label={<span>Base <StatIcon stat={Stat.Armor} /> Armor:</span>}
				placeholder="0"
				maxWidth="5em"
				valueRef={tdBaseArmor}
				regex={/^[0-9\b]+$/}
				handleAttributeSet={handleTargetDummyStatSet}
				blankValue={0}
				maxLength={6}
			/>
			<AttributeInput<number>
				label={<span>Base <StatIcon stat={Stat.MagicResist} /> Magic Resist:</span>}
				placeholder="0"
				maxWidth="5em"
				valueRef={tdBaseMR}
				regex={/^[0-9\b]+$/}
				handleAttributeSet={handleTargetDummyStatSet}
				blankValue={0}
				maxLength={6}
			/>
		</div>
	);
}

interface ItemAttributesProps {
	setDefaultChamp: Dispatch<SetStateAction<Champion>>
}

const ItemAttributes: React.FC<ItemAttributesProps> = ({setDefaultChamp  }) => {
	function handleItemStackSet() {
		setDefaultChamp(new TargetDummy());
	}

	return (
		<div className="AttributesPanel UIPanel">
		Edit Item initial stacks:
			{
				ItemList.stackPassives.map((passive) => {
					return (
						<ItemStackInput
							itemPassive={passive}
							handleItemStackSet={handleItemStackSet}
							key={passive.name }
						/>)
				})
			}
		</div>
	);
}

interface AttributeInputProps<T> {
	label: string | JSX.Element,
	placeholder: string,
	/**for style, max width of input box- suggest use em*/
	maxWidth: string | number,
	valueRef: MutableRefObject<T>,
	regex: RegExp,
	handleAttributeSet?: Function,
	blankValue?: T;
	maxLength?: number;
}

export const AttributeInput = <T extends string | number,>(props: AttributeInputProps<T>) => {
	return (
		<div className="AttributeContainer">
			<label>
				{props.label}
			</label>
			<span className="FlexGrow" />

			<input
				//name={"allyLevelSet"}
				type="text"
				//pattern="[0-9]{2}"
				placeholder={props.placeholder}
				autoComplete="off"
				className="UITextInput"
				style={{
					maxWidth: props.maxWidth,
					height: "100%",
					padding: "3px",
				}}
				defaultValue={props.valueRef.current}
				onChange={event => {
					if (event.target.value === '' || props.regex.test(event.target.value)) {
						//if number
						if ((typeof props.valueRef.current === 'number')) {
							if (event.target.value !== '')
								(props.valueRef as MutableRefObject<number>).current = parseInt(event.target.value);
						} else { //is string
							(props.valueRef as MutableRefObject<string>).current = event.target.value;
						}
						
					} else {
						event.target.value = props.valueRef.current + "";
					}
				}}
				onBlur={event => {
					if (event.currentTarget.value === '' && props.blankValue !== undefined) {
						event.currentTarget.value = props.blankValue + '';
						props.valueRef.current = props.blankValue;
					}
					if(props.handleAttributeSet !== undefined)
						props.handleAttributeSet();
				}}
				onKeyUp={
					event => {
						if (event.key === "Enter") {
							event.preventDefault();
							event.currentTarget.blur();
						}
					}
				}
				//minLength={1}
				maxLength={props.maxLength}
				//size={1}

			/>
		</div>
	);
}

interface ItemStackInputProps {
//	label: string | JSX.Element,
//	placeholder: string,
//	/**for style, max width of input box- suggest use em*/
//	maxWidth: string | number,
	itemPassive: typeof Passive,
	handleItemStackSet?: Function,
//	blankValue?: number;
//	maxLength?: number;
}

export const ItemStackInput = (props: ItemStackInputProps) => {
	const toChangeTo = useRef(props.itemPassive.INITIALSTACKS);
	return (
		<div className="AttributeContainer">
			<label className="ItemStackLabel">
				<span className="PassiveImage">
					<img src={require("../items/item-images/" + props.itemPassive.image)} alt={props.itemPassive.image.replace(/(.wbp)(HD)(item)/,'').replace("_", " ").trimEnd()} />
				</span>
				
				{/** @todo: actually put passive name here, instead of class name... somehow. will require refactor of a few files */ }
				<span>
					{StatNameReplace(props.itemPassive.name) + " stacks(max " + props.itemPassive.MAXSTACKS + ")"}
				</span>
			</label>
			<span className="FlexGrow" />

			<input
				//name={"allyLevelSet"}
				type="text"
				//pattern="[0-9]{2}"
				placeholder={'0'}
				autoComplete="off"
				className="UITextInput"
				style={{
					maxWidth: "4em",
					height: "100%",
					padding: "3px",
				}}
				defaultValue={( props.itemPassive).INITIALSTACKS}
				onChange={event => {
					if (event.target.value === '' || /^[0-9\b]+$/.test(event.target.value)) {

						if (event.target.value !== '')
							toChangeTo.current = parseInt(event.target.value);


					} else {
						event.target.value = toChangeTo.current + "";
					}
				}}
				onBlur={event => {
					if (event.currentTarget.value === '') {
						event.currentTarget.value ='0';
						toChangeTo.current = 0;
					}
					if (toChangeTo.current > props.itemPassive.MAXSTACKS) {
						toChangeTo.current = props.itemPassive.MAXSTACKS;
					}
					props.itemPassive.INITIALSTACKS = toChangeTo.current;
					event.currentTarget.value = toChangeTo.current + '';
					if (props.handleItemStackSet !== undefined)
						props.handleItemStackSet();
				}}
				onKeyUp={
					event => {
						if (event.key === "Enter") {
							event.preventDefault();
							event.currentTarget.blur();
						}
					}
				}
				//minLength={1}
				maxLength={5}
			//size={1}

			/>
		</div>
	);
}