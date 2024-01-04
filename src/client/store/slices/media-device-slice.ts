import { SelectedMediaDevice } from '@/lib/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface MediaDeviceState {
	devices: Pick<MediaDeviceInfo, 'deviceId' | 'groupId' | 'kind' | 'label'>[];
	selectedDevices: SelectedMediaDevice;
	streamLoading: boolean;
}

const initialState: MediaDeviceState = {
	devices: [],
	selectedDevices: {
		audioinput: null,
		audiooutput: null,
		videoinput: null,
	},
	streamLoading: true,
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
		setstreamloading: (state, action: PayloadAction<MediaDeviceState['streamLoading']>) => {
			state.streamLoading = action.payload;
		},
	},
});

export const { setdevices, setselecteddevices, setstreamloading } = slice.actions;
export default slice.reducer;
