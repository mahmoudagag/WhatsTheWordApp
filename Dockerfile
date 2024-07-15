

# Stage 1: Build the React application
FROM node:14-alpine as build

WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY WhatsTheWord_frontend/package*.json ./

# Install dependencies
RUN npm install --production

# Set environment variable
ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

# Copy the rest of the application code
COPY /WhatsTheWord_frontend .

# Build the React app for production
RUN npm run build

# # Stage 2: Serve the React application using nginx
# FROM nginx:alpine

# # Copy the build output from the previous stage
# COPY --from=build /app/build /usr/share/nginx/html

# # Expose port 80 to allow external access
# EXPOSE 80

# # Default command to start nginx when the container starts
# CMD ["nginx", "-g", "daemon off;"]

# Use a lightweight Node.js image
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY WhatsTheWord_backend/package*.json ./

# Install dependencies
RUN npm install --production

COPY --from=build /app  .

# Copy the rest of the application code
COPY /WhatsTheWord_backend .

# Expose the port that the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "app.js"]
