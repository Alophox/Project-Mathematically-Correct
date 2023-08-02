import { configureStore } from '@reduxjs/toolkit'
import advancedBuildSlice from './features/advancedBuildSlice'
import  calculatorAttributesSlice from './features/calculatorAttributes'
import  ttHoverSlice  from './features/ttHoverSlice'

export const store = configureStore({
	reducer: {
		advancedBuild: advancedBuildSlice,
		ttHover: ttHoverSlice,
		calculatorAttributes: calculatorAttributesSlice,
	},
	/**
	 * turns off errors for stuffing non-serializable objects like champions and items into the store;
	 * if problems occur with the store disable this entire block to see the error messages that are getting blocked
	 * @param getDefaultMiddleware
	 * @returns
	 */
	middleware: (getDefaultMiddleware) => getDefaultMiddleware({
		serializableCheck: {
			// Ignore these action types
			//ignoredActions: ['your/action/type'],
			// Ignore these field paths in all actions
			//ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
			// Ignore these paths in the state
			//ignoredPaths: ['items.dates'],

			ignoredActionPaths:['payload','payload.hovered', 'payload.extra'],

			ignoredPaths: ['advancedBuild.statBuild', 'advancedBuild.champ', 'ttHover.hovered', 'ttHover.extra'],
		},
	}),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch