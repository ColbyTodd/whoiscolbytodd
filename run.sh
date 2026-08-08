#!/bin/bash

# Check if node is installed
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found"
  echo ""
  echo "Install Node.js first:"
  echo "  # Ubuntu/Debian:"
  echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -"
  echo "  apt-get install -y nodejs"
  echo ""
  echo "  # Or use nvm:"
  echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash"
  echo "  nvm install 20"
  exit 1
fi

echo "=== Who is Colby Todd? Terminal Chat ==="
echo ""

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

echo ""
echo "🚀 Starting development server..."
npm run dev

echo ""
echo "💻 View in browser at the URL displayed above"
echo "⚙️  To change backend URL, edit src/api.js line 1"
