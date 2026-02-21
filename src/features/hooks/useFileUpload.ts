import { useCallback, useState } from 'react';
import { toast } from '@/features/components/ui/sonner';

import { FileAttachment } from '@/types/file';

interface UseFileUploadOptions {
  accept?: string;
  existingFiles?: FileAttachment[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { accept = 'application/pdf', existingFiles = [] } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] =
    useState<FileAttachment[]>(existingFiles);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        const invalidFiles = newFiles.filter((file) => file.type !== accept);

        if (invalidFiles.length > 0) {
          toast.error('Apenas arquivos PDF são permitidos.');
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
