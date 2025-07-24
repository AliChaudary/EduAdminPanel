// cloudinaryUploader.ts
type BlockImageMap = { [blockId: string]: string };

let uploadedImages: string[] = [];
let blockImageMap: BlockImageMap = {};

export const cloudinaryUploader = {
  async uploadByFile(file: File, blockId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dtbcopunu/image/upload",
      { method: "POST", body: formData }
    );
    const data = await res.json();

    // If this block had a previous image, delete it first
    if (blockId && blockImageMap[blockId]) {
      await this.removeImage(blockImageMap[blockId]);
    }

    // Save new publicId
    if (blockId) blockImageMap[blockId] = data.public_id;
    uploadedImages.push(data.public_id);

    return {
      success: 1,
      file: {
        url: data.secure_url,
        publicId: data.public_id,
      },
    };
  },

  async removeImage(publicId: string) {
    await fetch("/api/deleteImage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
    uploadedImages = uploadedImages.filter((id) => id !== publicId);
  },

  async cleanupAll() {
    await Promise.all(
      uploadedImages.map((id) =>
        fetch("/api/deleteImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publicId: id }),
        })
      )
    );
    uploadedImages = [];
    blockImageMap = {};
  },
};
