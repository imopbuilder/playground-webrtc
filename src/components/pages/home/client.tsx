'use client';

import { useMediaDeviceInfo } from '@/client/hooks/use-media-device-info.hook';
import { dispatch, useAppSelector } from '@/client/store';
import { MediaDeviceState, setaudiocontextloading, setselecteddevices, setstreamloading } from '@/client/store/slices/media-device-slice';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { SelectedMediaDevice } from '@/lib/types';
import { cn } from '@/lib/utils/cn';
import { Fragment, MutableRefObject, RefObject, useEffect } from 'react';

export function Webrtc() {
	const { stream, videoRef } = useMediaDeviceInfo();
	const { streamLoading } = useAppSelector((state) => state.mediaDeviceSlice);

	return (
		<div className='flex items-start justify-center gap-5'>
			<MediaDevices stream={stream} videoRef={videoRef} />
			<div className='w-full'>
				{streamLoading ? <p>Loading...</p> : null}
				<video ref={videoRef} className='w-full h-[calc(100vh_-_58px)] rounded-xl' id='localVideo' autoPlay playsInline controls={false}>
					<track kind='captions' />
				</video>
			</div>
		</div>
	);
}

type Stream = MutableRefObject<MediaStream | undefined>;
type VideoRef = RefObject<HTMLVideoElement>;

function MediaDevices({ stream, videoRef }: { stream: Stream; videoRef: VideoRef }) {
	return (
		<div className='w-full'>
			<Accordion type='multiple'>
				<AudioInputDevices stream={stream} videoRef={videoRef} />
				<VideoInputDevices stream={stream} videoRef={videoRef} />
				<AudioOutputDevices />
			</Accordion>
		</div>
	);
}

function Devices({
	devices,
	title,
	kind,
	loading,
	onValueChange,
}: { devices: MediaDeviceState['devices']; title: string; kind: MediaDeviceKind; loading: boolean; onValueChange: (value: string) => void }) {
	const { selectedDevices } = useAppSelector((state) => state.mediaDeviceSlice);

	function SelectedDeviceLabel(props: { kind: MediaDeviceKind }) {
		if (loading) return <Skeleton className='h-3 mt-1 w-48 rounded-sm' />;

		const deviceLabel = devices.find((device) => device.deviceId === selectedDevices[props.kind])?.label;
		if (deviceLabel) return <span className='text-xs text-muted-foreground font-medium pl-0.5'>{deviceLabel}</span>;
		return <span className='text-xs text-muted-foreground font-medium pl-0.5'>- No device found -</span>;
	}

	return (
		<AccordionItem value={kind} className='mb-5 last:mb-0 border-none'>
			<AccordionTrigger className='bg-muted px-4 py-3 rounded-lg font-semibold hover:no-underline hover:bg-muted/80'>
				<span className='flex items-start justify-center flex-col gap-1'>
					<span>{title}</span>
					<SelectedDeviceLabel kind={kind} />
				</span>
			</AccordionTrigger>
			<AccordionContent className='pt-4 px-4 border-b'>
				<RadioGroup value={selectedDevices[kind] ?? undefined} onValueChange={onValueChange}>
					{devices.map((device, index) => {
						return (
							<div
								key={device.deviceId}
								className={cn(
									'flex items-center gap-2 py-1 text-sm',
									selectedDevices[kind] === device.deviceId ? 'text-foreground' : 'text-muted-foreground',
								)}
							>
								<RadioGroupItem value={device.deviceId} id={`r${index}`} />
								<Label htmlFor={`r${index}`}>{device.label}</Label>
							</div>
						);
					})}
				</RadioGroup>
			</AccordionContent>
		</AccordionItem>
	);
}

