# Use the node base image, the alpine version(which is a lightweight version.)
FROM node:16-alpine

# Set the working directory
WORKDIR /usr/src/app

# COPY the package.json into the app working directory or root working directory
COPY /api-stream/package.json /usr/src/app

# Install dependencies
RUN npm install

# Copy the source code of the backend into the working directory or root of the working directory
COPY /api-stream /usr/src/app

# Expose port locally to docker container
EXPOSE 5000

# Start API Server
CMD ["npm", "run", "server"]
