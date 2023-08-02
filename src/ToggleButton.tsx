import { ActionCreatorWithPayload, AnyAction, ThunkDispatch } from "@reduxjs/toolkit";
import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { DamageInstance } from "./builds/DamageInstance";
import { StatBuild } from "./builds/StatBuild";
import { StatNet } from "./builds/StatNet";
import { Champion } from "./champions/Champion";
import { set } from "./store/features/advancedBuildSlice";
import { useAppDispatch } from "./store/hooks";
import { Item } from "./items/Item";
import { Stat } from "./Stat";
import './ToggleButton.css';

interface ToggleButtonStateProps<T> {
	label: string,
	currentState: T,
	toSetState: T,
	setState: React.Dispatch<SetStateAction<T>>,
	activeState?:T,
}
/**
 * <T>: T is the type of the state the button changes
 * @param props
 * @returns
 */
export const ToggleButtonState = <T,>(props: ToggleButtonStateProps<T>) => {
	return (

		<button className={props.currentState === (props.activeState ?? props.toSetState) ? "Active" : "Inactive"}
			onClick={() => {
				props.setState?.(props.toSetState);
			}}
		>
			{props.label}
		</button>

	);
}

interface ToggleButtonStateFlagProps {
	label: string,
	currentState: number,
	toSetState: number,
	setState: React.Dispatch<SetStateAction<number>>,
}
/**
 * handles states that are flags
 * @param props
 * @returns
 */
export const ToggleButtonStateFlag = (props: ToggleButtonStateFlagProps) => {
	return (

		<button className={(props.currentState & props.toSetState) === props.toSetState ? "Active" : "Inactive"}
			onClick={() => {
				//if active, bitwise xor[^](subtract flags), else or[|](add flags)
				props.setState?.((props.currentState & props.toSetState) === props.toSetState ? props.currentState ^ props.toSetState : props.currentState | props.toSetState);
			}}
		>
			{props.label}
		</button>

	);
}


interface ToggleButtonStoreABProps {
	label: string,
	currentState: { statBuild: StatBuild, champ: Champion },
	toSetState: { statBuild: StatBuild, champ: Champion },
}
/**
 * advanced build
 * @param props
 * @returns
 */
export const ToggleButtonStoreAB = (props: ToggleButtonStoreABProps) => {
	//console.log(JSON.stringify(props.currentState, replacer));
	//console.log(JSON.stringify(props.toSetState, replacer));
	//console.log("---")
	const dispatch = useAppDispatch();
	return (
		<button className={JSON.stringify(props.currentState, replacer) === JSON.stringify(props.toSetState, replacer) ? "Active" : "Inactive"}
			onClick={() => {
				//console.log("click");
				dispatch(set(props.toSetState.statBuild, props.toSetState.champ));
			}}
		>
			{props.label}
		</button>

	);
}

function replacer(key: any, value: any) {

	if (value instanceof Map) {
		if (key === "statNetMap") {
			return {
				dataType: 'Map',
				value: Array.from(Array.from((value as Map<Stat, StatNet>)).map(a => a !== undefined ? a[1].totalStat : "?")).join(),
			};
		} else {
			return {
				dataType: 'Map',
				value: Array.from(value.entries()).join(),
			};
		}
		
	} else if (value instanceof Champion) {
		return {
			dataType: 'Champion',
			value: value.championName,
		}
	} else if (value instanceof Array) {
		if (value[0] instanceof DamageInstance) {
			return {
				dataType: 'Array',
				value: '',
			}
		} else if (key === "items") {
			//console.log("test" + Array.from((value as { item: Item | undefined }[]).map(a => (a?.item as typeof Item)?.itemName)).join());
			return {

				dataType: 'Array',
				value: Array.from((value as { item: Item | undefined }[]).map(a => a !== undefined ? (a?.item as typeof Item)?.itemName : "?")).join(),
			}
		}
	}  else
{
		return value;
	}
}

