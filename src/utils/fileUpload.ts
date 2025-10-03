import supabase from '@/lib/supabse';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload a single file to Supabase storage
 * @param file - The file to upload
 * @param bucketName - The Supabase bucket name (default: 'student-files')
 * @param userId - The user ID
 * @param onProgress - Optional progress callback
 * @returns Promise<UploadResult>
 */
export const uploadFileToSupabase = async (
  file: File,
  bucketName: string = 'barrowford-school-uploads',
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  try {
    // Generate unique filename to avoid conflicts
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;
    
    // Create the full path
    const filePath =  `${userId}/${fileName}`;

    // Upload file
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    return {
      success: true,
      url: urlData.publicUrl
    };
  } catch (error: any) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error.message || 'Upload failed'
    };
  }
};

/**
 * Upload multiple files to Supabase storage
 * @param files - Array of files to upload
 * @param bucketName - The Supabase bucket name (default: 'student-files')
 * @param userId - The user ID
 * @param onProgress - Optional progress callback for each file
 * @returns Promise<UploadResult[]>
 */
export const uploadMultipleFilesToSupabase = async (
  files: File[],
  bucketName: string = 'barrowford-school-uploads',
  userId: string,
  onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file, index) => 
    uploadFileToSupabase(
      file, 
      bucketName, 
      userId, 
      onProgress ? (progress) => onProgress(index, progress) : undefined
    )
  );

  return Promise.all(uploadPromises);
};

/**
 * Delete a file from Supabase storage
 * @param filePath - The path of the file to delete
 * @param bucketName - The Supabase bucket name (default: 'student-files')
 * @returns Promise<boolean>
 */
export const deleteFileFromSupabase = async (
  filePath: string,
  bucketName: string = 'barrowford-school-uploads'
): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
};

/**
 * Get file size in human readable format
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Validate file type and size
 * @param file - The file to validate
 * @param maxSizeInMB - Maximum file size in MB (default: 10)
 * @param allowedTypes - Array of allowed MIME types (default: all types)
 * @returns Validation result
 */
export const validateFile = (
  file: File,
  maxSizeInMB: number = 10,
  allowedTypes?: string[]
): { isValid: boolean; error?: string } => {
  // Check file size
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    return {
      isValid: false,
      error: `File size must be less than ${maxSizeInMB}MB`
    };
  }

  // Check file type
  if (allowedTypes && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  return { isValid: true };
};



export async function downloadImage(
  imageSrc: string,
  imageName: string,
  forceDownload: boolean = false
): Promise<void> {
  if (!forceDownload) {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = imageName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  // Force download using Blob
  const imageBlob = await fetch(imageSrc)
    .then((response) => response.arrayBuffer())
    .then((buffer) => new Blob([buffer], { type: "image/jpeg" }));

  const link = document.createElement("a");
  link.href = URL.createObjectURL(imageBlob);
  link.download = imageName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
