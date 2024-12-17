import { corsHeaders } from "../_shared/cors.ts";
import parseMarkdown from "../_shared/markdown-parser.ts";
import OptionsHandler from "../_shared/OptionsHandler.ts";
import response from "../_shared/response.ts";
import type { SentimentResponse } from "./types.ts";

const postHandler = async (
	req: Request,
): Promise<Response> => {
	const { googleApiKey, content } = await req.json();

	if (!googleApiKey) {
		return response("Google API Key is required", 400);
	}

	if (!content) {
		return response("Content is required", 400);
	}

	const res = await fetch(
		"https://language.googleapis.com/v2/documents:analyzeSentiment",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": googleApiKey,
			},
			body: JSON.stringify({
				document: {
					content,
					type: "PLAIN_TEXT",
				},
			}),
		},
	);

	const sentiment: SentimentResponse = await res.json();
	const normalized_score = (sentiment.documentSentiment.score + 1) / 2;
	const magnitude_weight = sentiment.documentSentiment.magnitude / (sentiment.documentSentiment.magnitude + 1);

	const overallScore = normalized_score * magnitude_weight;

	const significantText = sentiment.sentences.flatMap((sentence) => {
		const normalized_score = (sentence.sentiment.score + 1) / 2;
		const overall_sentiment = (normalized_score * sentence.sentiment.magnitude) + (0.5 * (1 - sentence.sentiment.magnitude))

		if (overall_sentiment > 0.75 || overall_sentiment <= 0.25) {
			return {
				score: overall_sentiment,
				text: sentence.text,
			};
		}

    return [];
	});

	return response(
		JSON.stringify({
			score: overallScore,
			significantText,
		}),
		200,
	);
};

Deno.serve((req) => {
	switch (req.method) {
		case "POST": {
			return postHandler(req);
		}
		case "OPTIONS": {
			return OptionsHandler();
		}
		case "GET":
			return handleGet();
		case "PUT":
		default: {
			return response("Method not supported", 405);
		}
	}
});

const handleGet = async (): Promise<Response> => {
	const readme = await Deno.readTextFile("weighted_sentiment/README.md");

	return new Response(parseMarkdown(readme), {
		headers: {
			...corsHeaders,
			"Content-Type": "text/html; charset=utf-8",
		},
	});
};
