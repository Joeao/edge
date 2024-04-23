# Image Resize Compress

### Method: POST

### URL: https://image-resize-compress.deno.dev/

### Body: Type: FormData

### Layout:

```json
{
    "image": File,
    "json": {
        "tinifyKey": "[YOUR_KEY]",
        "format": "png" | "jpg",
        "maxWidth": number,
        "maxHeight": number
    }
}
```

---

### Response

Compressed Image in specified format

---

### Example cURL / Bash:

```bash
curl --location 'https://image-resize-compress.deno.dev/'\
--form 'image=@"/home/triq/Pictures/Screenshot.png"'\
--form 'json="{\"tinifyKey\": \"[YOUR_KEY]\", \"format\": \"png\",
\"maxHeight\": 1000, \"maxWidth\": 1000}"'
```
