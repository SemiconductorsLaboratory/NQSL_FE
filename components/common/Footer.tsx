const version = process.env.NEXT_PUBLIC_APP_VERSION;

export default function Footer() {
	return (
		<footer className='bg-gray-100 h-16'>
			<div className='h-full px-2'>
				<div className='flex items-center justify-center h-full'>
					<p className='text-gray-400 text-xs'>
						&copy; Nadal Corporation
					</p>
				</div>
			</div>
		</footer>
	);
}
