import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'NQSL | Home',
	description: 'Full Auth home page',
};

export default function Page() {
	return (
		<main className='bg-white'>
			<div className='relative isolate px-6 pt-14 lg:px-8'>
				<div className='mx-auto max-w-2xl py-32 sm:py-48 lg:py-56'>
					<div className='text-center'>
						<h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl'>
							Nano Quantum Semiconductor Laboratory
						</h1>
						<p className='mt-6 text-lg leading-8 text-gray-600'>
							Description of the Lab
						</p>
					</div>
				</div>
			</div>
		</main>
	);
}
