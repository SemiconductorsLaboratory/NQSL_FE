'use client';

import React from 'react';
import "../../styles/SamplesPage.css"
import FavoriteComponent from "@/components/common/favorites";
import PropertyComponent from "@/components/common/property";

const SamplePage = () => {
	return (
		<section className={"container-sample"}>
			<div className={"layout-sampleSearchbar"}>

			</div>
			<div className={"layout-sampleFavorite"}>
				<FavoriteComponent/>
			</div>
			<div className={"layout-sampleProperty"}>
				<PropertyComponent/>
			</div>
			<div className={"layout-sampleData"}>

			</div>
		</section>
	);
};

export default SamplePage;

