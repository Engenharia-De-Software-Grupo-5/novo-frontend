/**
 * Generic utilities for building multipart/form-data requests.
 * Used by any service that needs to upload files alongside JSON data.
 */

export interface FileUploadOptions {
  /** New files to upload */
  newFiles?: File[];
  /** IDs of existing files that the user chose to KEEP (the ones NOT removed) */
  existingFileIds?: string[];
}

/**
 * Builds the request body for creation/update with optional file uploads.
 *
 * - **Without files**: returns the data object as-is (sent as JSON).
 * - **With files**: returns a FormData (sent as multipart/form-data) containing:
 *   - `data` — JSON stringified fields
 *   - `existingFileIds` — JSON stringified array of kept file IDs
 *   - `files` — each new file as a separate part
 *
 * @param data - The JSON fields to send
 * @param options - Optional file upload configuration
 * @param fileFieldName - The FormData field name for files (default: 'files')
 */
export function buildFormDataBody<T extends Record<string, unknown>>(
  data: T,
  options?: FileUploadOptions,
  fileFieldName = 'files'
): FormData | T {
  const { newFiles = [], existingFileIds } = options ?? {};

  const hasNewFiles = newFiles.length > 0;
  const hasExistingFileChanges = existingFileIds !== undefined;
  console.log('hasNewFiles', hasNewFiles);
  // If there's nothing file-related, send plain JSON
  if (!hasNewFiles && !hasExistingFileChanges) {
    return data;
  }

  const formData = new FormData();
  // formData.append('data', JSON.stringify(data));
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    }
  });

  if (existingFileIds) {
    formData.append('existingFileIds', JSON.stringify(existingFileIds));
  }

  newFiles.forEach((file) => {
    formData.append(fileFieldName, file);
  });

  console.log('FORM DATA', formData);

  return formData;
}
