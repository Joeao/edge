# Google NLP Weighted Sentiment

Method: POST

URL: https://nlp-weighted-sentiment.deno.dev/

Body Type: application/json

Body Layout:

```json
{
	"googleApiKey": "[YOUR_KEY]",
	"content": "[YOUR_CONTENT]"
}
```

---

### Response

```json
{
  "score": [weighted_score], // Number between 0 and 1. 0 is the lowest and 1 is the highest.
  "significantText": [
    {
      "score": [weighted_score], // Number between 0 and 1. 0 is the lowest and 1 is the highest.
      "text": [content]
    }
  ]
}
```
