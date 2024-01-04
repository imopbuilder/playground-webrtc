import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='border-t border-dashed'>
			<div className='max-w-maxi mx-auto py-3'>
				<div>
					<p className='text-center text-muted-foreground text-sm'>
						Crafted by{' '}
						<Button className='p-0 text-muted-foreground font-medium hover:text-foreground' variant='link' asChild>
							<Link href={'/'} target='_black' rel='noreferrer'>
								rahu1gg
							</Link>
						</Button>
					</p>
				</div>
			</div>
		</footer>
	);
}
