import React, { useState, DragEvent } from "react";

interface Props {
    onFileSelect: (file: File) => void;
    photoFile: File | null
    setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>
}

const DragDropUpload: React.FC<Props> = ({ onFileSelect, photoFile, setPhotoFile }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) onFileSelect(file);
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onFileSelect(file);
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
        w-full min-h-[100px]
        rounded-[12px] bg-sub1
        flex flex-col items-center justify-center
        transition
        p-6
        ${isDragging ? "border-2 border-purple-500 bg-purple-50" : ""}
      `}
        >
            <p className="text-sub2 text-lg px-4 py-1 rounded-md">
                {photoFile != null ? photoFile.name : "Add Photo Here or Drag"}
            </p>
            <div className={`mt-4`}>
                {photoFile != null ? (
                    <button
                        onClick={() => setPhotoFile(null)}
                        className="
                            cursor-pointer bg-red-500 text-white px-6 py-2 rounded-full
                            hover:brightness-75 transition
                        "
                    >
                        Remove
                    </button>
                ) : (

                    <button onClick={() => fileInputRef.current?.click()} className="
                            cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-full
                            hover:brightness-75 transition
                        ">
                        Files
                    </button>
                )}

            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
            />
        </div >
    );
};

export default DragDropUpload;
