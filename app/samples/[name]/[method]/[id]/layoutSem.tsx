import React, { ReactNode, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { useSemDetailQuery } from "@/redux/features/sampleApiSlice";
import ImageDisplay from '@/components/ImageDisplay';
import '@/styles/layoutDescription.css';
import * as pdfjsLib from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';

interface LayoutProps {
    children: ReactNode;
}

const LayoutId: React.FC<LayoutProps> = ({ children }) => {
    const params = useParams();
    const { id } = params as { id?: string };

    const { data, error, isLoading } = useSemDetailQuery(id || "");
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const loadPdf = async () => {
            if (!canvasRef.current) {
                // Attendre que le canvas soit monté
                return;
            }

            try {
                console.log("Attempting to load PDF...");
                const loadingTask = pdfjsLib.getDocument('http://localhost:8000/media/File/Alexandre_Nadal_CV_low.pdf');
                const pdf = await loadingTask.promise;
                console.log("PDF loaded successfully:", pdf);

                const page = await pdf.getPage(1);
                console.log("Page 1 loaded successfully:", page);

                const scale = 2;  // 2x résolution
                const viewport = page.getViewport({ scale });
                console.log("Viewport calculated:", viewport);

                const canvas = canvasRef.current;
                if (canvas) {
                    const context = canvas.getContext('2d');
                    if (context) {
                        // Ajustez la taille du canvas en fonction de la nouvelle résolution
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };

                        console.log("Rendering page...");
                        await page.render(renderContext).promise;
                        console.log("Page rendered successfully.");
                    } else {
                        console.error("Failed to get canvas context.");
                    }
                } else {
                    console.error("Canvas reference is null.");
                }
            } catch (error) {
                console.error('Error during PDF loading or rendering:', error);
            }
        };

        // Charger le PDF une fois que le canvas est monté
        if (canvasRef.current) {
            loadPdf();
        }
    }, [canvasRef]);

    if (!id) {
        return <p>Loading...</p>;
    }

    if (isLoading) {
        return <p>Loading...</p>;
    }

    if (error || !data) {
        return (
            <div>
                <p>Error loading data</p>
                {error && (
                    <pre>
                        <code>{JSON.stringify(error, null, 2)}</code>
                    </pre>
                )}
            </div>
        );
    }

    const isSem = data.method === 'sem';

    return (
        <div className="container-description">
            {isSem && <p>This is a SEM method</p>}
            <div>
                <p>ID {data.id}</p>
                <p>Method: {data.method}</p>
                <p>Created At: {data.created_at}</p>
                <h2>Run spec</h2>
                <p>Magnification: {data.magnification}</p>
                <p>Voltage: {data.voltage}</p>
                <p>Current: {data.current}</p>
                <h2>Description</h2>
                <p>Description: {data.description}</p>
                {data.image && <ImageDisplay url={data.image}/>}
            </div>

            {/* Canvas pour afficher l'aperçu de la première page du PDF */}
            <canvas ref={canvasRef} style={{width: '200px', height: '200px'}}/>

        </div>
    );
};

export default LayoutId;