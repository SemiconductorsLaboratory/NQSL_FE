'use client';

import React from 'react';
import "./styles/Modal-Experiment.css"


const ModalExperiment: React.FC = () => {

    return (
       <div className={"container-experiment"}>
           <div className={"experiment"}>
               <div className={"method-block"}>
                   <div className={"method-border"}>
                       sem
                   </div>
               </div>
               <div className={"method-block"}>
                   <div className={"method-border"}>
                       afm
                   </div>
               </div>
           </div>
           <div className={"header-experiment"}>

           </div>
           <div className={"input-experiment"}>

           </div>
       </div>
    );
};

export default ModalExperiment;