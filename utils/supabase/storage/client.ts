import { createClient } from "@/utils/supabase/client";
// import imageCompression from "browser-image-compression";

function getStorage() {
  const { storage } = createClient();
  return storage;
}

type UploadProps = {
  file: File;
  name: string;
  bucket: string;
  folder?: string;
};

export const uploadImage = async ({ file, name, bucket, folder }: UploadProps) => {
  const fileName = file.name;
  const fileExtension = fileName.slice(fileName.lastIndexOf(".") + 1);
  const path = `${folder ? folder + "/" : ""}${name}.${fileExtension}`;
  const storage = getStorage();

  // try {
  //   // Compress image to reduce its size (optional)
  //   file = await imageCompression(file, {
  //     maxSizeMB: 1,  // Limit the file size to 1MB
  //   });
  // } catch (error) {
  //   console.error(error);
  //   return { imageUrl: "", error: "Image compression failed" };
  // }


  const { data, error } = await storage.from(bucket).upload(path, file, { upsert: true });

  if (error) {
    return { imageUrl: "", error: "Image upload failed" };
  }

  return { error: "" };
};

// Delete image function
export const deleteImage = async (imageUrl: string) => {
  const bucketAndPathString = imageUrl.split("/storage/v1/object/public/")[1];
  const firstSlashIndex = bucketAndPathString.indexOf("/");

  const bucket = bucketAndPathString.slice(0, firstSlashIndex);
  const path = bucketAndPathString.slice(firstSlashIndex + 1);

  const storage = getStorage();

  const { data, error } = await storage.from(bucket).remove([path]);

  return { data, error };
};
