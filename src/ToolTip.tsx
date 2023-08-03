import React, { useState } from 'react';
import { Item } from './items/Item';
import './UIPanel.css';
import './ToolTip.css';
import { StatIcon } from './icons/TextIcon';
import { Stat, StatDescription, StatNameIconReplace, StatNameReplace, StatValueConversion } from './Stat';
import $ from 'jquery';
import { Champion, ResourceType } from './champions/Champion';
import { StatBuild } from './builds/StatBuild';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { setHover, ToolTipPosition, ToolTipType } from './store/features/ttHoverSlice';

interface ToolTipProps {

};

export const ToolTip: React.FC<ToolTipProps> = ({ }) => {
	const ttHover = useAppSelector((state) => state.ttHover);
	return (
		<div className={"tooltippanel"}>
			{
				(ttHover.type === ToolTipType.Item) && (
					<ItemToolTip
						hoverType={ttHover.type}
						item={ttHover.hovered}
						ttPosition={ttHover.position}
						statBuild={ttHover.extra}
					/>
				)
			}


			{
				(ttHover.hovered instanceof Champion) && (
					<ChampToolTip
						hoverType={ttHover.type}
						champ={ttHover.hovered}
						ttPosition={ttHover.position}
					/>
				)
			}

			{
				(ttHover.type === ToolTipType.Stat) && (
					<StatToolTip
						hoverType={ttHover.type}
						stat={ttHover.hovered as Stat}
						ttPosition={ttHover.position}
					/>
				)
			}
		</div>
	);
}


interface ItemToolTipTriggerProps {
	item?: Item,
	children?: React.ReactNode,
	toSetTTPosition: ToolTipPosition,
	statBuild?: StatBuild,
};
interface ItemToolTipProps {
	item?: Item,
	hoverType: ToolTipType,
	ttPosition: ToolTipPosition,
	statBuild?: StatBuild,
};

export const ItemToolTipTrigger: React.FC<ItemToolTipTriggerProps> = ({ children, item,  toSetTTPosition, statBuild }) => {
	const dispatch = useAppDispatch();


	return (
		<div
			className={"ItemToolTipTrigger ToolTipTrigger"}
			onMouseEnter={() => { dispatch(setHover(ToolTipType.Item, item, toSetTTPosition, statBuild)) }}
			onMouseLeave={() => { dispatch(setHover(ToolTipType.None, undefined, toSetTTPosition)) }}
		>
			{children}
		</div>
	);
};


export const ItemToolTip: React.FC<ItemToolTipProps> = ({ hoverType, item, ttPosition, statBuild }) => {
	return (
		<div>
			<div id={"ItemArrow"} className={"TTPanel Dark ToolTipArrow " + ttPosition + " opacity" + (hoverType === ToolTipType.Item)}></div>
			<div id={"ItemTTC"} className={"TTPanel Dark ToolTipContainer " + ttPosition + " opacity" + (hoverType === ToolTipType.Item)}>
				<div className="ItemTT">
					<div className="UIPanel ItemImageFrame">
						{((item as typeof Item) !== undefined) && (
							<img src={require("./items/item-images/" + (item as typeof Item).image)} alt="" />
						)}
						
					</div>

					<div className="ItemText">
						<div className="ItemName TTFont">
							{((item as typeof Item) !== undefined) ? ((item as typeof Item).itemName) : "Blank item slot"}
						</div>
						<div className="FlexGrow" />
						<div className="ItemCost TTFont Cost">
							<StatIcon stat={Stat.Cost } /> {((item as typeof Item) !== undefined) ? (((item as typeof Item).stats !== undefined) && ((item as typeof Item).stats.get(Stat.Cost))) : 0}
						</div>
					</div>
				</div>

				<div className="ItemStatsTT">
					<div className="TTFont TextTT">
						{
							((item as typeof Item) !== undefined) && (
								((item as typeof Item).stats !== undefined) && (
									[...(item as typeof Item).stats].map(([key, value]) => (
										/* ignores cost when giving stats */
										(key.valueOf() !== Stat.Cost.valueOf()) && (
											<div key={key}>
												<span className="TextStats TTFont"> <StatIcon stat={key}/> {StatValueConversion(key, undefined, value)} {StatNameReplace(Stat[key])}</span>
											</div>
										)

									))
								)
							)
						}

					</div>
					<div>
						{
							((item as typeof Item) !== undefined) && (
								((item as typeof Item).passives !== undefined) && (
									(item as typeof Item).passives.map((passive, index) => (
										<div className="Passive TTFont TextTT" key={passive.passiveName}>
											{( passive.passiveName !== "" ) && (<span className="TextPassiveName TTFont">{passive.passiveName}: </span>)}
											{passive.Description(statBuild)}
											<div className="TextAdditionalTip TTFont TextTT">
												{passive.additionalTip }
											</div>
										</div>
									))
								)
							)
						}

					</div>

					<div style={{ height: 20 }} />{/*this is the gap between passive and mythic passive*/}

					{
						((item as typeof Item) !== undefined) && (
							((item as typeof Item).mythicStats !== undefined) && (


								<div className="Passive TTFont TextTT">
									<span className="TextMythicPassiveName">Mythic Passive: </span>
									{'Grants all Legendary items '}
									{
										[...(item as typeof Item).mythicStats].map(([key, value], index) => {
											return (
												<span key={key}>
													<StatIcon stat={key} /> {StatValueConversion(key, undefined, value)}{StatNameReplace(Stat[key])}
													{(index !== (item as typeof Item).mythicStats.size - 1 && <span>, </span>)}
												</span>
											);

										})
									}
									<div style={{ height: 20 }} />{/*this is the gap between mythic passive and tip*/}
								</div>
							)
						)
					}

				</div>
				<div className="TipTT TTFont TextTT">
					<span className="TextAdditionalTip">
						{((item as typeof Item) !== undefined) ? ((item as typeof Item).additionalTip) : "This slot is empty. Add an item!"}
					</span>
					
					<div className="linebreak" style={{ height: ".5em" }} />
					
					Drag and Drop items to add to a build
					<br/>
					Right Click items or Drag and Drop them out of the build to remove them
					
					
				</div>
			</div>

		</div>


	);
};

