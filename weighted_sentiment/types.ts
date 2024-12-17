export interface SentimentResponse {
	documentSentiment: Sentiment;
	languageCode: string;
	sentences: Sentence[];
	languageSupported: boolean;
}

export interface Sentiment {
	magnitude: number;
	score: number;
}

export interface Sentence {
	text: Text;
	sentiment: Sentiment;
}

export interface Text {
	content: string;
	beginOffset: number;
}
