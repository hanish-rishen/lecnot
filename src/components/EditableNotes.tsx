import React, { useState, useEffect } from 'react';

interface EditableNotesProps {
  notes: string;
  onNotesChange: (notes: string) => void;
}

export default function EditableNotes({ notes, onNotesChange }: EditableNotesProps) {
  const [editableNotes, setEditableNotes] = useState(notes);

  useEffect(() => {
    setEditableNotes(notes);
  }, [notes]);

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    const newNotes = e.currentTarget.innerHTML;
    setEditableNotes(newNotes);
    onNotesChange(newNotes);
  };

  return (
    <div
      contentEditable
      dangerouslySetInnerHTML={{ __html: editableNotes }}
      onInput={handleInput}
      className="w-full h-full min-h-[500px] p-4 bg-white border border-gray-300 rounded-lg overflow-auto"
      style={{ whiteSpace: 'pre-wrap' }}
    />
  );
}