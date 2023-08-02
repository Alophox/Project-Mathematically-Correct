//derived from:
//  https://react-redux.js.org/tutorials/typescript-quick-start


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { StatBuild } from '../../builds/StatBuild'
import { Champion } from '../../champions/Champion'
import { TargetDummy } from '../../champions/champion-objects'
import { RootState } from '../store'

interface advancedBuildState {
	statBuild: StatBuild,
	champ: Champion,
} 

const initialState  = {
	statBuild: new StatBuild(new TargetDummy(), [{ item: undefined }]),
	champ: new TargetDummy(),
} as advancedBuildState

export const advancedBuildSlice = createSlice({
	name: 'advancedBuild',
	initialState,
	reducers: {
		set: {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes.
			// Also, no return statement is required from these functions.

			reducer: (state, action: PayloadAction<advancedBuildState>) => {
				state.statBuild = action.payload.statBuild;
				state.champ = action.payload.champ;
			},

			//prepare allows for us to have multiple arguments in a dispatch; this formats action
			prepare: (statBuild: StatBuild, champ: Champion) => {
				return {
					payload: { statBuild, champ}
				};
			}
		},
	},
})

// Action creators are generated for each case reducer function
export const { set } = advancedBuildSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectAdvancedBuild = (state: RootState) => state.advancedBuild.statBuild

export default advancedBuildSlice.reducer