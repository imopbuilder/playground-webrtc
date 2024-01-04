import { SelectedMediaDevice } from '@/lib/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface MediaDeviceState {
	devices: MediaDeviceInfo[];
	selectedDevices: SelectedMediaDevice;
}

const initialState: MediaDeviceState = {
	devices: [],
	selectedDevices: {
		audioinput: null,
		audiooutput: null,
		videoinput: null,
	},
};

const slice = createSlice({
	name: 'media-device',
	initialState,
	reducers: {
		setdevices: (state, action: PayloadAction<MediaDeviceState['devices']>) => {
			state.devices = action.payload;
		},
		setselecteddevices: (state, action: PayloadAction<Partial<MediaDeviceState['selectedDevices']>>) => {
			state.selectedDevices = { ...state.selectedDevices, ...action.payload };
		},
	},
});

export const { setdevices, setselecteddevices } = slice.actions;
export default slice.reducer;
