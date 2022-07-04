# VideoHub
VideoHub - watch videos, get recommendations, search videos and share videos (upload) in the community.  

## Tech Used
ExpressJS - Server  
ReactJS   - Frontend  
MongoDB   - Database  
Python    - Automated Code to create thumbnails and index pre-existing videos' meta data into database  

## Getting Started

### File Formats for Video Indexing Automation

To index pre stored folder of videos, PreStoredVideoAutomate.py file is used. Install the requirements and run the python file. This will scan all the files in specified directory.

This will **Generate Thumbnails** and **Save file meta data in MongoDB**.  

Some of the ways the files are read are
* < FileName > - < Model/Cast > - < Channel/SeasonName >.< FileExtension >
* < FileName > - < Channel/SeasonName >.< FileExtension >
* < FileName > - < Model/Cast >.< FileExtension >
* < FileName >.< FileExtension >

### Installing Required Dependencies for Web Application

* After cloning the repository run command
  ```bash
  npm i
  ```
  
in webapp and server folders.

### Executing program

* To start client, Go into .\webapp\ directory and execute
  ```bash
  npm run client
  ```
* To start server, Go  in .\server\ directory and execute
  ```bash
  npm start
  ```
* Or Simply Run the Launch.bat file directly to start the application (Both).

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
