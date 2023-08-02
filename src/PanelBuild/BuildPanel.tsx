import React, { useMemo, useRef, useState } from 'react';
import { ChampBuild } from '../builds/ChampBuild';
import { Champion } from '../champions/Champion';
import '../UIPanel.css';
import './BuildPanel.css';
import '../ToggleButton.css';
import { ToggleButtonState } from '../ToggleButton';
import { Item, ItemCategory } from '../items/Item';
import { ItemList } from '../items/ItemList';
import { getSortStats, Stat, StatNameReplace, StatValueConversion } from '../Stat';
import { StatIcon } from '../icons/TextIcon';
import { StatBuild } from '../builds/StatBuild';
import { TargetDummy } from '../champions/champion-objects';
import Select from 'react-select';
import { ChampBuildObject } from '../builds/ChampBuildObject';
import { GeneratePanel } from './GeneratePanel';

interface BuildPanelProps {
	allyChamp: Champion | undefined,
	enemyChamp: Champion | undefined,
	defaultChamp: Champion,
	allyLevel: number,
	burstSequence: string,
	dpsPriority: string,
	enemyLevel: number,
}

export const BuildPanel: React.FC<BuildPanelProps> = ({ allyChamp, enemyChamp, defaultChamp, allyLevel, burstSequence, dpsPriority, enemyLevel }) => {
	const [rerender, setRerender] = useState<boolean>(false);
	const [editBuild, setEditBuild] = useState<boolean>(true);

	const enemyBuild = useRef<ChampBuildObject>(new ChampBuildObject(0, enemyChamp ?? defaultChamp, allyChamp ?? defaultChamp, [], true));

	const [builds, setBuilds] = useState<Array<ChampBuildObject>>(
		new Array<ChampBuildObject>(new ChampBuildObject(0, allyChamp ?? defaultChamp, enemyChamp ?? defaultChamp, [], false))
	);
	

	const buildKey = useRef<number>(1);

	const statOptions = getSortStats(true).map(([statName, stat]) => {
		return (
			{
				value: StatNameReplace(Stat[stat as Stat]),
				label: (
					<div>
						<StatIcon stat={stat as Stat} /> {StatValueConversion(stat as Stat, stat as Stat === Stat.AttackSpeed ? new StatBuild(new TargetDummy(), [{ item: undefined }]) : undefined, 0).replace(/(0)/, "")} {StatNameReplace(statName)}
					</div>
				),
				stat: stat as Stat,
					
			}
		);
	});

	const [sortByGoldEfficiency, setSortByGoldEfficiency] = useState<boolean>(false);


	const defaultItemSet = useRef<ItemCategory>(ItemCategory.Mage);
	const sortStat = useRef<Stat>(statOptions.at(0)?.stat!);
	const prevSortStat = useRef<Stat>(-1);

	const [sortAsc, setSortAsc] = useState<boolean>(true);

	//optimally this is a ref, but it doesn't update all the builds when changed, so it's ok for now
	const [itemCategoryFilter, setItemCategoryFilter] = useState<ItemCategory>(ItemCategory.Mage);

	const slotPools = useRef<Array<Array<{ item: Item | undefined }>>>(
		new Array(
			new Array<{ item: Item | undefined }>(),
			new Array<{ item: Item | undefined }>(),
			new Array<{ item: Item | undefined }>(),
			new Array<{ item: Item | undefined }>(),
			new Array<{ item: Item | undefined }>(),
			new Array<{ item: Item | undefined }>(),
		)

	);

	const numItemsInBuild = useRef<number>(3);

	let generatedBuilds: Array<Array<Item>> = new Array<Array<Item>>();// = ItemList.getGeneratedBuilds(defaultItemSet, maxItems);



	//console.log("rerender");

	if (allyChamp !== undefined) {
		allyChamp.level = allyLevel;
		allyChamp.burstSequence = burstSequence;
		allyChamp.dpsPriority = dpsPriority;
	}
		
	if (enemyChamp !== undefined) {
		enemyChamp.level = enemyLevel;
	} else {
		defaultChamp.level = enemyLevel;
	}

	function updateBuilds() {
		enemyBuild.current.update(enemyChamp ?? defaultChamp, allyChamp ?? defaultChamp)
		builds.forEach((build) => {
			build.update(allyChamp ?? defaultChamp, enemyChamp ?? defaultChamp);
		});
		prevSortStat.current = -1;
	}

	//update builds on rerender, settings change
	useMemo(() => {
		updateBuilds();
	}, [rerender, allyChamp, enemyChamp, allyLevel, enemyLevel, burstSequence, dpsPriority]);
	useMemo(() => {
		if ((enemyChamp ?? defaultChamp) instanceof TargetDummy || (allyChamp ?? defaultChamp) instanceof TargetDummy)
			updateBuilds();
	}, [defaultChamp])

	/**
	 * turns generatedBuilds into champBuilds in refBuilds
	 */
	function generatedToChampBuild() {
		let newBuilds: Array<ChampBuildObject> = new Array<ChampBuildObject>();
		for (let i = 0; i < generatedBuilds.length; i++) {


			let buildItems = new Array<{ item: Item | undefined }>;
			generatedBuilds[i].forEach((item) => {
				buildItems.push({ item: item });
			})
			

//			console.log(buildItems);
			newBuilds.push(
				new ChampBuildObject(i+buildKey.current, allyChamp ?? defaultChamp, enemyChamp ?? defaultChamp, buildItems, false)				
			);
			
		}
		buildKey.current += generatedBuilds.length;
		setBuilds(new Array<ChampBuildObject>(...newBuilds));
	}

	function sortBuilds(byCostEfficiency?:boolean) {
		//console.log("sort asc: " + sortAsc);

		let sortTrue = false ? 1 : -1;
		let sortFalse = false ? -1 : 1;
		
		setBuilds(new Array<ChampBuildObject>(
			...(
				builds.sort(
					((byCostEfficiency ?? false) && sortStat.current !== Stat.Cost) ?
						(a, b) => (a.statBuild.getTotalStat(sortStat.current) ?? 0) / (a.statBuild.getTotalStat(Stat.Cost) ?? 0) > (b.statBuild.getTotalStat(sortStat.current) ?? 0) / (b.statBuild.getTotalStat(Stat.Cost) ?? 0) ? sortTrue : sortFalse
						:
						(a, b) => (a.statBuild.getTotalStat(sortStat.current) ?? 0) > (b.statBuild.getTotalStat(sortStat.current) ?? 0) ? sortTrue : sortFalse
				)
			)
		));

	//	console.log(Stat[sortStat.current]);
	//	for (let i = 0; i < (builds?.length ?? 0); i++) {
	//		//console.log(i + ": " + builds[i].refIndex);
	//		console.log(builds[i].statBuild.getTotalStat(sortStat.current));
	//	}
	}

	return (
		<div className="UIPanel BuildPanel">
			<div className="UIPanel">
				<div className={"SelectorButton"}>
					<ToggleButtonState<boolean>
						label={editBuild ? "Edit Generator" : "Save and Edit Builds"}
						currentState={editBuild}
						toSetState={!editBuild}
						setState={setEditBuild}
					/>
				</div>
			</div>


			<div className={"BuildsPanel View" + editBuild}>

				<div className="UIPanel Enemy BuildsContainer">
					Enemy Build
					<div className="EnemyBuild">
						<ChampBuild
							champBuild={enemyBuild.current}
							champ={enemyChamp ?? defaultChamp}
							target={allyChamp ?? defaultChamp}
							isEnemy={true}
							rerender={rerender}
							setRerender={setRerender}
						/>
					</div>
				</div>
				
				<button className={"Inactive"}
					onClick={() => {
						generatedBuilds = ItemList.getGeneratedBuilds(defaultItemSet.current, slotPools.current, numItemsInBuild.current);
						generatedToChampBuild();
						setSortAsc(true);
					}}
				>
					Generate Ally Builds
				</button>
				<div className="SortDiv UIPanel">
					<div className="SelectDiv">
						{/** @todo: make this into a separate component  */ }
						<Select
							defaultValue={statOptions[0]}
							options={statOptions}
							styles={{
								menu: base => ({
									...base,
									marginTop: 0,
									paddingBottom:0,
								}),
								input: provided => ({
									...provided,
									'[type="text"]': {
										color: 'white !important'
									}
								}),
								option: provided => ({
									...provided,
									color: 'white'
								}),
								control: provided => ({
									...provided,
									color: 'white'
								}),
								singleValue: provided => ({
									...provided,
									color: 'white'
								})
							}}

							theme={(theme) => ({
								...theme,

								colors: {
									...theme.colors,
									primary: '#808080',
									primary25: '#606060',
									primary50: '#404040',
									primary75: '#202020',

									neutral0: 'black',
								},
							})}
							onChange={(option) => {
								sortStat.current = option!.stat;
							}}
						/>
					</div>

					<ToggleButtonState<boolean>
						label={sortByGoldEfficiency ?"Sorting by Gold efficiency" : "Not sorting by Gold efficiency"}
						currentState={sortByGoldEfficiency}
						toSetState={!sortByGoldEfficiency}
						setState={setSortByGoldEfficiency }
						activeState={true }
					/>

					<button className={"Inactive"}
						onClick={() => {
							if (sortStat.current === prevSortStat.current) {
								setSortAsc(!sortAsc);
							} else {
								setSortAsc(false);
								prevSortStat.current = sortStat.current;
							}
							sortBuilds( sortByGoldEfficiency);
						}}
					>
						{"Sort Ally Builds(Press again to flip direction)"}
					</button>

				</div>

				<div className="UIPanel Ally BuildsContainer">
					Ally Builds
					<button className={"Inactive"}
						onClick={() => {
							//insert at beginning or end depending on current sort direction
							setBuilds(
								sortAsc ?
									new Array<ChampBuildObject>(
										...builds,
										new ChampBuildObject(buildKey.current, allyChamp ?? defaultChamp, enemyChamp ?? defaultChamp, [], false),
									)
								:
									new Array<ChampBuildObject>(
										new ChampBuildObject(buildKey.current, allyChamp ?? defaultChamp, enemyChamp ?? defaultChamp, [], false),
										...builds,
									)
							);
										

							buildKey.current++;
							//setButtonRender(!buttonRender);
							//console.log("criiiii");
						}}
					>
						Add Empty Build
					</button>
					Only up to 100 builds are displayed at a time
					<div className="Builds">
						{
							builds?.slice(sortAsc ? -100 : 0, sortAsc ? builds.length : 100)[sortAsc ? 'reverse' : 'slice']().map((build) => {
								return (
									<ChampBuild
										champBuild={build }
										champ={allyChamp ?? defaultChamp}
										target={enemyChamp ?? defaultChamp}
										isEnemy={false}
										rerender={rerender}
										initialItems={build.items }
										key={"champBuild " +build.key}
									/>
								);
							})
						}
					</div>
				</div>
			</div>
			<div className={"UIPanel GeneratePanel View" + !editBuild}>
				<GeneratePanel
					itemCategoryFilter={itemCategoryFilter}
					setItemCategoryFilter={setItemCategoryFilter}
					slotPools={slotPools}
					numItemsInBuild={numItemsInBuild }
				/>
			</div>
		</div>
	);
}