function AudioInputDevices({ stream, videoRef }: { stream: Stream; videoRef: VideoRef }) {
	const { devices, selectedDevices, streamLoading } = useAppSelector((state) => state.mediaDeviceSlice);
	const audioInputDevices = devices.filter((device) => device.kind === 'audioinput');

	async function handleValueChange(val: string) {
		dispatch(setstreamloading(true));

		// Stop both the audio and video track
		if (stream.current) {
			const tracks = stream.current.getTracks();
			for (const track of tracks) {
				track.stop();
			}
		}

		// Create a new stream from the deviceId
		stream.current = await navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: selectedDevices.videoinput ?? undefined,
			},
			audio: {
				deviceId: val,
			},
		});

		if (videoRef.current) {
			videoRef.current.srcObject = stream.current;
			dispatch(setstreamloading(false));
		}

		// Update the stream settings in redux and in localStorage
		const tracks = stream.current.getTracks();
		for (const track of tracks) {
			const trackSettings = track.getSettings();
			const { deviceId } = trackSettings;
			const kind = `${track.kind}input` as keyof SelectedMediaDevice;
			const localDeviceId = localStorage.getItem(kind);

			dispatch(setselecteddevices({ [kind]: deviceId }));

			if (deviceId && localDeviceId !== deviceId) {
				localStorage.setItem(kind, deviceId);
			}
		}
	}

	return (
		<Fragment>
			{/* Audio input accordion 🎙️ */}
			<Devices title='Microphone' kind='audioinput' loading={streamLoading} devices={audioInputDevices} onValueChange={handleValueChange} />
		</Fragment>
	);
}

function VideoInputDevices({ stream, videoRef }: { stream: Stream; videoRef: VideoRef }) {
	const { devices, selectedDevices, streamLoading } = useAppSelector((state) => state.mediaDeviceSlice);
	const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');

	async function handleValueChange(val: string) {
		dispatch(setstreamloading(true));

		// Stop both the audio and video track
		if (stream.current) {
			const tracks = stream.current.getTracks();
			for (const track of tracks) {
				track.stop();
			}
		}

		// Create a new stream from the deviceId
		stream.current = await navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: val,
			},
			audio: {
				deviceId: selectedDevices.videoinput ?? undefined,
			},
		});

		if (videoRef.current) {
			videoRef.current.srcObject = stream.current;
			dispatch(setstreamloading(false));
		}

		// Update the stream settings in redux and in localStorage
		const tracks = stream.current.getTracks();
		for (const track of tracks) {
			const trackSettings = track.getSettings();
			const { deviceId } = trackSettings;
			const kind = `${track.kind}input` as keyof SelectedMediaDevice;
			const localDeviceId = localStorage.getItem(kind);

			dispatch(setselecteddevices({ [kind]: deviceId }));

			if (deviceId && localDeviceId !== deviceId) {
				localStorage.setItem(kind, deviceId);
			}
		}
	}

	return (
		<Fragment>
			{/* Video accordion 🎥 */}
			<Devices title='Camera' kind='videoinput' loading={streamLoading} devices={videoInputDevices} onValueChange={handleValueChange} />
		</Fragment>
	);
}

function AudioOutputDevices() {
	const { devices, audioContextLoading } = useAppSelector((state) => state.mediaDeviceSlice);
	const audioOutputDevices = devices.filter((device) => device.kind === 'audiooutput' && device.deviceId !== 'default');

	function handleValueChange(val: string) {
		console.log(val);
	}

	// Set the sinkId using the AudioContext api from the audiooutput device
	useEffect(() => {
		if (!('setSinkId' in AudioContext.prototype)) {
			console.log('AudioContext.setSinkId is not supported in your device');
			return;
		}

		async function setAudioOutput() {
			if (devices.length !== 0) {
				dispatch(setaudiocontextloading(true));
				const localDeviceId = localStorage.getItem('audiooutput');
				const audioOutputs = devices.filter((device) => device.kind === 'audiooutput' && device.deviceId !== 'default');
				const audioContext = new AudioContext();

				// Pick the first available audio output.
				const deviceId = localDeviceId ?? audioOutputs[0].deviceId;
				//@ts-ignore
				await audioContext.setSinkId(deviceId);

				dispatch(setaudiocontextloading(false));
				dispatch(setselecteddevices({ audiooutput: deviceId }));

				if (deviceId !== localDeviceId) {
					localStorage.setItem('audiooutput', deviceId);
				}
			}
		}
		setAudioOutput();
	}, [devices]);

	return (
		<Fragment>
			{/* Audio output accordion 🔉 */}
			<Devices title='Speaker' kind='audiooutput' loading={audioContextLoading} devices={audioOutputDevices} onValueChange={handleValueChange} />
		</Fragment>
	);
}
