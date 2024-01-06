'use client';

import { SelectedMediaDevice } from '@/lib/types';
import { useEffect, useRef } from 'react';
import { dispatch, useAppSelector } from '../store';
import { setaudiocontextloading, setdevices, setselecteddevices, setstreamloading } from '../store/slices/media-device-slice';

export function useMediaDeviceInfo() {
	const stream = useRef<MediaStream>();
	const videoRef = useRef<HTMLVideoElement>(null);
	const { devices, selectedDevices } = useAppSelector((state) => state.mediaDeviceSlice);

	async function getDeviceList() {
		// used to check the support of enumerateDevices in the mediaDevices
		if (!navigator.mediaDevices?.enumerateDevices) {
			console.log('enumerateDevices is not supported in your device');
			return;
		}

		const mediaDevices = await navigator.mediaDevices.enumerateDevices();
		dispatch(setdevices(mediaDevices.map(({ deviceId, groupId, kind, label }) => ({ deviceId, groupId, kind, label }))));
	}

	useEffect(() => {
		// Get the list of media devices
		getDeviceList();
	}, []);

	useEffect(() => {
		// Get the stream from the media-devices
		async function getMediaFromUser() {
			stream.current = await navigator.mediaDevices.getUserMedia({
				video: {
					deviceId: selectedDevices.videoinput ?? localStorage.getItem('videoinput') ?? undefined,
				},
				audio: {
					deviceId: selectedDevices.audioinput ?? localStorage.getItem('audioinput') ?? undefined,
				},
			});

			if (videoRef.current) {
				videoRef.current.srcObject = stream.current;
			}

			// update the constraints of the track with the state and inside localStorage of the user
			const tracks = stream.current.getTracks();
			for (const track of tracks) {
				const trackSettings = track.getSettings();
				const { deviceId } = trackSettings;
				const kind = `${track.kind}input` as keyof SelectedMediaDevice;
				const localDeviceId = localStorage.getItem(kind);

				dispatch(setselecteddevices({ [kind]: deviceId }));
				dispatch(setstreamloading(false));

				if (deviceId && localDeviceId !== deviceId) {
					localStorage.setItem(kind, deviceId);
				}
			}
		}
		getMediaFromUser().then(async () => {
			const mediaPermission = localStorage.getItem('media-permission');

			if (!mediaPermission) {
				localStorage.setItem('media-permission', 'true');
				getDeviceList();
			}
		});

		return () => {
			if (stream.current) {
				const tracks = stream.current.getTracks();
				for (const track of tracks) {
					track.stop();
				}
			}
		};
	}, [selectedDevices.audioinput, selectedDevices.videoinput]);

	useEffect(() => {
		// Audio output
		function getAudioOutput() {
			// Set the sinkId using the AudioContext api from the audiooutput device
			if (!('setSinkId' in AudioContext.prototype)) {
				console.log('AudioContext.setSinkId is not supported in your device');
			} else {
				if (devices.length !== 0) {
					const localDeviceId = localStorage.getItem('audiooutput');
					// Pick the first available audio output.
					const deviceId = localDeviceId ?? '';

					if (videoRef.current) videoRef.current.setSinkId?.(deviceId);

					dispatch(setaudiocontextloading(false));
					dispatch(setselecteddevices({ audiooutput: deviceId }));

					if (deviceId !== localDeviceId) {
						localStorage.setItem('audiooutput', deviceId);
					}
				}
			}
		}

		getAudioOutput();
	}, [devices]);

	return { stream, videoRef };
}
