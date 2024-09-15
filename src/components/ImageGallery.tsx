import React from 'react';

interface Figure {
  name: string;
  data: string;
}

const CopyableImage = ({ figure }: { figure: Figure }) => {
  const handleCopy = async () => {
    try {
      const response = await fetch(figure.data);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('Image copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy image: ', err);
      alert('Failed to copy image. Please try again.');
    }
  };

  return (
    <div className="border border-gray-300 rounded-lg p-2 mb-4">
      <p className="text-sm mb-2">{figure.name}</p>
      <img
        src={figure.data}
        alt={figure.name}
        className="w-full h-auto"
      />
      <button
        onClick={handleCopy}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Copy Image
      </button>
    </div>
  );
};

export default function ImageGallery({ figures }: { figures: Figure[] }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {figures.map((figure, index) => (
        <CopyableImage key={`figure-${index}`} figure={figure} />
      ))}
    </div>
  );
}