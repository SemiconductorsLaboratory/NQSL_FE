'use client';

import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useLogoutMutation } from '@/redux/features/authApiSlice';
import { logout as setLogout } from '@/redux/features/authSlice';
import { NavLink } from '@/components/common';
import "../../styles/Navbar.css"
import {className} from "postcss-selector-parser";

export default function Navbar() {
	const pathname = usePathname();
	const dispatch = useAppDispatch();

	const [logout] = useLogoutMutation();

	const { isAuthenticated } = useAppSelector(state => state.auth);

	const handleLogout = () => {
		logout(undefined)
			.unwrap()
			.then(() => {
				dispatch(setLogout());
			});
	};

	const isSelected = (path: string) => (pathname === path ? true : false);

	const authLinks = (isMobile: boolean) => (
		<>
			<NavLink
				isSelected={isSelected('/dashboard')}
				isMobile={isMobile}
				href='/dashboard'
			>
				Dashboard
			</NavLink>
			<NavLink
				isSelected={isSelected('/samples')}
				isMobile={isMobile}
				href='/samples'
			>
				Samples
			</NavLink>
			<NavLink isMobile={isMobile} onClick={handleLogout}>
				Logout
			</NavLink>
		</>
	);

	const guestLinks = (isMobile: boolean) => (
		<>
			<NavLink
				isSelected={isSelected('/auth/login')}
				isMobile={isMobile}
				href='/auth/login'
			>
				Login
			</NavLink>
		</>
	);

	return (
		<Disclosure as='nav' className='container-navbar'>
			{({ open }) => (
				<>
					<div className=''>
						<div className=''>
							<div className='test'>
								<div className='testt'>
									<NavLink href='/' isBanner>
										NQSL
									</NavLink>
								</div>
								<div className=''>
									<div className=''>
										{isAuthenticated
											? authLinks(false)
											: guestLinks(false)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</Disclosure>
	);
}
