import React from 'react';

interface ClearButtonProps {
  onClear: () => void;
}

export default function ClearButton({ onClear }: ClearButtonProps) {
  return (
    <button
      onClick={onClear}
      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
    >
      会話をクリア
    </button>
  );
}
