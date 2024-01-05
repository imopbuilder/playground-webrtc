declare interface HTMLVideoElement {
	setSinkId?: (sinkId: string) => Promise<void>;
	// setSinkId is undefined on FireFox by default
}
