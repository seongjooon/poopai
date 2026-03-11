import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const PIXELATE_SIZE = 32;

export async function pixelateImage(base64: string): Promise<string> {
  try {
    const dataUri = `data:image/jpeg;base64,${base64}`;
    
    const downscaled = await manipulateAsync(
      dataUri,
      [
        {
          resize: {
            width: PIXELATE_SIZE,
            height: PIXELATE_SIZE,
          },
        },
      ],
      { format: SaveFormat.JPEG, compress: 1 }
    );

    const upscaled = await manipulateAsync(
      downscaled.uri,
      [
        {
          resize: {
            width: 512,
            height: 512,
          },
        },
      ],
      {
        format: SaveFormat.JPEG,
        compress: 1,
        base64: true,
      }
    );

    if (!upscaled.base64) {
      throw new Error('Failed to generate pixelated base64');
    }

    return upscaled.base64;
  } catch (error) {
    console.error('Error pixelating image:', error);
    throw error;
  }
}