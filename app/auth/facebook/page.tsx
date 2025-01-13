'use client';

import { useSocialAuthenticateMutation } from '@/redux/features/authApiSlice';
import { useSocialAuth } from '@/hooks';
import { Spinner } from '@/components/common';
import { Suspense } from 'react';

export default function Page() {
	const [facebookAuthenticate] = useSocialAuthenticateMutation();

	return (
		<div className='my-8'>
			<Suspense fallback={<Spinner lg />}>
				<AuthComponent facebookAuthenticate={facebookAuthenticate} />
			</Suspense>
		</div>
	);
}

function AuthComponent({ facebookAuthenticate }: { facebookAuthenticate: any }) {
	useSocialAuth(facebookAuthenticate, 'facebook');
	return <></>;
}