"use client";  // Indique que ce composant doit être côté client

import React from 'react';
import "@/styles/Dashboard.css";
import { useMeetingListQuery, useUserMachineQuery } from '@/redux/features/sampleApiSlice';

const Dashboard: React.FC = () => {
	// @ts-ignore
	const { data: meetings, isLoading, error } = useMeetingListQuery();
	// @ts-ignore
	const { data: usersData, isLoading: isLoadingUsers, error: errorUsers } = useUserMachineQuery();

	if (isLoading || isLoadingUsers) {
		return <div>Chargement des réunions...</div>;
	}

	if (error || errorUsers) {
		return <div>Erreur lors du chargement des données.</div>;
	}

	// Fonction pour obtenir le nom complet d'un utilisateur à partir de son ID
	const getUserNameById = (userId: number) => {
		const user = usersData.find((user: any) => user.id === userId);
		return user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu';
	};

	return (
		<div className="Dashboard">
			{meetings && meetings.length > 0 ? (
				<ul>
					{meetings.map((meeting: any) => (
						<li key={meeting.id} className="meeting-card">
							<h3>{meeting.title}</h3>
							<p><strong>Description:</strong> {meeting.description}</p>
							<p><strong>Date:</strong> {new Date(meeting.date).toLocaleString()}</p>
							<p><strong>Lieu:</strong> {meeting.location}</p>
							<p>
								<strong>Participants:</strong>
								{meeting.participants.map((participantId: number) => getUserNameById(participantId)).join(', ')}
							</p>
						</li>
					))}
				</ul>
			) : (
				<p>Aucune réunion disponible.</p>
			)}
		</div>
	);
};

export default Dashboard;