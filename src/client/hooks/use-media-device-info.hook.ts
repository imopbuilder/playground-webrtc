'use client';

import { SelectedMediaDevice } from '@/lib/types';
import { ElementRef, useEffect, useRef } from 'react';
import { dispatch } from '../store';
import { setdevices, setselecteddevices, setstreamloading } from '../store/slices/media-device-slice';

export function useMediaDeviceInfo() {
	const stream = useRef<MediaStream>();
	const videoRef = useRef<ElementRef<'video'>>(null);

	// get the list of media devices
	useEffect(() => {
		// used to check the support of enumerateDevices in the mediaDevices
		if (!navigator.mediaDevices?.enumerateDevices) {
			console.log('enumerateDevices is not supported in your device');
			return;
		}

		async function getDeviceList() {
			const mediaDevices = await navigator.mediaDevices.enumerateDevices();
			dispatch(setdevices(mediaDevices.map(({ deviceId, groupId, kind, label }) => ({ deviceId, groupId, kind, label }))));
		}
		getDeviceList();
	}, []);

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
