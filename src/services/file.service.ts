import { supabase } from '../config/supabase';
import { v4 as uuidv4 } from 'uuid';

export async function uploadFile(fileBuffer: Buffer, bucketName: string, originalName: string, mimeType: string) {
    const fileExtension = originalName.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .upload(fileName, fileBuffer, {
            contentType: mimeType,
            upsert: false
        });

    if (error) throw error;

    // Get the public URL for the newly uploaded file
    const { data: urlData } = supabase
        .storage
        .from(bucketName)
        .getPublicUrl(fileName);

    return {
        path: data.path,
        publicUrl: urlData.publicUrl
    };
}

export async function deleteFile(bucketName: string, filePath: string) {
    const { data, error } = await supabase
        .storage
        .from(bucketName)
        .remove([filePath]);

    if (error) throw error;
    return data;
}
