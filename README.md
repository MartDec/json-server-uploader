# JSON server uploader middleware

This middleware parse multipart/form-data content type requests, and upload files on the server when files are detected in requests

## Usage

You just need to add it as a middleware in serve command
```bash
json-server db.json --middlewares path/to/json-server-uploader
```

You can use custom upload path using .env file config
```
UPLOAD_PATH=your/custom/path
```
