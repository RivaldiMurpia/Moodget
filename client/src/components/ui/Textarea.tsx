'use client';

import React, { forwardRef } from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  counter?: boolean;
  maxLength?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  fullWidth?: boolean;
  className?: string;
  required?: boolean;
  autoGrow?: boolean;
  minRows?: number;
  maxRows?: number;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      counter = false,
      maxLength,
      resize = 'vertical',
      fullWidth = false,
      className = '',
      required = false,
      autoGrow = false,
      minRows = 3,
      maxRows = 8,
      value = '',
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const mergedRef = (node: HTMLTextAreaElement) => {
      // Forward the ref
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
      textareaRef.current = node;
    };

    const adjustHeight = React.useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea || !autoGrow) return;

      // Reset height to allow shrinking
      textarea.style.height = 'auto';

      // Calculate line height from computed styles
      const lineHeight = parseInt(
        window.getComputedStyle(textarea).lineHeight || '20'
      );
      const paddingTop = parseInt(
        window.getComputedStyle(textarea).paddingTop || '0'
      );
      const paddingBottom = parseInt(
        window.getComputedStyle(textarea).paddingBottom || '0'
      );

      // Calculate min and max heights based on rows
      const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
      const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom;

      // Set new height
      const newHeight = Math.min(
        Math.max(textarea.scrollHeight, minHeight),
        maxHeight
      );
      textarea.style.height = `${newHeight}px`;
    }, [autoGrow, minRows, maxRows]);

    React.useEffect(() => {
      adjustHeight();
    }, [value, adjustHeight]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e);
      if (autoGrow) {
        adjustHeight();
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={mergedRef}
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            className={`
              block w-full rounded-md shadow-sm
              border-gray-300 focus:border-indigo-500 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-300' : ''}
              ${resize === 'none' ? 'resize-none' : ''}
              ${resize === 'vertical' ? 'resize-y' : ''}
              ${resize === 'horizontal' ? 'resize-x' : ''}
              ${resize === 'both' ? 'resize' : ''}
            `}
            {...props}
          />
          {(counter || maxLength) && (
            <div className="absolute bottom-2 right-2 text-xs text-gray-500">
              {typeof value === 'string' && (
                <span>
                  {value.length}
                  {maxLength && `/${maxLength}`}
                </span>
              )}
            </div>
          )}
        </div>
        {(error || hint) && (
          <p
            className={`mt-1 text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}
          >
            {error || hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// Rich text area with toolbar
interface RichTextareaProps extends Omit<TextareaProps, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  toolbar?: ('bold' | 'italic' | 'underline' | 'list' | 'link')[];
}

export const RichTextarea: React.FC<RichTextareaProps> = ({
  value,
  onChange,
  toolbar = ['bold', 'italic', 'underline', 'list', 'link'],
  ...props
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleFormat = (format: string) => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    let newText = '';
    let newCursorPos = start;

    switch (format) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = value.substring(0, start) + `_${selectedText}_` + value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'underline':
        newText = value.substring(0, start) + `__${selectedText}__` + value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'list':
        newText = value.substring(0, start) + `\n- ${selectedText}` + value.substring(end);
        newCursorPos = end + 3;
        break;
      case 'link':
        newText = value.substring(0, start) + `[${selectedText}]()` + value.substring(end);
        newCursorPos = end + 3;
        break;
    }

    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  return (
    <div className="space-y-2">
      {toolbar && (
        <div className="flex space-x-2">
          {toolbar.includes('bold') && (
            <button
              type="button"
              onClick={() => handleFormat('bold')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Bold"
            >
              <i className="fas fa-bold"></i>
            </button>
          )}
          {toolbar.includes('italic') && (
            <button
              type="button"
              onClick={() => handleFormat('italic')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Italic"
            >
              <i className="fas fa-italic"></i>
            </button>
          )}
          {toolbar.includes('underline') && (
            <button
              type="button"
              onClick={() => handleFormat('underline')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Underline"
            >
              <i className="fas fa-underline"></i>
            </button>
          )}
          {toolbar.includes('list') && (
            <button
              type="button"
              onClick={() => handleFormat('list')}
              className="p-1 hover:bg-gray-100 rounded"
              title="List"
            >
              <i className="fas fa-list-ul"></i>
            </button>
          )}
          {toolbar.includes('link') && (
            <button
              type="button"
              onClick={() => handleFormat('link')}
              className="p-1 hover:bg-gray-100 rounded"
              title="Link"
            >
              <i className="fas fa-link"></i>
            </button>
          )}
        </div>
      )}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
};

export default Textarea;
