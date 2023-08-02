import React from 'react';
import { Stat, StatNameIconReplace } from '../Stat';
import './TextIcon.css';
//import './UIPanel.css';

interface StatIconProps {
	stat:Stat,
}

export const StatIcon: React.FC<StatIconProps> = ({stat }) => {

	let statName: string = StatNameIconReplace(Stat[stat]);

	return (
		<TextIcon
			iconName={statName}
		/>
		
	);
}

interface TextIconProps {
	/**
	 * the name if icon, without 'Icon_'
	 */
	iconName:string,
}

export const TextIcon: React.FC<TextIconProps> = ({ iconName }) => {
	let element: JSX.Element = <img/>;
	if(iconName !== "")
		element = <img src={require("./stat_icons/Icon_" + iconName + ".svg")} alt="" className="TextIcon" />

	return (
		<div className="IconContainer">
			{(iconName !== "") && (element)}
		</div>

	);
}