interface ChampToolTipTriggerProps {
	champ: Champion,
	children?: React.ReactNode,
	toSetTTPosition: ToolTipPosition,
};
interface ChampToolTipProps {
	champ: Champion,
	hoverType: ToolTipType,
	ttPosition: ToolTipPosition,
};

export const ChampToolTipTrigger: React.FC<ChampToolTipTriggerProps> = ({ children, champ, toSetTTPosition }) => {
	const dispatch = useAppDispatch();

	return (
		<div className="ChampToolTipTrigger ToolTipTrigger"
			onMouseEnter={() => { dispatch(setHover(ToolTipType.Champ, champ, toSetTTPosition)) }}
			onMouseLeave={() => { dispatch(setHover(ToolTipType.None, undefined, toSetTTPosition)) }}
		>
			{children}
		</div>
	);
};
export const ChampToolTip: React.FC<ChampToolTipProps> = ({ hoverType, champ, ttPosition }) => {
	return (
		<div>
			<div id={"ChampArrow"} className={"TTPanel Dark ToolTipArrow " + ttPosition + " opacity" + (hoverType === ToolTipType.Champ)}></div>
			<div id={"ChampTTC" } className={"TTPanel Dark ToolTipContainer " + ttPosition + " opacity" + (hoverType === ToolTipType.Champ)}>
				<div className="ItemTT">
					<div className="UIPanel ItemImageFrame">
						<img src={require("./champions/champion-images/" + (champ).image)} alt="" />
					</div>

					<div className="ItemText">
						<div className="ItemName TTFont">
							{(champ).championName}
						</div>
						<div className="FlexGrow" />
						<div className="TTFont Cost">
							{(champ).epithet}
						</div>
					</div>
				</div>
				<div className="TipTT TTFont TextTT">
					{(champ).additionalTip}
					<div className="linebreak" style={{ height: ".5em" }} />
					{
						(champ).resourceType !== ResourceType.None && (
							<div>This Champion uses {ResourceType[champ.resourceType]}- if not enough is present, then DPS will take that in account.<br/><br/></div>
						)
					}
					Drag and Drop champions to set as ally(left) or enemy(right)
					<br />
					Right Click or Drag and Drop outside to remove the champion
				</div>
			</div>

		</div>
	);
};

interface StatToolTipTriggerProps {
	stat: Stat,
	children?: React.ReactNode,
	toSetTTPosition: ToolTipPosition,
};
interface StatToolTipProps {
	stat: Stat,
	hoverType: ToolTipType,
	ttPosition: ToolTipPosition,
};

export const StatToolTipTrigger: React.FC<StatToolTipTriggerProps> = ({ children, stat, toSetTTPosition}) => {
	const dispatch = useAppDispatch();

	return (
		<div className="StatToolTipTrigger ToolTipTrigger"
			onMouseEnter={() => { dispatch(setHover(ToolTipType.Stat, stat, toSetTTPosition)) }}
			onMouseLeave={() => { dispatch(setHover(ToolTipType.None, undefined, toSetTTPosition)) }}
		>
			{children}
		</div>
	);
};
export const StatToolTip: React.FC<StatToolTipProps> = ({ hoverType, stat, ttPosition }) => {
	return (
		<div>
			<div id={"StatArrow"} className={"TTPanel Dark ToolTipArrow " + ttPosition + " opacity" + (hoverType === ToolTipType.Stat)}></div>
			<div id={"StatTTC"} className={"TTPanel Dark ToolTipContainer " + ttPosition + " opacity" + (hoverType === ToolTipType.Stat)}>
				<div className="ItemTT">
					<div className="StatImageFrame">
						<img src={require("./icons/stat_icons/Icon_" + StatNameIconReplace(Stat[stat]) + ".svg")} alt="" className="StatImage" />
					</div>


					<div className="ItemName TTFont">
						{StatNameReplace(Stat[stat])}
					</div>

				</div>
				<div className="TTFont TextTT">
					<div className="linebreak" style={{ height: ".5em" }} />
					{StatDescription(stat) }
				</div>
			</div>

		</div>
	);
};


