//derived from:
//  https://react-redux.js.org/tutorials/typescript-quick-start


import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface calculatorAttributesState {
	allyLevel: number,
	burstSequence: string,
	dpsPriority: string,
	enemyLevel:number,
}

const initialState = {
	allyLevel: 18,
	burstSequence: "eqwar",
	dpsPriority: "eqwra",
	enemyLevel:18,
} as calculatorAttributesState

export const calculatorAttributesSlice = createSlice({
	name: 'calculatorAttributes',
	initialState,
	reducers: {
		setCalcAttr: {
			// Redux Toolkit allows us to write "mutating" logic in reducers. It
			// doesn't actually mutate the state because it uses the Immer library,
			// which detects changes to a "draft state" and produces a brand new
			// immutable state based off those changes.
			// Also, no return statement is required from these functions.

			reducer: (state, action: PayloadAction<calculatorAttributesState>) => {
				state.allyLevel = action.payload.allyLevel;
				state.burstSequence = action.payload.burstSequence;
				state.dpsPriority = action.payload.dpsPriority;
				state.enemyLevel = action.payload.enemyLevel;
			},

			//prepare allows for us to have multiple arguments in a dispatch; this formats action
			prepare: (allyLevel: number, burstSequence:string, dpsPriority:string, enemyLevel:number) => {
				return {
					payload: { allyLevel, burstSequence, dpsPriority, enemyLevel }
				};
			}
		},
	},
})

// Action creators are generated for each case reducer function
export const { setCalcAttr } = calculatorAttributesSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectCalculatorAttributes = (state: RootState) => state.calculatorAttributes

export default calculatorAttributesSlice.reducer