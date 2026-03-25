#!/bin/bash
echo "🔨 Building Next.js..."
rm -rf .next .open-next
npx next build || exit 1
echo "☁️  Building for Cloudflare..."
npx opennextjs-cloudflare build || exit 1
echo "🚀 Deploying..."
npx wrangler deploy || exit 1
echo "✅ Deployed!"
