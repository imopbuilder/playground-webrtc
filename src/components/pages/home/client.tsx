'use client';

import { useMediaDeviceInfo } from '@/client/hooks/use-media-device-info.hook';
import { dispatch, useAppSelector } from '@/client/store';
import {
	MediaDeviceState,
	setaudiocontextloading,
	setselecteddevices,
	setstreamloading,
	setvideoloading,
} from '@/client/store/slices/media-device-slice';
import { CubeLoader } from '@/components/global/loader/cube';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';
import { Fragment, RefObject } from 'react';

type VideoRef = RefObject<HTMLVideoElement>;

export function Webrtc() {
	const { videoRef } = useMediaDeviceInfo();

	return (
		<div className='flex items-start justify-center gap-5'>
			<MediaDevices videoRef={videoRef} />
			<Video videoRef={videoRef} />
		</div>
	);
}

function MediaDevices({ videoRef }: { videoRef: VideoRef }) {
	return (
		<div className='w-full'>
			<Accordion type='multiple'>
				<AudioInputDevices />
				<VideoInputDevices />
				<AudioOutputDevices videoRef={videoRef} />
			</Accordion>
		</div>
	);
}

function Video({ videoRef }: { videoRef: VideoRef }) {
	const { videoLoading } = useAppSelector((state) => state.mediaDeviceSlice);

	function Loader() {
		if (videoLoading)
			return (
				<div className='w-full aspect-[1.33] bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-lg flex items-center justify-center'>
					<CubeLoader />
				</div>
			);

		return null;
	}

	return (
		<div className={'w-full'}>
			<Loader />
			<video
				ref={videoRef}
				className={cn('w-full rounded-lg', videoLoading ? 'h-0' : 'h-auto')}
				id='localVideo'
				autoPlay
				playsInline
				controls={false}
				onLoadedData={() => dispatch(setvideoloading(false))}
			>
				<track kind='captions' />
			</video>
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

function AudioInputDevices() {
	const { devices, streamLoading } = useAppSelector((state) => state.mediaDeviceSlice);
	const audioInputDevices = devices.filter((device) => device.kind === 'audioinput');

	async function handleValueChange(val: string) {
		dispatch(setstreamloading(true));
		dispatch(setselecteddevices({ audioinput: val }));
		dispatch(setvideoloading(true));
	}

	return (
		<Fragment>
			{/* Audio input accordion 🎙️ */}
			<Devices title='Microphone' kind='audioinput' loading={streamLoading} devices={audioInputDevices} onValueChange={handleValueChange} />
		</Fragment>
	);
}

function VideoInputDevices() {
	const { devices, streamLoading } = useAppSelector((state) => state.mediaDeviceSlice);
	const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');

	async function handleValueChange(val: string) {
		dispatch(setstreamloading(true));
		dispatch(setselecteddevices({ videoinput: val }));
		dispatch(setvideoloading(true));
	}

	return (
		<Fragment>
			{/* Video input accordion 🎥 */}
			<Devices title='Camera' kind='videoinput' loading={streamLoading} devices={videoInputDevices} onValueChange={handleValueChange} />
		</Fragment>
	);
}

function AudioOutputDevices({ videoRef }: { videoRef: VideoRef }) {
	const { devices, audioContextLoading } = useAppSelector((state) => state.mediaDeviceSlice);
	const audioOutputDevices = devices
		.filter((device) => device.kind === 'audiooutput')
		.map((device) => ({ ...device, deviceId: device.deviceId === 'default' ? '' : device.deviceId }));

	function handleValueChange(val: string) {
		dispatch(setaudiocontextloading(true));
		videoRef.current?.setSinkId?.(val);
		dispatch(setselecteddevices({ audiooutput: val }));
		dispatch(setaudiocontextloading(false));
		localStorage.setItem('audiooutput', val);
	}

	return (
		<Fragment>
			{/* Audio output accordion 🔉 */}
			<Devices title='Speaker' kind='audiooutput' loading={audioContextLoading} devices={audioOutputDevices} onValueChange={handleValueChange} />
		</Fragment>
	);
}
