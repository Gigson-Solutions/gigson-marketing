'use client';

import { useState } from 'react';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  max?: number;
  placeholder?: string;
  ariaLabel?: string;
};

// Type + Enter tag input (competitors). No equivalent existed in the codebase.
const TagInput = ({ value, onChange, max = 10, placeholder, ariaLabel }: Props) => {
  const [draft, setDraft] = useState('');

  const commit = () => {
    const trimmed = draft.trim();
    if (!trimmed || value.length >= max || value.includes(trimmed)) {
      setDraft('');
      return;
    }
    onChange([...value, trimmed]);
    setDraft('');
  };

  return (
    <div className="gs-tag-input">
      <div className="gs-tag-input-tags">
        {value.map((tag) => (
          <span className="gs-tag" key={tag}>
            {tag}
            <button type="button" aria-label={`remove ${tag}`} onClick={() => onChange(value.filter((t) => t !== tag))}>
              ×
            </button>
          </span>
        ))}
      </div>
      {value.length < max && (
        <input
          type="text"
          aria-label={ariaLabel}
          placeholder={placeholder}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            }
          }}
          onBlur={commit}
        />
      )}
    </div>
  );
};

export default TagInput;
