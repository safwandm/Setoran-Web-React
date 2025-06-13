# 1. Use official Node.js image
FROM node:18-alpine AS base

# 2. Set working directory in the container
WORKDIR /app

# 3. Copy only package files to install dependencies first (for caching)
COPY package*.json ./

# 4. Install dependencies
RUN npm install --legacy-peer-deps

# 5. Copy the rest of your project
COPY . .

# 6. Build your app
RUN npm run build

# 7. Expose port and define start command
EXPOSE 3000
CMD ["npm", "start"]
