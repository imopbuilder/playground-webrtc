import Link from 'next/link';
import { ThemeToggle } from '../theme-toggle';

export default function Header() {
	return (
		<header className='border-b'>
			<div className='max-w-maxi mx-auto px-[4%] h-16 flex items-center justify-between'>
				<div className='flex items-center justify-center'>
					<Link href={'/'} className='font-semibold'>
						Playground webRTC
					</Link>
				</div>
				<nav className='flex items-center justify-center sm:gap-5 gap-3'>
					<ThemeToggle />
				</nav>
			</div>
		</header>
	);
}
