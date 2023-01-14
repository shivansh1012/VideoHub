# Build the image off node version 16, and alias image as build-app.
FROM node:16-alpine as build-app

# Set working directory
WORKDIR /usr/src/app

# Copy package.json into the container's internal app directory
COPY /web-stream/package.json /usr/src/app

# Install dependencies
RUN npm install

# Copy source code into the container's internal app directory
COPY /web-stream /usr/src/app

# Build the project to be served from nginx.
RUN npm run build

# Define a new build step, serve the build application from nginx server.
FROM nginx:1.19-alpine

# Copy from the build-app build step, copy the app's build directory into the container's internal /usr/share/nginx/html directory
COPY --from=build-app /usr/src/app/build /usr/share/nginx/html

# Copy the nginx configuration file in to the internal container's default.conf directory.
COPY web-stream/conf/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Run the nginx daemon off; command to run the nginx server and turn off the daemon to run nginx in the backend.
CMD [ "nginx", "-g", "daemon off;" ]
