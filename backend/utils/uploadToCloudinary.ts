// import cloudinary from "../config/cloudinary";

// export const uploadToCloudinary = (
//   buffer: Buffer,
//   folder: string = "strapworld/products"
// ): Promise<{
//   secure_url: string;
//   public_id: string;
// }> => {
//   return new Promise((resolve, reject) => {
//     console.log(resolve,"resolve...")
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         folder,
//         resource_type: "image",
//       },
//       (error, result) => {
//         if (error) {
//           reject(error);
//           return;
//         }

//         if (!result) {
//           reject(new Error("Cloudinary upload failed"));
//           return;
//         }

//         resolve({
//           secure_url: result.secure_url,
//           public_id: result.public_id,
//         });
//       }
//     );

//     uploadStream.end(buffer);
//   });
// };


import cloudinary from "../config/cloudinary";

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string,
  fileName: string
): Promise<{
  secure_url: string;
  public_id: string;
}> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: fileName,
        resource_type: "image",
        overwrite: true,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    uploadStream.end(buffer);
  });
};