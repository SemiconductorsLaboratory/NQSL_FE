'use client';

import React, { ReactNode } from 'react';
import "../../styles/SamplesPage.css"
import FavoriteComponent from "@/components/common/favorites";
import PropertyComponent from "@/components/common/property";
import SearchbarComponent from "@/components/common/Searchbar";

interface LayoutProps {
	children: ReactNode;
}

const SamplePage : React.FC<LayoutProps> = ({ children }) => {
	return (
		<section className={"container-sample"}>
			<div className={"layout-sampleSearchbar"}>
				<SearchbarComponent/>
			</div>
			<div className={"layout-sampleFavorite"}>
				<FavoriteComponent/>
			</div>
			<div className={"layout-sampleProperty"}>
				<PropertyComponent/>
			</div>
			<div className={"layout-sampleData"}>
				{children}
			</div>
		</section>
	);
};

export default SamplePage;
