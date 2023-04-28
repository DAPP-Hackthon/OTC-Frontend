import {
	FLUSH,
	PAUSE,
	PERSIST,
	persistReducer,
	PURGE,
	REGISTER,
	REHYDRATE,
} from "redux-persist";

const store = configureStore({
	devTools: true,
	reducer: persisted,
	middleware: (gDM) =>
		gDM({
			serializableCheck: {
				
				ignoreActions: [
					FLUSH,
					REHYDRATE,
					PAUSE,
					PERSIST,
					PURGE,
					REGISTER,
				],
			},
		}).concat(api.middleware),
});
export default store;