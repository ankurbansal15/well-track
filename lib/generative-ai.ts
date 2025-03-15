import { GoogleGenerativeAI } from '@google/generative-ai';
import { v2 as cloudinary } from 'cloudinary';
// Remove OpenAI import
// import OpenAI from "openai";

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

const generateTextToImage = async (prompt: string, foodName: string = "food") => {
  // Format the food name for the file name (replace spaces with hyphens)
  const formattedName = foodName.trim().replace(/\s+/g, "-").toLowerCase();

  try {
    // First, check if an image with the same food name already exists in Cloudinary
    const searchResult = await cloudinary.search
      .expression(`folder:food_items AND public_id:"food_items/${formattedName}"`)
      .max_results(1)
      .execute();

    // If the image already exists, return its URL
    if (searchResult && searchResult.resources && searchResult.resources.length > 0) {
      console.log(`Image for '${foodName}' already exists, reusing it`);
      return searchResult.resources[0].secure_url;
    }

    // Alternative approach: try to fetch the asset directly by ID
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.api.resource(`food_items/${formattedName}`, 
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
        console.log(`Found existing image for '${foodName}' using direct lookup`);
        return (result as any).secure_url;
      }
    } catch (lookupError) {
      console.log(`Asset lookup failed:`, lookupError);
      // Continue with searching a new image
    }

    // If no existing image was found, search for one using Google Search API
    console.log(`Searching image for '${foodName}'`);
    
    // Use Google Custom Search API to find an image
    // Make sure you have set up Google Custom Search API and have the API key and Search Engine ID
    const searchQuery = `${foodName} food photography appetizing dish`;
    const searchUrl = `https://customsearch.googleapis.com/customsearch/v1?` +
      `key=${process.env.GOOGLE_SEARCH_API_KEY}` +
      `&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}` +
      `&q=${encodeURIComponent(searchQuery)}` +
      `&searchType=image` +
      `&imgSize=large` +
      `&num=1` +
      `&safe=active`;
    
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`Failed to search for images: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      throw new Error("No images found in search results");
    }
    
    const imageUrl = searchData.items[0].link;
    
    // Fetch the image data from the URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    // Upload to Cloudinary with the food name
    const cloudinaryUpload = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "food_items",
            public_id: formattedName, // Use the formatted food name as the file name
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

const generateExerciseImage = async (prompt: string, exerciseName: string = "exercise") => {
  // Format the exercise name for the file name (replace spaces with hyphens)
  const formattedName = exerciseName.trim().replace(/\s+/g, "-").toLowerCase();

  try {
    // First, check if an image with the same exercise name already exists in Cloudinary
    const searchResult = await cloudinary.search
      .expression(`folder:exercise_items AND public_id:"exercise_tracking/${formattedName}"`)
      .max_results(1)
      .execute();

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
      // Continue with searching a new image
    }

    // If no existing image was found, search for one using Google Search API
    console.log(`Searching image for '${exerciseName}'`);
    
    // Use Google Custom Search API to find an image
    // Make sure you have set up Google Custom Search API and have the API key and Search Engine ID
    const searchQuery = `${exerciseName} exercise fitness workout`;
    const searchUrl = `https://customsearch.googleapis.com/customsearch/v1?` +
      `key=${process.env.GOOGLE_SEARCH_API_KEY}` +
      `&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}` +
      `&q=${encodeURIComponent(searchQuery)}` +
      `&searchType=image` +
      `&imgSize=large` +
      `&num=1` +
      `&safe=active`;
    
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      throw new Error(`Failed to search for images: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (!searchData.items || searchData.items.length === 0) {
      throw new Error("No images found in search results");
    }
    
    const imageUrl = searchData.items[0].link;
    
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
    console.error("Error in generateExerciseImage:", error);
    throw error;
  }
};


export { generateTextToText, generateTextAndImageToText, generateTextToImage, generateExerciseImage };
