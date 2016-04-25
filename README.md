# Blink computational thinking
Blink computational thinking

## Install

Clone the repo, cd into it and install dependencies:
```
git clone git@github.com:q42/blink-ct.git
cd blink-ct
npm install
```

## Develop

Start your development environment on localhost:8000:
```
npm run start
```

## Deploy to GCS

Install gcloud utils & authenticate
```
TODO install gsutil
TODO authenticate
```

Available commands:
```
npm run release // Create a release into the dist directory.
npm run deploy // Sync the release to the GCS bucket
```

### How it's set up

The bucket has default READ access for all users
```
gsutil defacl ch -u AllUsers:R gs://www.ct3000.nl
```

It serves index.html (when root is accessed) and 404.html (when page not found)
```
gsutil web set -m index.html -e 404.html gs://www.ct3000.nl
```

meta redirect van gh-pages to gcs hosting.