//attach to document so that mouseenter events can fire when .ToolTipTrigger is hovered
$(document).on('mouseenter', '.ToolTipTrigger', function () {

	var _this = this;
	//function moveTT() {
		var tt;
		var arrow;
		if ($(_this).hasClass('ItemToolTipTrigger')) {
			tt = $('#ItemTTC');
			arrow = $('#ItemArrow');
		} else if ($(_this).hasClass('ChampToolTipTrigger')) {
			tt = $('#ChampTTC');
			arrow = $('#ChampArrow');
		} else {
			tt = $('#StatTTC');
			arrow = $('#StatArrow');
		}
		
		//console.log(tt.attr('class'));
		let height = tt.outerHeight() ?? 0;
		let width = tt.outerWidth() ?? 0;
		let cellHeight = $(_this)?.height() ?? 0;
		let cellWidth = $(_this)?.width() ?? 0;
		let topRelative = cellHeight / 2 - height / 2;
		let leftRelative = cellWidth / 2 - width / 2;

		//ensure offset isn't possibly undefined'
		let ttOffsetTop;
		ttOffsetTop = $(_this).offset()?.top ?? 0;
		let ttOffsetLeft;
		ttOffsetLeft = $(_this).offset()?.left ?? 0;

		//console.log("topRelative: " + topRelative + " | ttOffsetTop: " + ttOffsetTop + " | height: " + height + " | window.innerHeight: " + window.innerHeight)
		let posDiff = 0;


		if (tt.hasClass('TTLeft') || tt.hasClass('TTRight')) {
			//which ever clamp is last will take priority when tooltip is larger than window

			//clamp tooltip top with window top
			//console.log(ttOffsetTop + topRelative + posDiff);
			if (ttOffsetTop + topRelative + posDiff < 0)
				posDiff = -(topRelative + ttOffsetTop);


			//clamp tooltip bottom with window bottom
			//console.log((ttOffsetTop + topRelative + height+posDiff) + " > " + window.innerHeight);
			if ((ttOffsetTop + topRelative + height + posDiff) > window.innerHeight)
				posDiff = (window.innerHeight - (ttOffsetTop + topRelative + height));

			tt.css({
				top: ttOffsetTop + topRelative + posDiff + "px",
			});


			//console.log("window.innerHeight: " + window.innerHeight + " | ttOffsetTop: " + ttOffsetTop + " | cellHeight/2: " + (cellHeight/2))
			posDiff = 0;
			if (window.innerHeight - (ttOffsetTop + cellHeight / 2 + 5) < 0)
				posDiff = window.innerHeight - (ttOffsetTop + cellHeight / 2) - 10 //-10 to keep arrow in full view
			arrow.css({
				top: ttOffsetTop + cellHeight / 2 + -5 + posDiff + "px",
			})


			if (tt.hasClass('TTRight')) { //show on right
				tt.css({
					left: ttOffsetLeft + cellWidth + "px",
				});
				arrow.css({
					left: ttOffsetLeft + cellWidth + -5 + "px"
				});
			}
			else { //show on left
				tt.css({
					left: ttOffsetLeft - width + "px",
				});
				arrow.css({
					left: ttOffsetLeft + -5 + "px"
				});
			}
		} else {
			//which ever clamp is last will take priority when tooltip is larger than window

			//clamp tooltip top with window left
			//console.log(ttOffsetTop + topRelative + posDiff);
			if (ttOffsetLeft + leftRelative + posDiff < 0)
				posDiff = -(leftRelative + ttOffsetLeft);


			//clamp tooltip bottom with window right
			//console.log((ttOffsetTop + topRelative + height+posDiff) + " > " + window.innerHeight);
			if ((ttOffsetLeft + leftRelative + width + posDiff) > window.innerWidth)
				posDiff = (window.innerWidth - (ttOffsetLeft + leftRelative + width));

			tt.css({
				left: ttOffsetLeft + leftRelative + posDiff + "px",
			});


			//console.log("window.innerHeight: " + window.innerHeight + " | ttOffsetTop: " + ttOffsetTop + " | cellHeight/2: " + (cellHeight/2))
			posDiff = 0;
			if (window.innerWidth - (ttOffsetLeft + cellWidth / 2 + 5) < 0)
				posDiff = window.innerWidth - (ttOffsetLeft + cellWidth / 2) - 10 //-10 to keep arrow in full view
			arrow.css({
				left: ttOffsetLeft + cellWidth / 2 + -5 + posDiff + "px",
			})


			if (tt.hasClass('TTBot')) { //show on bottom
				tt.css({
					top: ttOffsetTop + cellHeight + "px",
				});
				arrow.css({
					top: ttOffsetTop + cellHeight + -5 + "px"
				});
			}
			else { //show on top
				tt.css({
					top: ttOffsetTop - height + "px",
				});
				arrow.css({
					top: ttOffsetTop + -5 + "px"
				});
			}
		}
		
			
	//}
	//setTimeout(moveTT, 0); //add frame delay so that the component is rendered to correct height first
});