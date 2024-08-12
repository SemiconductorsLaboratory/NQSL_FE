'use client';

import React, { ReactNode } from 'react';
import "../../styles/SamplesPage.css";
import FavoriteComponent from "@/components/common/favorites";
import SearchbarComponent from "@/components/common/Searchbar";
import { useParams } from "next/navigation";
import PropertyComponent from "./[name]/layoutPreperty";
import SampleNameLayout from "./[name]/layoutName";

import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
	children: ReactNode;
}

const SamplePage: React.FC<LayoutProps> = ({ children }) => {
	const params = useParams();
	const { name } = params as { name?: string }; // Explicitly type the params to handle optional values

	return (
		<div id="__next">
			<section className="container-sample">

				<div className="layout-sampleSearchbar">
					<SearchbarComponent/>
				</div>
				<div className="layout-sampleFavorite">
					<FavoriteComponent/>
				</div>
				{name && (
					<>
						<div className="layout-sampleProperty">
							<PropertyComponent/>
						</div>
						<div className="layout-sampleName">
							<SampleNameLayout/>
						</div>
						<div className="layout-sampleData">
							{children}
						</div>
					</>
				)}
			</section>
		</div>
)
	;
};

export default SamplePage;