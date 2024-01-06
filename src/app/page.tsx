import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import About from '@/components/pages/home';
import { Webrtc } from '@/components/pages/home/client';
import { Fragment } from 'react';

export default function Home() {
	return (
		<Fragment>
			<Header />
			<main>
				<section>
					<div className='max-w-maxi mx-auto min-h-hvh'>
						<h3 className='scroll-m-20 pt-8 pb-3 mb-5 text-2xl font-semibold tracking-tight border-b'>Media Settings</h3>
						<Webrtc />
					</div>
				</section>
				<About />
			</main>
			<Footer />
		</Fragment>
	);
}
