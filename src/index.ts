import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { writeFile, readFile } from "fs/promises";

async function extractFrameFromVideo(videoUrl: string, timeInSeconds: number, outputPath: string): Promise<string> {
	return new Promise((resolve, reject) => {
		ffmpeg(videoUrl)
			.seekInput(timeInSeconds) // Seek to the desired time
			.outputOptions("-frames:v 1") // Extract only one frame
			.output(outputPath) // Save the frame as an image
			.on("end", () => resolve(outputPath))
			.on("error", (err) => reject(err))
			.run();
	});
}

async function encodeImageToBase64(imagePath: string): Promise<string> {
	const imageBuffer = await readFile(imagePath);
	return imageBuffer.toString('base64');
}

// Usage example
(async () => {
	try {
		const videoPath = "https://scontent-atl3-1.cdninstagram.com/o1/v/t16/f1/m86/B94DF70C92972475B21224CFAF81A595_video_dashinit.mp4?efg=eyJ2ZW5jb2RlX3RhZyI6InZ0c192b2RfdXJsZ2VuLmNsaXBzLnVua25vd24tQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSJ9&_nc_ht=scontent-atl3-1.cdninstagram.com&_nc_cat=108&vs=548059017996178_1226590432&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC9COTRERjcwQzkyOTcyNDc1QjIxMjI0Q0ZBRjgxQTU5NV92aWRlb19kYXNoaW5pdC5tcDQVAALIAQAVAhg6cGFzc3Rocm91Z2hfZXZlcnN0b3JlL0dJeGw2aHM3VW1UMENfZ0JBT0N3cXFoVDlHSU9icV9FQUFBRhUCAsgBACgAGAAbAYgHdXNlX29pbAExFQAAJsSrjNuojfc%2FFQIoAkMzLBdAGszMzMzMzRgSZGFzaF9iYXNlbGluZV8xX3YxEQB1AAA%3D&ccb=9-4&oh=00_AYDF4QA_6-HqmaJf7xYu0tsmlAt94T6B1t-eWxhAez5EKg&oe=6748360E&_nc_sid=1d576d"; // Local or accessible file path
		const outputPath = path.join(__dirname, "frame.png");
		const timeInSeconds = 3; // Time in seconds to extract frame

		const framePath = await extractFrameFromVideo(videoPath, timeInSeconds, outputPath);
		console.log("Frame saved at:", framePath);

		const base64Image = await encodeImageToBase64(framePath);
		console.log("Base64 encoded image:", base64Image);
	} catch (error) {
		console.error("Error extracting frame or encoding to base64:", error);
	}
})();
