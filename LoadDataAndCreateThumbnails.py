#!/usr/bin/env python
"""Loads Data in DB and generates thumbnails for Video Files.

The VideoFiles in folder "./Files" are scanned and the details of video files are
inserted into the MongoDB and A thumbnail is generated for the same in "./thumbnails" Folder"""

import os
import shutil

import pymongo
from moviepy.editor import VideoFileClip
from PIL import Image

__author__ = "Shivansh Pandey"
__copyright__ = "MIT"
__credits__ = ["shivansh1012"]
__license__ = "GPL"
__version__ = "1.11.0"
__maintainer__ = "shivansh1012"
__status__ = "Production"


class Automation:
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
        self.Profile = mydb["Profile"]

    def dropCollections(self, VideoData=1, ProfileData=1) -> bool:
        try:
            if VideoData:
                self.Video.drop()
                print("Videos Dropped")
            if ProfileData:
                self.Profile.drop()
                print("Profiles Dropped")
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
            return True
        except OSError as error:
            print(error)
            print("Thumbnails Folder Creation Failed")
            return False

    def createProfile(self, name, accountType) -> str:
        profile = {}
        email = name.split(" ")
        email = "".join(email)
        email = email.lower()
        profile["name"] = name
        profile["accountType"] = accountType
        profile["email"] = email + "@videohub.inf"
        profile["password"] = "login1234"
        profile["hashedpassword"] = ""
        profile["playlist"] = {
            "likedvideos": {"name": "likedvideos", "videoList": []},
            "dislikedvideos": {"name": "dislikedvideos", "videoList": []},
            "watchlater": {"name": "watchlater", "videoList": []},
        }

        if os.path.exists(self.base_profilepic_dir + "/" + name + ".jpg"):
            profile["profilepicURL"] = "uploads/profilepics/" + name + ".jpg"
        else:
            profile["profilepicURL"] = "defaults/defaultprofilepic2.jpg"
        profile["videoList"] = []

        savedProfile = self.Profile.insert_one(profile)
        return savedProfile.inserted_id

    def getVideoBasicData(self, dirpath, filename):
        dirpath = dirpath.replace("\\", "/")
        noExtFileName = filename[0:-4]
        # fileExt = filename[-4:]
        cleanFileName = ""
        models = []
        channel = None
        newFileName = noExtFileName.split("-")
        if len(newFileName) == 1:
            cleanFileName = newFileName[0].strip()
        elif len(newFileName) == 2:
            cleanFileName = newFileName[0].strip()
            for m in newFileName[1].split(","):
                models.append(m.strip())
        else:
            cleanFileName = newFileName[0].strip()
            for m in newFileName[1].split(","):
                models.append(m.strip())
            channel = newFileName[2].strip()

        path = os.path.join(dirpath, filename).replace("\\", "/")

        tag = [t for t in cleanFileName.split() if len(t) >= 3]
        # tag.extend([channel])
        # tag.extend(models)

        return cleanFileName, dirpath, path, channel, list(set(tag)), models

    def getVideoProperties(self, dirpath, filename, cleanFileName, createThumbnail):
        source_path = os.path.join(dirpath, filename)

        clip = VideoFileClip(source_path)

        fps = clip.reader.fps  # return number of frame per second
        nframes = clip.reader.nframes  # return number of frame in the video
        duration = clip.duration  # return duration of the video in second
        dimensions = clip.size
        # max_duration = int(clip.duration) + 1
        # here is the time where you want to take the thumbnail at second, it should be smaller than max_duration
        frame_at_second = 28
        # Gets a numpy array representing the RGB picture of the clip at time frame_at_second
        frame = clip.get_frame(frame_at_second)

        if createThumbnail:
            thumbnailfilename = cleanFileName + ".jpg"
            new_image_filepath = os.path.join(
                self.base_thumbnails_dir, thumbnailfilename
            )
            new_image = Image.fromarray(frame)  # convert numpy array to image
            new_image.save(new_image_filepath)  # save the image

        clip.close()

        return (
            new_image_filepath.replace("\\", "/"),
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

    def Automate(self, path: str, saveDataInDB: int = 1, createThumbnail: int = 1):
        if createThumbnail:
            self.createThumbnailsFolder()
        fileCount = 0
        for dirpath, dirs, files in os.walk(path):
            for filename in files:
                if filename[-4:] not in [".mp4", ".mkv"]:
                    continue

                (
                    newFileName,
                    videoDirPath,
                    videoPath,
                    channel,
                    tagList,
                    modelList,
                ) = self.getVideoBasicData(dirpath, filename)

                (
                    thumbnailpath,
                    thumbnailfilename,
                    fps,
                    nframes,
                    duration,
                    dimension,
                ) = self.getVideoProperties(
                    dirpath, filename, newFileName, createThumbnail
                )

                if saveDataInDB:
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

                fileCount += 1

                print(
                    f"File Number:{fileCount}\n    {newFileName}\n    {modelList}\n    {channel}\n"
                )


while True:
    choice = int(
        input(
            "1. Insert Data and Create Thumbnails\n2. Drop Collections and Thumbnails\n3. Exit\n"
        )
    )

    auto = Automation()
    if choice == 1:
        commands = list(map(int, input().split()))
        if commands == []:
            auto.Automate(r".\Files")
        else:
            auto.Automate(r".\Files", commands[0], commands[1])
    elif choice == 2:
        commands = list(map(int, input().split()))
        if commands == []:
            auto.dropCollections()
            auto.deleteThumbnails()
        elif commands[0] == 1:
            auto.dropCollections()
        elif commands[1] == 1:
            auto.deleteThumbnails()
    else:
        break
