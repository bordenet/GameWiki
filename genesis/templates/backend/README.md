# Backend Templates

## Purpose

This directory contains backend API templates for projects that require server-side functionality. These templates are **optional** and only used when `{{ENABLE_BACKEND}}` is true.

## Status

⚠️ **Currently Empty** - Backend templates are planned for future implementation.

## Planned Contents

### API Templates

1. **`api-template.py`** - Python Flask/FastAPI backend
2. **`api-template.js`** - Node.js Express backend
3. **`api-template.go`** - Go backend

### Database Templates

4. **`models-template.py`** - Database models
5. **`migrations/`** - Database migration templates

### Configuration

6. **`config-template.yaml`** - Backend configuration
7. **`requirements-template.txt`** - Python dependencies
8. **`package-template.json`** - Node.js dependencies

## Use Cases

Backend templates will be used for:

### API Integration
- Proxy requests to external APIs
- Handle API keys securely
- Rate limiting
- Caching

### Data Processing
- Heavy computation
- Data transformation
- Batch processing

### Authentication
- User authentication
- Session management
- OAuth integration

### Storage
- Database operations
- File uploads
- Blob storage

## Architecture

When backend is enabled:

```
project/
├── web/              # Frontend (client-side)
│   ├── index.html
│   └── js/
│       └── api.js    # API client
├── api/              # Backend (server-side)
│   ├── app.py        # Main application
│   ├── models.py     # Database models
│   └── routes/       # API routes
├── scripts/
│   ├── setup-macos.sh
│   └── start-dev.sh  # Start both frontend and backend
└── docs/
    └── API.md        # API documentation
```

## When to Enable Backend

**Enable backend if you need**:
- ✅ Secure API key storage
- ✅ Server-side computation
- ✅ Database operations
- ✅ User authentication
- ✅ File uploads
- ✅ Webhooks

**Keep client-side only if**:
- ✅ Simple workflow application
- ✅ No sensitive data
- ✅ No heavy computation
- ✅ IndexedDB sufficient for storage
- ✅ Direct API calls acceptable

## Future Implementation

Backend templates will include:

### Python (Flask/FastAPI)
```python
# api/app.py
from flask import Flask, jsonify
app = Flask(__name__)

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok'})
```

### Node.js (Express)
```javascript
// api/app.js
const express = require('express');
const app = express();

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});
```

### Go
```go
// api/main.go
package main

import "net/http"

func health(w http.ResponseWriter, r *http.Request) {
    w.Write([]byte(`{"status":"ok"}`))
}
```

## Deployment

Backend deployment options:

### Development
- Local: `python api/app.py`
- Docker: `docker-compose up`

### Production
- Heroku
- AWS Lambda
- Google Cloud Run
- Vercel Serverless Functions
- Railway
- Render

## Related Documentation

- **Templates Index**: `../README.md`
- **AI Instructions**: `../../01-AI-INSTRUCTIONS.md`
- **Architecture Guide**: `../docs/architecture/BACKEND-template.md` (future)

## Contributing

To add backend templates:
1. Create template files in this directory
2. Add template variables
3. Update this README
4. Add to `../../01-AI-INSTRUCTIONS.md`
5. Create deployment guide
6. Add tests
7. Update `../../SUMMARY.md`

## Timeline

Backend templates are planned for:
- **Phase 1** (Q1 2026): Python Flask templates
- **Phase 2** (Q2 2026): Node.js Express templates
- **Phase 3** (Q3 2026): Go templates
- **Phase 4** (Q4 2026): Deployment guides

## Questions?

For now, Genesis focuses on client-side applications. Backend support is coming soon.

If you need backend functionality immediately:
1. Use Genesis to create frontend
2. Add backend manually
3. Share your implementation (we may incorporate it!)

