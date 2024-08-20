'use client';

import { usePathname } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useLogoutMutation } from '@/redux/features/authApiSlice';
import { logout as setLogout } from '@/redux/features/authSlice';
import { NavLink } from '@/components/common';
import "../../styles/Navbar.css"
import Image from "next/image";
import React from "react";

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

	const isSelected = (path: string) => (pathname === path);

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
					<Image
						src="/polytechnique_gauche_rgb.png"
						width={150}
						height={150}
						alt="polytechnique"
					/>
					<div className='navbar'>
						<div className='nav-links-left'>
							<NavLink href='/' isBanner>
								Home
							</NavLink>
							{isAuthenticated ? authLinks(false) : guestLinks(false)}
						</div>
						<div className='nav-links-right'>
							{isAuthenticated && (
								<NavLink onClick={handleLogout}>
									<p>Logout</p>
								</NavLink>
							)}
						</div>
					</div>
				</>
			)}
		</Disclosure>
	);
}