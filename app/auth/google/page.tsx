'use client';

import { useSocialAuthenticateMutation } from '@/redux/features/authApiSlice';
import { useSocialAuth } from '@/hooks';
import { Spinner } from '@/components/common';
import { Suspense } from 'react';

export default function Page() {
	const [googleAuthenticate] = useSocialAuthenticateMutation();

	return (
		<div className='my-8'>
			<Suspense fallback={<Spinner lg />}>
				<AuthComponent googleAuthenticate={googleAuthenticate} />
			</Suspense>
		</div>
	);
}

function AuthComponent({ googleAuthenticate }: { googleAuthenticate: any }) {
	useSocialAuth(googleAuthenticate, 'google-oauth2');
	return <></>; // Le composant peut être vide, useSocialAuth gère le reste
}