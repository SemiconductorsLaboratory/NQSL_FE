'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useActivationMutation } from '@/redux/features/authApiSlice';
import { toast } from 'react-toastify';

interface Props {
	params: {
		uid: string;
		token: string;
	};
}

export default function Page({ params }: Props) {
	const router = useRouter();
	const [activation] = useActivationMutation();

	const activateAccount = useCallback(async (uid: string, token: string) => {
		try {
			await activation({ uid, token }).unwrap();
			toast.success('Account activated');
		} catch {
			toast.error('Failed to activate account');
		} finally {
			router.push('/auth/login');
		}
	}, [activation, router]);

	useEffect(() => {
		const { uid, token } = params;
		activateAccount(uid, token);
	}, [params, activateAccount]);

	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<h1 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Activating your account...
				</h1>
			</div>
		</div>
	);
}