'use client';

import React, { ReactNode } from 'react';
import "../../styles/SamplesPage.css";
import FavoriteComponent from "@/components/common/favorites";
import PropertyComponent from "@/components/common/property";
import SearchbarComponent from "@/components/common/Searchbar";
import { useParams } from "next/navigation";
import SampleNameLayout from "./[name]/layoutName";
import SampleDataLayout from "./[name]/layout";

interface LayoutProps {
	children: ReactNode;
}

const SamplePage: React.FC<LayoutProps> = ({ children }) => {
	const params = useParams();
	const { name } = params as { name?: string }; // Explicitly type the params to handle optional values

	return (
		<section className="container-sample">
			<div className="layout-sampleSearchbar">
				<SearchbarComponent/>
			</div>
			<div className="layout-sampleFavorite">
				<FavoriteComponent/>
			</div>
			<div className="layout-sampleProperty">
				<PropertyComponent/>
			</div>
			{name && (
				<>
					<div className="layout-sampleName">
						<SampleNameLayout/>
					</div>
					<div className="layout-sampleData">
						<SampleDataLayout/>
					</div>
				</>
			)}
		</section>
	);
};

export default SamplePage;
