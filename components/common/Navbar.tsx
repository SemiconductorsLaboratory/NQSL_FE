'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Disclosure } from '@headlessui/react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { useLogoutMutation } from '@/redux/features/authApiSlice';
import { logout as setLogout } from '@/redux/features/authSlice';
import { NavLink } from '@/components/common';
import "../../styles/Navbar.css"
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react"; // Importer useEffect
import { useFetchSampleModelByNameQuery } from '@/redux/features/sampleApiSlice'; // Importez le hook de requête
import { useParams } from 'next/navigation';


export default function Navbar() {
	const pathname = usePathname();
	const dispatch = useAppDispatch();
	const [logout] = useLogoutMutation();
	const { isAuthenticated } = useAppSelector(state => state.auth);
	const router = useRouter();

	const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const tooltipRef = useRef<HTMLButtonElement>(null); // Ref pour le button du tooltip

	// Récupérez le nom de l'utilisateur du pathname (assurez-vous que votre route est configurée pour cela)
	// « Vous devrez peut-être adapter cette partie en fonction de la façon dont vous passez le nom d'utilisateur.
	// Si le nom n'est pas dans l'URL, vous devrez sûrement utiliser un autre mécanisme (contexte, état global, etc.).
	const { name } = useParams() as { name?: string };
	const { data, isLoading } = useFetchSampleModelByNameQuery(name, {
		skip: !name,
	});


	// Function pour masque le tooltip (utilise à plusieurs endroits)
	const hideTooltip = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setShowLogoutTooltip(false);
	};

	const handleMouseEnter = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		setShowLogoutTooltip(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = setTimeout(hideTooltip, 200);
	};

	const handleLogout = () => {

		logout(undefined)
			.unwrap()
			.then(() => {
				dispatch(setLogout());
				hideTooltip(); // Masquer le tooltip avant de rediriger
				router.push('/auth/login');
			})
			.catch((error) => {
				console.error("Logout failed:", error);

			});
	};


	// Effet pour masquer le tooltip lorsque l'utilisateur n'est pas authentifié
	useEffect(() => {
		if (!isAuthenticated) {
			hideTooltip();
		}
	}, [isAuthenticated]);

	//Effet pour gerer le click en dehors
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
				hideTooltip()
			}
		};

		document.addEventListener('mousedown', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

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
			{() => (
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
								<div
									className="relative inline-block"
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
								>
									{/* Affiche le nom de l'utilisateur si les données sont chargées, sinon affiche un placeholder ou rien */}
									{isLoading ? (
										<div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center">
											{/* Indicateur de chargement (vous pouvez utiliser un spinner ici) */}
											...
										</div>
									) : data && data.user ? ( // Vérification clé : userData ET userData.user
										<div className="rounded-full w-fit h-10 bg-gray-300 flex items-center justify-center px-3" style={{ zIndex: 1 }}>
											<p className="user">{data.user}</p>
										</div>
									) : (
										<div className="rounded-full w-10 h-10 bg-gray-300 flex items-center justify-center">
											{/* Placeholder si aucune donnée n'est disponible (utilisateur non trouvé, etc.) */}
										</div>
									)}


									{/* Tooltip (cliquable) */}
									{showLogoutTooltip && (
										<button
											ref={tooltipRef} // Attribuer la ref au bouton
											onClick={handleLogout}
											className="absolute z-10 top-full left-1/2 -translate-x-1/2 mt-2  bg-gray-800 text-white text-sm rounded-md px-2 py-1  whitespace-nowrap cursor-pointer"

										>
											Logout
										</button>
									)}
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</Disclosure>
	);
}