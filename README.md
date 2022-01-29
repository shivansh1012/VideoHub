# VideoHub
VideoHub - watch videos, get recommendations and search any videos.  

## Tech Used
ExpressJS - Server  
ReactJS   - Frontend  
MongoDB   - Database  
Python    - Automated Code to create thumbnails and add data to database of videos in a folder  

## Getting Started

### File Formats

The Files names should to be store in any of this formats
* < FileName > - < Model/Cast > - < Channel/SeasonName >.< FileExtension >
* < FileName > - < Channel/SeasonName >.< FileExtension >
* < FileName > - < Model/Cast >.< FileExtension >
* < FileName >.< FileExtension >

To **Generate Thumbnails** and **Store file Data in MongoDB** run the LoadDataAndCreateThumbnails.py file. This will scan all the files in "./Files" directory.


### Installing Required Dependencies

* After cloning the repository run command
  ```bash
  npm i
  ```
  
in webapp and server folders.

### Executing program

* To start client, Go into .\webapp\ and execute
  ```bash
  npm run client
  ```
* To start server, Go  in .\server\ and execute
  ```bash
  npm start
  ```
* Or Run the Launch.bat file directly to start the app.
* !The Client and Server has to run together for it to work.

## Views

### HomePage with top videos
![image](https://github.com/shivansh1012/VideoHub/blob/WebDev/ReadMEPics/HomePage%20darkmode.png)

### Option for dark and light theme
![image](https://github.com/shivansh1012/VideoHub/blob/WebDev/ReadMEPics/SettingsPage.png)

### HomePage in light theme
![image](https://github.com/shivansh1012/VideoHub/blob/WebDev/ReadMEPics/HomePage.png)

### A List of all videos
![image](https://github.com/shivansh1012/VideoHub/blob/WebDev/ReadMEPics/VideoList.png)

### Video Player
![image](https://github.com/shivansh1012/VideoHub/blob/WebDev/ReadMEPics/Videoplayer.png)

### Basic Details about video and more videos to continue watching.
![image](https://github.com/shivansh1012/VideoHub/blob/WebDev/ReadMEPics/Videoplayermorevideos.png)
