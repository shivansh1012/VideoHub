#!/usr/bin/env python
"""Walks through the Specfied folder and generates data and thumbnail for all the video files found 
in the folder and the sub-folders. The generated data is stored in the mongodb.

The VideoFiles in specified folder are scanned and the details of video files are
inserted into the MongoDB and A thumbnail is generated for the same in "./thumbnails" Folder"""

import os
from posixpath import split
import random
import shutil
import sys

import pymongo
from moviepy.editor import VideoFileClip
from PIL import Image

__author__ = "Shivansh Pandey"
__copyright__ = "MIT"
__credits__ = ["shivansh1012"]
__license__ = "GPL"
__version__ = "1.11.0"
__maintainer__ = "shivansh1012"
__status__ = "Development"


class PreStoredFilesAutomate:
    def __init__(self) -> None:
        # get the chemin for this current file
        ABS_PATH = os.path.abspath(__file__)
        # get the chemin for this current directory
        BASE_DIR = os.path.dirname(ABS_PATH)
        self.thumbnails_dir = "server/public/uploads/thumbnails"
        self.profilepic_dir = "server/public/uploads/profilepics"
        self.base_thumbnails_dir = os.path.join(BASE_DIR, self.thumbnails_dir)
        self.base_profilepic_dir = os.path.join(BASE_DIR, self.profilepic_dir)

        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["VideoHub"]
        self.Video = mydb["Video"]
        self.Photo = mydb["Photo"]
        self.Playlist = mydb["Playlist"]
        self.Profile = mydb["Profile"]

    def dropCollections(self) -> bool:
        try:
            self.Video.drop()
            print("Videos Dropped")
            self.Profile.drop()
            print("Profiles Dropped")
            self.Playlist.drop()
            print("Playlists Dropped")
            self.Photo.drop()
            print("Photos Dropped")
            return True
        except Exception:
            print("Couldnt drop the Collection")
            return False

    def deleteThumbnails(self):
        try:
            shutil.rmtree(self.base_thumbnails_dir)
            print("Thumbnails Deleted")
            return True
        except OSError as error:
            print(error)
            print("Thumbnails deletion failed")
            return False

    def createThumbnailsFolder(self):
        try:
            # create the folder "thumbnails"  at Ex : path/to/your/project/folder/data/outputs/thumbnails
            os.makedirs(self.base_thumbnails_dir, exist_ok=True)
            print("Thumbnails Folder Created")
        except OSError as error:
            print(error)
            print("Thumbnails Folder Creation Failed")

    def createProfile(self, name, accountType) -> str:
        profile = {}
        profile["name"] = name
        profile["accountType"] = accountType
        profile["email"] = name.replace(" ","").lower() + "@videohub.inf"
        profile["password"] = "login1234"
        profile["hashedpassword"] = ""
        profile["likedvideos"] = []
        profile["dislikedvideos"] = []
        profile["watchlater"] = []
        profile["playlist"] = []
        profile["profilepicURL"] = "defaults/defaultprofilepic2.jpg"
        profile["videoList"] = []
        profile["photoList"] = []

        savedProfile = self.Profile.insert_one(profile)
        return savedProfile.inserted_id

    def getVideoBasicData(self, dirpath, filename):
        dirpath = dirpath
        file_name = "".join(filename.split(".")[0:-1])
        # file_ext = filename[-4:]
        file_title = ""
        models = []
        channel = None
        split_file_name = file_name.split("-")
        if len(split_file_name) == 1:
            file_title = split_file_name[0].strip()
        elif len(split_file_name) == 2:
            file_title = split_file_name[0].strip()
            for m in split_file_name[1].split(","):
                models.append(m.strip())
        else:
            file_title = split_file_name[0].strip()
            for m in split_file_name[1].split(","):
                models.append(m.strip())
            channel = split_file_name[2].strip()

        path = os.path.join(dirpath, filename)

        tag = [t for t in file_title.split() if len(t) >= 3]
        # tag.extend([channel])
        # tag.extend(models)

        return file_title, dirpath, path, channel, list(set(tag)), models

    def getVideoProperties(self, dirpath, filename, cleanFileName):
        source_path = os.path.join(dirpath, filename)

        clip = VideoFileClip(source_path)

        fps = clip.reader.fps  # return number of frame per second
        nframes = clip.reader.nframes  # return number of frame in the video
        duration = clip.duration  # return duration of the video in second
        dimensions = clip.size
        max_duration = int(clip.duration)
        # here is the time where you want to take the thumbnail at second, it should be smaller than max_duration
        frame_at_second = random.randint(0, max_duration)
        # Gets a numpy array representing the RGB picture of the clip at time frame_at_second
        frame = clip.get_frame(frame_at_second)

        thumbnailfilename = cleanFileName + ".jpg"
        new_image_filepath = os.path.join(
            self.base_thumbnails_dir, thumbnailfilename
        )
        new_image = Image.fromarray(frame)  # convert numpy array to image
        new_image.save(new_image_filepath)  # save the image

        clip.close()

        return (
            new_image_filepath,
            thumbnailfilename,
            fps,
            nframes,
            duration,
            dimensions,
        )

    def saveVideoMetaData(
        self,
        title,
        videoFileName,
        thumbnailfilename,
        videoDirPath,
        videoPath,
        thumbnailpath,
        channel,
        tagList,
        modelList,
        fps,
        nframes,
        duration,
        dimension,
        uploadDate,
    ):
        videodata = {}
        videodata["filename"] = videoFileName
        videodata["dir"] = videoDirPath
        videodata["path"] = videoPath
        videodata["fps"] = str(fps)
        videodata["nframes"] = str(nframes)
        videodata["duration"] = str(duration)
        videodata["dimension"] = str(dimension[0]) + "x" + str(dimension[1])

        thumbnaildata = {}
        thumbnaildata["filename"] = thumbnailfilename
        thumbnaildata["dir"] = "uploads/thumbnails"
        thumbnaildata["path"] = "uploads/thumbnails/" + thumbnailfilename

        newVideo = {}
        newVideo["title"] = title
        newVideo["video"] = videodata
        newVideo["thumbnail"] = thumbnaildata
        newVideo["channel"] = channel
        newVideo["tags"] = tagList
        newVideo["model"] = modelList
        newVideo["uploaddate"] = uploadDate
        savedVideo = self.Video.insert_one(newVideo)
        return savedVideo.inserted_id

    def feedVideoData(self, dirpath, filename):
        try:
            (
                newFileName,
                videoDirPath,
                videoPath,
                channel,
                tagList,
                modelList,
            ) = self.getVideoBasicData(dirpath, filename)

            if self.Video.find_one({"title": newFileName}):
                return

            (
                thumbnailpath,
                thumbnailfilename,
                fps,
                nframes,
                duration,
                dimension,
            ) = self.getVideoProperties(
                dirpath, filename, newFileName
            )

            if channel:
                profileData = self.Profile.find_one({"name": channel})
                if profileData is None:
                    channelID = self.createProfile(channel, "channel")
                else:
                    channelID = profileData["_id"]
            else:
                channelID = ""
            modelListIDs = []
            for model in modelList:
                profileData = self.Profile.find_one({"name": model})
                if profileData is None:
                    modelListIDs.append(self.createProfile(model, "model"))
                else:
                    modelListIDs.append(profileData["_id"])
            uploadDate = int(
                os.path.getctime(os.path.join(dirpath, filename)) * 1000
            )
            videoID = self.saveVideoMetaData(
                newFileName,
                filename,
                thumbnailfilename,
                videoDirPath,
                videoPath,
                thumbnailpath,
                channelID,
                tagList,
                modelListIDs,
                fps,
                nframes,
                duration,
                dimension,
                uploadDate,
            )

            self.Profile.update_one(
                {"_id": channelID}, {"$push": {"videoList": videoID}}
            )

            for modelID in modelListIDs:
                self.Profile.update_one(
                    {"_id": modelID}, {"$push": {"videoList": videoID}}
                )

            self.videoFileCount += 1

            print(
                f"Video File Number:{self.videoFileCount}\n    {newFileName}\n    {modelList}\n    {channel}\n"
            )
        except Exception as e:
            print(f"Escaped {filename}", e)

    def getPhotoData(self, dirpath, filename, ext):
        file_name = "".join(filename.split(".")[0:-1])
        split_file_name = file_name.split("-")
        file_title = split_file_name[0].strip()
        model = []
        if len(split_file_name) > 1:
            model.append(split_file_name[-1].strip())
        img = Image.open(dirpath + "\\" + filename)
        return ( file_title, model, img.size, img.format)

    def savePhotoMetaData(
        self,
        title,
        filename,
        dirpath,
        dimension,
        fileFormat,
        modelList,
    ):
        try:
            newPhoto = {}
            newPhoto["title"] = title

            newPhoto["filename"] = filename
            newPhoto["dir"] = dirpath
            newPhoto["path"] = os.path.join(dirpath, filename)
            newPhoto["fileformat"] = fileFormat
            newPhoto["dimension"] = str(dimension[0]) + "x" + str(dimension[1])

            newPhoto["tags"] = [word for word in title.split() if(len(word)>3)]
            newPhoto["model"] = modelList
            newPhoto["uploaddate"] = int(
                os.path.getctime(os.path.join(dirpath, filename)) * 1000
            )
            savedPhoto = self.Photo.insert_one(newPhoto)
            return savedPhoto.inserted_id
        except Exception as e:
            print("Error Saving the Photo to db", e)
            sys.exit()

    def feedPhotoData(self, dirpath, filename, ext):
        try:
            file_title, modelList, img_size, img_format = self.getPhotoData(dirpath, filename, ext)
            modelListIDs = []
            for model in modelList:
                profileData = self.Profile.find_one({"name": model})
                if profileData is None:
                    modelListIDs.append(self.createProfile(model, "model"))
                else:
                    modelListIDs.append(profileData["_id"])
            savedPhotoId = self.savePhotoMetaData(
                title=file_title,
                filename=filename,
                dirpath=dirpath,
                dimension=img_size,
                fileFormat=img_format,
                modelList=modelListIDs
            )
            for modelID in modelListIDs:
                self.Profile.update_one(
                    {"_id": modelID}, {"$push": {"photoList": savedPhotoId}}
                )
            self.photoFileCount += 1

            print(
                f"Photo File Number:{self.photoFileCount}\n    {file_title}\n    {modelList}\n"
            )
        except Exception as e:
            print(f"Escaped {filename}", e)

    def ScanAndFeed(self, path: str, docChoice: int):
        self.createThumbnailsFolder()
        self.videoFileCount = 0
        self.photoFileCount = 0
        for dirpath, dirs, files in os.walk(path):
            for filename in files:
                # filename_noext = "".join(filename.split(".")[0:-1])
                ext = filename.split(".")[-1]
                if ext in ["mp4", "mkv", "mov"] and docChoice in [1, 3]:
                    self.feedVideoData(dirpath=dirpath, filename=filename)
                elif ext in ["jpg", "png", "jpeg"] and docChoice in [1, 2]:
                    self.feedPhotoData(dirpath=dirpath, filename=filename,ext=ext)

while True:
    choice = int(
        input(
            "1. Read Files, Create Thumbnails and Store in db\n2. Drop Collections and Thumbnails Folder\n3. Exit\n"
        )
    )

    auto = PreStoredFilesAutomate()
    if choice == 1:
        filePath = input("Enter Files Dir Path : ")
        docChoice = int(
        input(
                "1. Both\n2. Photo\n3. Video\n"
            )
        )
        auto.ScanAndFeed(path=filePath, docChoice=docChoice)
    elif choice == 2:
        auto.dropCollections()
        auto.deleteThumbnails()
    else:
        break
