import { CSS, render } from "https://deno.land/x/gfm@0.6.0/mod.ts";

const parseMarkdown = (markdown: string): string => {
	const body = render(markdown, {
		baseUrl: "https://example.com",
	});

	return `
		<!DOCTYPE html>
		<html lang="en">
			<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<style>
				main {
				max-width: 800px;
				margin: 0 auto;
				}
				${CSS}
			</style>
			</head>
			<body>
			<main data-color-mode="light" data-light-theme="light" data-dark-theme="dark" class="markdown-body">
				${body}
			</main>
			</body>
		</html>
	`;
};

export default parseMarkdown;
