import { corsHeaders } from "./cors.ts";

const response = (body: string | null, statusCode: number): Response => {
	return new Response(body, {
		headers: {
			"Content-Type": "application/json",
			...corsHeaders,
		},
		status: statusCode,
	});
};

export default response;
