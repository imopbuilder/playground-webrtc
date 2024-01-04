import Footer from '@/components/global/footer';
import Header from '@/components/global/header';
import About from '@/components/pages';
import { Fragment } from 'react';

export default function Home() {
	return (
		<Fragment>
			<Header />
			<main>
				<section>
					<div className='max-w-maxi mx-auto min-h-hvh'>
						<p>Hello world</p>
					</div>
				</section>
				<About />
			</main>
			<Footer />
		</Fragment>
	);
}
