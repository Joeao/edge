const response = (body: string | null, statusCode: number): Response => {
	return new Response(body, {
		headers: {
			"Content-Type": "application/json",
		},
		status: statusCode,
	});
};

export default response;
