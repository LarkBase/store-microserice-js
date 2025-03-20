# Use Node.js base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy rest of the application
COPY . .

# Expose Vite's development server port
EXPOSE 5173

# Start Vite development server
CMD ["npm", "run", "dev", "--", "--host"]
