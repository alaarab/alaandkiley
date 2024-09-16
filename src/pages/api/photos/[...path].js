import { createReadStream, statSync } from 'fs';
import path from 'path';

// Access the environment variable for the external photo directory
const photosDirectory = process.env.PHOTOS_PATH;

// Helper function to get the correct MIME type
function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.jpeg':
    case '.jpg':
      return 'image/jpeg';
    case '.png':
      return 'image/png';
    default:
      return 'application/octet-stream';  // Fallback for unknown file types
  }
}

export default function handler(req, res) {
  const { path: filePathArray } = req.query;
  const relativePath = filePathArray.join('/'); // Join the array to construct the full file path

  // Construct the full file path
  const fullPath = path.join(photosDirectory, relativePath);

  try {
    // Check if the file exists
    const fileStat = statSync(fullPath);

    // Create a readable stream of the file
    const fileStream = createReadStream(fullPath);

    // Get the correct MIME type based on the file extension
    const mimeType = getMimeType(fullPath);

    // Set headers
    res.setHeader('Content-Type', mimeType);  // Set the correct MIME type
    res.setHeader('Content-Length', fileStat.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');  // Cache the file for a year

    // Pipe the file stream to the response
    fileStream.pipe(res);
  } catch (err) {
    console.error('File not found or error:', err.message);
    // If the file doesn't exist, return a 404
    res.status(404).json({ message: 'File not found' });
  }
}

// Increase the API response size limit (Next.js default is 4MB)
export const config = {
  api: {
    bodyParser: false,  // Disable body parsing, because we're using streams
    responseLimit: false, // Disable the response size limit
  },
};
