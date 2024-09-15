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
    <div className="border-2 border-white rounded-lg p-4 mb-4">
      <p className="text-sm mb-2 font-semibold text-white">{figure.name}</p>
      <img
        src={figure.data}
        alt={figure.name}
        className="w-full h-auto border border-gray-300 rounded-lg"
      />
      <button
        onClick={handleCopy}
        className="mt-4 w-full px-4 py-2 bg-black text-white border-2 border-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
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