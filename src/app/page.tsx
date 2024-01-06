import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import { Webrtc } from '@/components/pages/home/client';
import { cookies } from 'next/headers';
import { Fragment } from 'react';

export default function Home() {
	const defaultLayout = getDefaultLayout();

	return (
		<Fragment>
			<Header />
			<main>
				<section>
					<div className='max-w-maxi mx-auto px-[4%] min-h-hvh'>
						<h3 className='scroll-m-20 pt-6 md:pt-8 pb-3 mb-5 text-2xl font-semibold tracking-tight border-b'>Media Settings</h3>
						<Webrtc defaultLayout={defaultLayout} />
					</div>
				</section>
				<section>
					<div className='max-w-maxi mx-auto px-[4%]'>
						<div className='py-3'>
							<h3 className='scroll-m-20 py-3 text-2xl font-semibold tracking-tight'>About</h3>
							<p className='text-sm text-muted-foreground mt-1 pb-4'>
								A web app that showcases the use of webRTC in next.js and cache the media-devices using local storage
							</p>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</Fragment>
	);
}

function getDefaultLayout() {
	const layout = cookies().get('react-resizable-panels:layout');
	if (layout) {
		return JSON.parse(layout.value);
	}
	return [40, 60];
}
