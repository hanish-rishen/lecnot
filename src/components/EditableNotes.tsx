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
    <div className="w-full h-full overflow-auto">
      <div
        contentEditable
        dangerouslySetInnerHTML={{ __html: editableNotes }}
        onInput={handleInput}
        className="w-full min-h-[500px] p-4 bg-black text-white border-2 border-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
        style={{ whiteSpace: 'pre-wrap' }}
      />
    </div>
  );
}