# GCP Deployment Guide

## Prerequisites
- Google Cloud account with billing enabled
- Google Cloud CLI (see installation below)

## Install Google Cloud CLI

**macOS:**
```bash
brew install google-cloud-sdk
```

**Linux:**
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
```

**Windows:**
Download installer from: https://cloud.google.com/sdk/docs/install

**Verify installation:**
```bash
gcloud --version
```

## Deploy to Cloud Run

1. **Login to GCP:**
```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. **Enable required APIs:**
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
```

3. **Deploy to Cloud Run:**
```bash
gcloud run deploy flashcards \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

4. **Get your URL:**
The deployment will output a URL like: `https://flashcards-xxx-uc.a.run.app`

## Cost Estimate
- **Free tier**: 2 million requests/month
- **After free tier**: ~$0.40 per million requests
- **Memory**: 512MB should be sufficient
- **Auto-scaling**: 0 to 100 instances

## Custom Domain (Optional)
```bash
gcloud run domain-mappings create \
  --service flashcards \
  --domain your-domain.com \
  --region us-central1
```

## Environment Variables (if needed)
```bash
gcloud run services update flashcards \
  --set-env-vars NODE_ENV=production \
  --region us-central1
```