import { SelectedMediaDevice } from '@/lib/types';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface MediaDeviceState {
	devices: Pick<MediaDeviceInfo, 'deviceId' | 'groupId' | 'kind' | 'label'>[];
	selectedDevices: SelectedMediaDevice;
	streamLoading: boolean;
	audioContextLoading: boolean
}

const initialState: MediaDeviceState = {
	devices: [],
	selectedDevices: {
		audioinput: null,
		audiooutput: null,
		videoinput: null,
	},
	streamLoading: true,
	audioContextLoading: true
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
		setaudiocontextloading: (state, action: PayloadAction<MediaDeviceState['audioContextLoading']>) => {
			state.audioContextLoading = action.payload;
		},
	},
});

export const { setdevices, setselecteddevices, setstreamloading, setaudiocontextloading } = slice.actions;
export default slice.reducer;
