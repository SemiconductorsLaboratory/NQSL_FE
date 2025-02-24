"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { setAuth } from '@/redux/features/authSlice';
import { toast } from 'react-toastify'; // Assurez-vous que react-toastify est installé

export default function useLogin() {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [login, { isLoading }] = useLoginMutation();

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});

	const { email, password } = formData;

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setFormData({ ...formData, [name]: value });
	};

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		login({ email, password })
			.unwrap()
			.then(() => {
				dispatch(setAuth());
				router.push('/dashboard');
			})
			.catch((error) => { // Gérer l'erreur ici
				console.error("Login failed:", error); // Affiche l'erreur dans la console (important pour le débogage)
				toast.error("Login Failed"); // Affiche un toast d'erreur
			});
	};

	return {
		email,
		password,
		isLoading,
		onChange,
		onSubmit,
	};
}