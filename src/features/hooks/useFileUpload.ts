import { useCallback, useState } from 'react';
import { toast } from '@/features/components/ui/sonner';

import { FileAttachment } from '@/types/file';

interface UseFileUploadOptions {
  accept?: string;
  existingFiles?: FileAttachment[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { accept, existingFiles = [] } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] =
    useState<FileAttachment[]>(existingFiles);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);

        let invalidFiles: File[] = [];
        if (accept) {
          const acceptedTypes = accept.split(',').map((t) => t.trim());
          invalidFiles = newFiles.filter((file) => {
            return !acceptedTypes.some((type) => {
              if (type.endsWith('/*')) {
                return file.type.startsWith(type.replace('/*', '/'));
              }
              if (type.startsWith('.')) {
                return file.name.toLowerCase().endsWith(type.toLowerCase());
              }
              return file.type === type;
            });
          });
        }

        if (invalidFiles.length > 0) {
          toast.error('Alguns arquivos possuem um formato inválido.');
          e.target.value = '';
          return;
        }

        setFiles((prev) => [...prev, ...newFiles]);
        e.target.value = '';
      }
    },
    [accept]
  );

  const removeFile = useCallback((indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const removeExistingAttachment = useCallback((attachmentId: string) => {
    setExistingAttachments((prev) => prev.filter((a) => a.id !== attachmentId));
  }, []);

  const resetFiles = useCallback(() => {
    setFiles([]);
    setExistingAttachments([]);
  }, []);

  const setInitialAttachments = useCallback((attachments: FileAttachment[]) => {
    setExistingAttachments(attachments);
  }, []);

  const hasAnyFiles = files.length > 0 || existingAttachments.length > 0;

  return {
    files,
    existingAttachments,
    hasAnyFiles,
    handleFileChange,
    removeFile,
    removeExistingAttachment,
    resetFiles,
    setInitialAttachments,
  };
}
