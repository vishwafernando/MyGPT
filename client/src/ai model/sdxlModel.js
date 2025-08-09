export const generateImageWithSDXL = async (prompt, getToken, options = {}) => {
  try {
    const {
      guidance_scale = 7.5,
      width = 1024,
      height = 1024
    } = options;

    console.log("🎨 SDXL: Generating image with prompt:", prompt);
    
    const token = await getToken();
    
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/generate-image`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          prompt,
          guidance_scale,
          width,
          height
        }),
      }
    );

    const result = await response.json();
    
    if (result.success) {
      console.log("✅ SDXL: Image generated successfully");
      return {
        success: true,
        imagePath: result.imagePath,
        imageUrl: result.imageUrl,
        modelUsed: result.modelUsed,
        prompt: result.prompt,
        metadata: {
          guidance_scale: result.guidance_scale,
          dimensions: result.dimensions
        }
      };
    } else {
      console.error("❌ SDXL: Generation failed:", result);
      return {
        success: false,
        error: result.error,
        message: result.message,
        instructions: result.instructions
      };
    }
  } catch (error) {
    console.error("❌ SDXL: Network error:", error);
    return {
      success: false,
      error: "Network error",
      message: "Failed to connect to SDXL image generation service. Please try again."
    };
  }
};

export const isImageRequest = (text) => {
  const imageKeywords = [
    "generate image",
    "generate an image",
    "generate a image",
    "generate picture",
    "generate a picture",
    "create image",
    "create an image",
    "create a image",
    "create picture",
    "create a picture",
    "make image",
    "make an image",
    "make a image",
    "make picture",
    "make a picture",
    "show me an image",
    "show me a picture",
    "show me a visual",
    "design image",
    "design a picture",
    "render this",
    "render it",
    "render an image",
    "create anime",
    "anime style image",
    "anime style drawing",
    "generate anime",
    "create cartoon",
    "in cartoon style",
    "in anime style",
    "pixel art of",
    "generate 3d render",
    "generate 3d model",
    "create concept art",
    "create digital art",
    "low poly render",
    "realistic image",
    "could you generate",
    "would you create",
    "please generate",
    "give me an image of",
    "make me a picture of",
    "turn this into a picture",
    "make a image",
    "create a image",
    "generate a image"
  ];

  return imageKeywords.some((keyword) =>
    text.toLowerCase().includes(keyword.toLowerCase())
  );
};
