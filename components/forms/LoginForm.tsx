"use client"; //  <-- AJOUTÉ ICI : LoginForm est un Client Component

import useLogin from '@/hooks/use-login'; //  <-- CHEMIN D'IMPORTATION CORRECT

export default function LoginForm() {
	const { email, password, isLoading, onChange, onSubmit } = useLogin();

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			{/* ... (le reste de votre formulaire, inchangé) ... */}
			<div>
				<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
				<div className="mt-2">
					<input
						id="email"
						name="email"
						type="email"
						autoComplete="email"
						required
						value={email}
						onChange={onChange}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
				<div className="mt-2">
					<input
						id="password"
						name="password"
						type="password"
						autoComplete="current-password"
						required
						value={password}
						onChange={onChange}
						className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					disabled={isLoading}
					className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
				>
					{isLoading ? 'Signing in...' : 'Sign in'}
				</button>
			</div>

		</form>
	);
}