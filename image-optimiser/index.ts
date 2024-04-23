import {
	ImageMagick,
	initialize,
} from "https://deno.land/x/imagemagick_deno@0.0.26/mod.ts";
import { Tinify } from "https://deno.land/x/tinify@v1.0.0/mod.ts";

import { corsHeaders } from "../_shared/cors.ts";
import response from "../_shared/response.ts";
import parseMarkdown from "../_shared/markdown-parser.ts";

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
	const binary_string =  atob(base64);
	const len = binary_string.length;
	const bytes = new Uint8Array( len );
	for (let i = 0; i < len; i++)        {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}

Deno.serve(async (req) => {
	if (req.method === "OPTIONS") {
		return new Response("ok", { headers: corsHeaders })
	}

	if (req.method === "GET") {
		return handleGet();
	}

	const formData = await req.formData();
	const image = formData.get("image");
	const json = formData.get("json");

	if (!(image && json)) {
		return response("Bad request: File or JSON is missing.\n", 400);
	}

	const body: {
		maxWidth: number;
		maxHeight: number;
		tinifyKey: string;
		format: "jpg" | "png";
	} = JSON.parse(json as string);

	if (!body) {
		return response("No body", 400);
	}

	try {
		const imageBuffer = await readFile(image);
		const data = new Uint8Array(imageBuffer);

		const compressedImageBase64 = await resizeCompressImage(body.tinifyKey, data, body.maxWidth, body.maxHeight);

		const mimeType = `image/${body.format}`;

		const blob = new Blob([base64ToArrayBuffer(compressedImageBase64)], { type: mimeType });
		
		return new Response(blob, {
			headers: {
				...corsHeaders,
				"Content-Type": mimeType
			}
		}); 
	} catch (err) {
		console.error(err);
		return response("", 400);
	}
});

const readFile = (image: FormDataEntryValue | null): Promise<ArrayBuffer> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (reader.result instanceof ArrayBuffer) {
				resolve(reader.result)
			} else {
				reject("File type not supported");
			}
		}

		const blob = image instanceof File ? image : null;

		if (blob) {
			reader.readAsArrayBuffer(blob);
		} else {
			reject("File type not supported");
		}
	})
}

const resizeCompressImage = (tinifyKey: string, data: Uint8Array, maxWidth: number, maxHeight: number): Promise<string> => {
	return new Promise((resolve, reject) => {
		initialize().then(() => {
			const tinify = new Tinify({
				api_key: tinifyKey
			});
	
			try {
				ImageMagick.read(data, async (img) => {
					// Resize image, maintaining aspect ratio
					const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
		
					if (img.width > maxWidth || img.height > maxHeight) {
						if (img.width === img.height) {
							img.resize(maxWidth, maxHeight);
						} else if (img.width > img.height) {
							img.resize(maxWidth, maxHeight * ratio);
						} else {
							img.resize(maxWidth * ratio, maxHeight);
						}
					}
		
					const tinyImage = await tinify.compress(data); 
					const { base64 } = await tinyImage.toBase64();
					
					resolve(base64 as string);
				});
			} catch (err) {
				reject(err);
			}
		});	
	});
}

const handleGet = async (): Promise<Response> => {	
	const readme = await Deno.readTextFile("image-optimiser/README.md");

	return new Response(parseMarkdown(readme), {
		headers: {
			...corsHeaders,
			"Content-Type": "text/html; charset=utf-8"
		}
	}); 
}