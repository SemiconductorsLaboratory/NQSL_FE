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
                console.log("Canvas not mounted yet.");
                return;
            }

            if (!id) {
                console.log("ID not available.");
                return;
            }

            try {
                console.log("Attempting to load PDF...");
                const loadingTask = pdfjsLib.getDocument('http://localhost:8000/media/File/Alexandre_Nadal_CV_low.pdf');
                const pdf = await loadingTask.promise;

                console.log("PDF loaded successfully");

                const page = await pdf.getPage(1);
                console.log("Page 1 loaded successfully");

                const scale = 10;  // Rendre à 3x résolution pour plus de détails
                const viewport = page.getViewport({ scale });

                const canvas = canvasRef.current;
                if (canvas) {
                    const context = canvas.getContext('2d');
                    if (context) {
                        // Rendre le canvas à haute résolution
                        canvas.height = viewport.height;
                        canvas.width = viewport.width;

                        const renderContext = {
                            canvasContext: context,
                            viewport: viewport,
                        };

                        console.log("Rendering page...");
                        await page.render(renderContext).promise;
                        console.log("Page rendered successfully.");

                        // Redimensionner le canvas en CSS pour un affichage net
                        canvas.style.width = '150px';
                        canvas.style.height = 'auto';  // Conserver le ratio d'aspect
                    } else {
                        console.error("Failed to get canvas context.");
                    }
                }
            } catch (error) {
                console.error('Error during PDF loading or rendering:', error);
            }
        };

        if (!isLoading && canvasRef.current && id) {
            console.log("Conditions met, loading PDF...");
            loadPdf();
        } else {
            console.log("Skipping PDF load, conditions not met.");
        }
    }, [canvasRef, id, isLoading]);

    if (!id) {
        console.log("ID is missing.");
        return <p>Loading...</p>;
    }

    if (isLoading) {
        console.log("Data is loading...");
        return <p>Loading...</p>;
    }

    if (error || !data) {
        console.log("Error or missing data.");
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
                <p>Method: {data.method}</p>
                <p>Created At: {data.created_at}</p>
                <h2>Run spec</h2>
                <p>Magnification: {data.magnification}</p>
                <p>Voltage: {data.voltage}</p>
                <p>Current: {data.current}</p>
                <h2>Description</h2>
                <p>{data.description}</p>
                {data.image && <ImageDisplay url={data.image} />}
            </div>
            <canvas ref={canvasRef} style={{ width: '200px', height: '200px' }} />
        </div>
    );
};

export default LayoutId;