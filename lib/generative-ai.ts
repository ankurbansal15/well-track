import { GoogleGenerativeAI } from '@google/generative-ai';
import { v2 as cloudinary } from 'cloudinary';
import OpenAI from "openai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const generateTextToText = async (prompt: string) => {
  const result = await model.generateContent(prompt);
  return result.response.text();
};

const generateTextAndImageToText = async (prompt: string, imageUrl: string) => {
  try {
    // Fetch image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    const contentType = response.headers.get("content-type");
    const buffer = Buffer.from(await response.arrayBuffer());
    const base64Data = buffer.toString("base64");

    // Create the image part
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: contentType || "image/jpeg", // Default to jpeg if no content type
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    return result.response.text();
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
};

//Image Generation is not work in the google gemini api

// const generateTextToImage = async (prompt: string) => {

//   // Generate the image
//   const result = await model.generateContent(prompt);
//   const text = result.response.text();
//   // Assuming the response contains a base64 encoded image
//   const base64Data = text.replace(/^data:image\/\w+;base64,/, '');
//   const buffer = Buffer.from(base64Data, "base64");

//   // Upload to Cloudinary using promise
//   const cloudinaryUpload = await new Promise((resolve, reject) => {
//     cloudinary.uploader
//       .upload_stream(
//         {
//           folder: "exercise_tracking",
//           resource_type: "image",
//         },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       )
//       .end(buffer);
//   });
//   const imageUrl = (cloudinaryUpload as any).secure_url;
//   return imageUrl;
// };

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateTextToImage = async (prompt: string, exerciseName: string = "exercise") => {
  // Format the exercise name for the file name (replace spaces with hyphens)
  const formattedName = exerciseName.trim().replace(/\s+/g, "-").toLowerCase();

  try {
    // First, check if an image with the same exercise name already exists in Cloudinary
    // Note: We need to use exact public_id matching with proper quoting
    const searchResult = await cloudinary.search
      .expression(`folder:exercise_tracking AND public_id:"exercise_tracking/${formattedName}"`)
      .max_results(1)
      .execute();

    console.log(`Search results for '${formattedName}':`, JSON.stringify(searchResult, null, 2));

    // If the image already exists, return its URL
    if (searchResult && searchResult.resources && searchResult.resources.length > 0) {
      console.log(`Image for '${exerciseName}' already exists, reusing it`);
      return searchResult.resources[0].secure_url;
    }

    // Alternative approach: try to fetch the asset directly by ID
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.api.resource(`exercise_tracking/${formattedName}`, 
          (error: any, result: any) => {
            if (error && error.http_code !== 404) {
              reject(error);
            } else if (!error) {
              resolve(result);
            } else {
              resolve(null);
            }
          });
      });
      
      if (result) {
        console.log(`Found existing image for '${exerciseName}' using direct lookup`);
        return (result as any).secure_url;
      }
    } catch (lookupError) {
      console.log(`Asset lookup failed:`, lookupError);
      // Continue with generating a new image
    }

    // If no existing image was found, generate a new one
    console.log(`Generating new image for '${exerciseName}'`);
    
    // Generate image using OpenAI
    const image = await openai.images.generate({ model: "dall-e-2", prompt: prompt });

    // Get the generated image URL
    const imageUrl = image.data[0]?.url;
    
    if (!imageUrl) {
      throw new Error("Failed to generate image");
    }
    
    // Fetch the image data from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Upload to Cloudinary with the exercise name
    const cloudinaryUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "exercise_tracking",
            public_id: formattedName, // Use the formatted exercise name as the file name
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });
    
    // Return the Cloudinary URL
    return (cloudinaryUpload as any).secure_url;
  } catch (error) {
    console.error("Error in generateTextToImage:", error);
    throw error;
  }
}

export { generateTextToText, generateTextAndImageToText, generateTextToImage };
