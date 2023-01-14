# VideoHub
VideoHub - watch videos, get recommendations, search videos and share videos (upload) in the community.  

## Tech Used
ExpressJS - API server  
ReactJS   - Web Application  
MongoDB   - Database Store  
Docker Container Images


## Views

### HomePage with top videos
![HomePage darkmode](https://user-images.githubusercontent.com/53964760/152741751-4a787269-5cb2-4061-804f-4bbc6f35505e.png)

### Option for dark and light theme
![SettingsPage](https://user-images.githubusercontent.com/53964760/152741768-499728d1-4818-4271-8c19-d59a41862489.png)

### HomePage in light theme
![HomePage](https://user-images.githubusercontent.com/53964760/152741793-2e3c4570-ca28-41e0-a8ab-4c32da0d861a.png)

### A List of all videos
![VideoList](https://user-images.githubusercontent.com/53964760/152741805-a6764ea6-52a2-4826-a6a6-3b5397747a11.png)

### Video Player
![Videoplayer](https://user-images.githubusercontent.com/53964760/152741812-7d057712-c725-472f-9fa4-bb7a058494b2.png)

### Basic Details about video and more videos to continue watching
![Videoplayermorevideos](https://user-images.githubusercontent.com/53964760/152741828-fd8b33d2-66e3-4dd4-88ba-c170e67e6009.png)


## Instant Setup  
### Docker Container

* Docker Compose
  ```bash
  docker compose up
  ```

-------------OR-------------  

* Run Web-Stream Container
  ```bash
  docker run --rm -d --name webstream -p 80:80 userverse/webstream:latest
  ```

* Run API-Stream Container
  ```bash
  docker run --rm -d --name apistream --env-file .env -p 5000:5000 userverse/apistream:latest
  ```

  Environmental Variables (Store in .env file):  
  JWT_SECRET=  
  MONGO_ATLAS_URI=  
  SERVER_PORT=5000  

## Getting Started ( Developers )  
### Installing Required Dependencies

* After cloning the repository run command
  ```bash
  npm i
  ```
in web-stream and api-stream directories.

### Run Applications

* For Web application
  ```bash
  cd web-stream
  npm start
  ```
* For API application
  ```bash
  cd api-stream
  npm run server
  ```

  Environmental Variables (Store in .env file):  
  JWT_SECRET=  
  MONGO_ATLAS_URI=  
  SERVER_PORT=5000  

## Build Images

* For Web application
  ```bash
  docker build -f web-stream/Dockerfile -t userverse/webstream:vdev .
  ```
* For API application
  ```bash
  docker build -f api-stream/Dockerfile -t userverse/apistream:vdev .
  ```
