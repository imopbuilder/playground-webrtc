'use client';

import { useMediaDeviceInfo } from '@/client/hooks/use-media-device-info.hook';
import { useAppSelector } from '@/client/store';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils/cn';

export function Webrtc() {
	const { stream, videoRef } = useMediaDeviceInfo();
	const { streamLoading } = useAppSelector((state) => state.mediaDeviceSlice);

	return (
		<div className='flex items-start justify-center gap-5'>
			<MediaDevices />
			<div className='w-full'>
				{streamLoading ? <p>Loading...</p> : null}
				<video ref={videoRef} className='w-full h-[calc(100vh_-_58px)] rounded-xl' id='localVideo' autoPlay playsInline controls={false}>
					<track kind='captions' />
				</video>
			</div>
		</div>
	);
}

function MediaDevices() {
	return (
		<div className='w-full'>
			<Accordion type='multiple'>
				{/* Audio input accordion 🎙️ */}
				<Devices title='Microphone' kind='audioinput' />

				{/* Video accordion 🎥 */}
				<Devices title='Camera' kind='videoinput' />

				{/* Audio output accordion 🔉 */}
				<Devices title='Speaker' kind='audiooutput' />
			</Accordion>
		</div>
	);
}

function Devices({ title, kind }: { title: string; kind: MediaDeviceKind }) {
	const { devices, selectedDevices, streamLoading } = useAppSelector((state) => state.mediaDeviceSlice);

	function SelectedDeviceLabel(props: { kind: MediaDeviceKind }) {
		if (streamLoading) return <Skeleton className='h-3 mt-1 w-48 rounded-sm' />;

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
				<RadioGroup value={selectedDevices[kind] ?? undefined} onValueChange={(val) => console.log(val)}>
					{devices
						.filter((device) => device.kind === kind)
						.map((device, index) => {
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
