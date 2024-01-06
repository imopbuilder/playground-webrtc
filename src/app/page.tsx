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
						<Webrtc />
					</div>
				</section>
				<About />
			</main>
			<Footer />
		</Fragment>
	);
}
