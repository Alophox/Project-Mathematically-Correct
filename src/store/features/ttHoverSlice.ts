//derived from:
//  https://react-redux.js.org/tutorials/typescript-quick-start


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StatBuild } from '../../builds/StatBuild'
import { Champion } from '../../champions/Champion'
import { Item } from '../../items/Item'
import { Stat } from '../../Stat'
import { RootState } from '../store'


/**
 * This enum USED TO be in ToolTip.tsx, however it created a circular dependency, so it has been moved to ttHoverSlice.ts to resolve that error
 */
export enum ToolTipPosition {
	Left = "TTLeft",
	Right = "TTRight",
	Top = "TTTop",
	Bot = "TTBot",
}
/**
 * This enum USED TO be in ToolTip.tsx, however it created a circular dependency, so it has been moved to ttHoverSlice.ts to resolve that error
 */
export enum ToolTipType {
	None = "None",
	Normal = "Normal",
	Item = "Item",
	Champ = "Champ",
	Stat = "Stat",
}


interface ttHoverState {
	type: ToolTipType,
	hovered: (Item | undefined) | Champion | Stat | (string | JSX.Element),
	position: ToolTipPosition,
	extra?: StatBuild,
}

const initialState = {
	type: ToolTipType.None,
	hovered: Item,
	position: ToolTipPosition.Right,
} as ttHoverState

export const ttHoverSlice = createSlice({
	name: 'ttHover',
	initialState,
	reducers: {
		setHover: {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes.
			// Also, no return statement is required from these functions.

			reducer: (state, action: PayloadAction<ttHoverState>) => {
				state.type = action.payload.type;
				state.hovered = action.payload.hovered;
				state.position = action.payload.position;
				state.extra = action.payload.extra;
			},
			
			//prepare allows for us to have multiple arguments in a dispatch; this formats action
			prepare: (type: ToolTipType, hovered: (Item | undefined) | Champion | Stat, position: ToolTipPosition, extra?: StatBuild) => {
				return {
					payload: {type,	hovered, position, extra}
				};
			}

		},
	},
})

// Action creators are generated for each case reducer function
export const { setHover } = ttHoverSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTTHover = (state: RootState) => state.ttHover

export default ttHoverSlice.reducer