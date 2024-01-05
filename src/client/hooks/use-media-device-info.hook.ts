'use client';

import { SelectedMediaDevice } from '@/lib/types';
import { useEffect, useRef } from 'react';
import { dispatch } from '../store';
import { setaudiocontextloading, setdevices, setselecteddevices, setstreamloading } from '../store/slices/media-device-slice';

export function useMediaDeviceInfo() {
	const stream = useRef<MediaStream>();
	const videoRef = useRef<HTMLVideoElement>(null);

	// Get the list of media devices
	useEffect(() => {
		// used to check the support of enumerateDevices in the mediaDevices
		if (!navigator.mediaDevices?.enumerateDevices) {
			console.log('enumerateDevices is not supported in your device');
			return;
		}

		async function getDeviceList() {
			const mediaDevices = await navigator.mediaDevices.enumerateDevices();
			dispatch(setdevices(mediaDevices.map(({ deviceId, groupId, kind, label }) => ({ deviceId, groupId, kind, label }))));

			// Set the sinkId using the AudioContext api from the audiooutput device
			if (!('setSinkId' in AudioContext.prototype)) {
				console.log('AudioContext.setSinkId is not supported in your device');
				return;
			}

			if (mediaDevices.length !== 0) {
				dispatch(setaudiocontextloading(true));
				const localDeviceId = localStorage.getItem('audiooutput');
				const audioOutputs = mediaDevices.filter((device) => device.kind === 'audiooutput' && device.deviceId !== 'default');

				// Pick the first available audio output.
				const deviceId = localDeviceId ?? audioOutputs[0].deviceId;

				if (videoRef.current) videoRef.current.setSinkId?.(deviceId);

				dispatch(setaudiocontextloading(false));
				dispatch(setselecteddevices({ audiooutput: deviceId }));

				if (deviceId !== localDeviceId) {
					localStorage.setItem('audiooutput', deviceId);
				}
			}
		}
		getDeviceList();
	}, []);

	// Get the stream from the media-devices
	useEffect(() => {
		async function getMediaFromUser() {
			stream.current = await navigator.mediaDevices.getUserMedia({
				video: {
					deviceId: localStorage.getItem('videoinput') ?? undefined,
				},
				audio: {
					deviceId: localStorage.getItem('audioinput') ?? undefined,
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream.current;
				dispatch(setstreamloading(false));
			}

			// update the constraints of the track with the state and inside localStorage of the user
			const tracks = stream.current.getTracks();
			for (const track of tracks) {
				const trackSettings = track.getSettings();
				// console.log('-----------');
				// console.log('Track: ', track);
				// console.log('Track Settings: ', trackSettings);
				// console.log('-----------');
				const { deviceId } = trackSettings;
				const kind = `${track.kind}input` as keyof SelectedMediaDevice;
				const localDeviceId = localStorage.getItem(kind);

				dispatch(setselecteddevices({ [kind]: deviceId }));

				if (deviceId && localDeviceId !== deviceId) {
					localStorage.setItem(kind, deviceId);
				}
			}
		}
		getMediaFromUser();

		return () => {
			if (stream.current) {
				const tracks = stream.current.getTracks();
				for (const track of tracks) {
					track.stop();
				}
			}
		};
	}, []);

	return { stream, videoRef };
}
