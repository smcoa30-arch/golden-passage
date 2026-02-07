FROM node:18-alpine AS builder

WORKDIR /app

# Install all dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Accept build arguments for AI API keys
ARG GOOGLE_AI_KEY
ARG KIMI_API_KEY
ARG OPENROUTER_API_KEY

# Set environment variables
ENV GOOGLE_AI_KEY=${GOOGLE_AI_KEY}
ENV KIMI_API_KEY=${KIMI_API_KEY}
ENV OPENROUTER_API_KEY=${OPENROUTER_API_KEY}

# Copy package files
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/health || exit 1

# Start the application
CMD ["node", "dist/server.js"]
