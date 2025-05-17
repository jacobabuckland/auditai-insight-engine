
import { Suggestion } from "./suggestionService";

/**
 * Applies HTML suggestions to HTML content
 * @param html The HTML content to modify
 * @param acceptedSuggestions The suggestions to apply
 * @returns The modified HTML content
 */
export function applyHtmlSuggestions(html: string, acceptedSuggestions: Suggestion[]): string {
  if (!html || acceptedSuggestions.length === 0) return html;

  let modifiedHtml = html;

  acceptedSuggestions.forEach(suggestion => {
    const highlightText = `<div class="bg-green-200 p-2 rounded my-2">
      <strong>Applied Suggestion:</strong> ${suggestion.title}
      <p>${suggestion.description}</p>
    </div>`;

    modifiedHtml = modifiedHtml.replace('<body', `<body>${highlightText}`);
  });

  return modifiedHtml;
}
