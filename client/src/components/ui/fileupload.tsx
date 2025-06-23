'use client';

import React, { useRef, useState } from 'react';

interface FileUploadProps {
  onChange: (files: File[]) => void;
  value?: File[];
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  maxFiles?: number;
  label?: string;
  hint?: string;
  error?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  preview?: boolean;
  dragAndDrop?: boolean;
  onError?: (error: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onChange,
  value = [],
  accept,
  multiple = false,
  maxSize,
  maxFiles = 10,
  label,
  hint,
  error,
  className = '',
  disabled = false,
  required = false,
  preview = true,
  dragAndDrop = true,
  onError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = value.length + newFiles.length;

    // Check max files
    if (maxFiles && totalFiles > maxFiles) {
      onError?.(`Maximum ${maxFiles} files allowed`);
      return;
    }

    // Check file size
    if (maxSize) {
      const oversizedFiles = newFiles.filter((file) => file.size > maxSize);
      if (oversizedFiles.length > 0) {
        onError?.(`Some files exceed the maximum size of ${formatBytes(maxSize)}`);
        return;
      }
    }

    onChange(multiple ? [...value, ...newFiles] : newFiles);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (!disabled) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  };

  const isImage = (file: File): boolean => {
    return file.type.startsWith('image/');
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* File Input Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-4
          ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${error ? 'border-red-300' : ''}
        `}
        onDragOver={dragAndDrop ? handleDragOver : undefined}
        onDragLeave={dragAndDrop ? handleDragLeave : undefined}
        onDrop={dragAndDrop ? handleDrop : undefined}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          disabled={disabled}
          required={required}
        />

        <div className="text-center">
          <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
          <div className="text-sm text-gray-600">
            {dragAndDrop ? (
              <>
                <span className="font-medium text-indigo-600 hover:text-indigo-500">
                  Click to upload
                </span>{' '}
                or drag and drop
              </>
            ) : (
              <span className="font-medium text-indigo-600 hover:text-indigo-500">
                Click to upload
              </span>
            )}
          </div>
          {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
          {maxSize && (
            <p className="text-xs text-gray-500 mt-1">
              Max file size: {formatBytes(maxSize)}
            </p>
          )}
        </div>
      </div>

      {/* File Preview */}
      {preview && value.length > 0 && (
        <div className="mt-4 space-y-2">
          {value.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {isImage(file) && (
                  <div className="w-10 h-10 flex-shrink-0">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

// Image upload variant
interface ImageUploadProps extends Omit<FileUploadProps, 'accept' | 'preview'> {
  aspectRatio?: number;
  showCrop?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  aspectRatio,
  showCrop = false,
  ...props
}) => {
  return (
    <FileUpload
      {...props}
      accept="image/*"
      preview={true}
      hint={`Upload ${props.multiple ? 'images' : 'an image'}`}
    />
  );
};

// Document upload variant
interface DocumentUploadProps extends Omit<FileUploadProps, 'accept'> {
  allowedTypes?: string[];
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  allowedTypes = ['.pdf', '.doc', '.docx', '.txt'],
  ...props
}) => {
  return (
    <FileUpload
      {...props}
      accept={allowedTypes.join(',')}
      hint={`Allowed file types: ${allowedTypes.join(', ')}`}
    />
  );
};

export default FileUpload;
