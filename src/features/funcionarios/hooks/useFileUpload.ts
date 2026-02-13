import { useState } from 'react';
import { toast } from 'sonner';

import { EmployeeFile } from '@/types/employee';

interface UseFileUploadOptions {
  accept?: string;
  existingFiles?: EmployeeFile[];
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
  const { accept = 'application/pdf', existingFiles = [] } = options;

  const [files, setFiles] = useState<File[]>([]);
  const [existingContracts, setExistingContracts] =
    useState<EmployeeFile[]>(existingFiles);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const removeExistingContract = (contractId: string) => {
    setExistingContracts((prev) => prev.filter((c) => c.id !== contractId));
  };

  const resetFiles = () => {
    setFiles([]);
    setExistingContracts([]);
  };

  const setInitialContracts = (contracts: EmployeeFile[]) => {
    setExistingContracts(contracts);
  };

  const hasAnyFiles = files.length > 0 || existingContracts.length > 0;

  return {
    files,
    existingContracts,
    hasAnyFiles,
    handleFileChange,
    removeFile,
    removeExistingContract,
    resetFiles,
    setInitialContracts,
  };
}
