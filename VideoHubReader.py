#!/usr/bin/env python
"""Walks through the Specfied folder and generates data and thumbnail for all the video files found 
in the folder and the sub-folders. The generated data is stored in the mongodb.

The VideoFiles in specified folder are scanned and the details of video files are
inserted into the MongoDB and A thumbnail is generated for the same in "./thumbnails" Folder"""

import os
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
__version__ = "2.0.0"
__maintainer__ = "shivansh1012"
__status__ = "Development"


class Video:
    def __init__(self, filename, dir, path, ext) -> None:
        self.video = {
            "filename": filename,
            "dir": dir,
            "path": path,
            "ext": ext,
            "fps": "",
            "nframes": "",
            "duration": "",
            "dimension": ""
        }

        self.thumbnail = {
            "filename": "",
            "dir": "uploads/thumbnails",
            "path": "",
            "ext": "",
        }

        self.title = ""
        self.uploader = None
        self.features = []
        self.tags = []
        self.uploadDate = 0

    def readFileData(self):
        filename = "".join(self.video["filename"].split(".")[0:-1])
        split_filename = filename.split("-")
        self.uploader = None
        self.features = []
        if len(split_filename) == 1:
            self.title = split_filename[0].strip()
        elif len(split_filename) == 2:
            self.title = split_filename[0].strip()
            split_casters = split_filename[1].split(",")
            self.uploader = MongoDBConnection().getProfileID(
                name=split_casters[0].strip(), accountType="model")
            for i in range(1, len(split_casters)):
                self.features.append(MongoDBConnection().getProfileID(
                    name=split_casters[i].strip(), accountType="model"))
        else:
            self.title = "".join(split_filename[0:-2]).strip()
            self.uploader = MongoDBConnection().getProfileID(
                name=split_filename[-1], accountType="channel")
            split_casters = split_filename[-2].split(",")
            for i in range(0, len(split_casters)):
                self.features.append(MongoDBConnection().getProfileID(
                    name=split_casters[i].strip(), accountType="model"))
        self.uploadDate = int(
            os.path.getctime(os.path.join(
                self.video["dir"], self.video["filename"])) * 1000
        )

    def readVideoProperties(self):
        source_path = os.path.join(self.video["dir"], self.video["filename"])
        clip = VideoFileClip(source_path)

        # return number of frame per second
        self.video["fps"] = clip.reader.fps
        # return number of frame in the video
        self.video["nframes"] = clip.reader.nframes
        # return duration of the video in second
        self.video["duration"] = clip.duration
        self.video["dimensions"] = clip.size
        max_duration = int(clip.duration) - 2
        # here is the time where you want to take the thumbnail at second, it should be smaller than max_duration
        frame_at_second = random.randint(0, max_duration)
        # Gets a numpy array representing the RGB picture of the clip at time frame_at_second
        frame = clip.get_frame(frame_at_second)

        self.thumbnail["filename"] = self.title + ".jpg"
        new_image_filepath = os.path.join(
            VideoHubReader.base_thumbnails_dir, self.thumbnail["filename"]
        )
        new_image = Image.fromarray(frame)  # convert numpy array to image
        new_image.save(new_image_filepath)  # save the image

        self.thumbnail["path"] = self.thumbnail["dir"] + \
            self.thumbnail["filename"]

        clip.close()


class Photo:
    def __init__(self, filename, dir, path, ext) -> None:
        self.title = ""
        self.filename = filename
        self.dir = dir
        self.path = path
        self.ext = ext
        self.dimension = []
        self.tags = []
        self.uploader = ""
        self.features = []
        self.uploaddate = int(
            os.path.getctime(os.path.join(self.dir, self.filename)) * 1000
        )

    def readFileData(self):
        filename = "".join(self.filename.split(".")[0:-1])
        split_filename = filename.split("-")
        self.title = split_filename[0].strip()
        if len(split_filename) > 1:
            split_casters = split_filename[1].split(",")
            self.uploader = MongoDBConnection().getProfileID(
                name=split_casters[0].strip(), accountType="model")
            for i in range(1, len(split_casters)):
                self.features.append(MongoDBConnection().getProfileID(
                    name=split_casters[i].strip(), accountType="model"))
        img = Image.open(self.dir + "\\" + self.filename)
        self.dimension = img.size


class MongoDBConnection:
    def __init__(self) -> None:
        client = pymongo.MongoClient("mongodb://localhost:27017/")
        database = client["VideoHub3"]
        self.VideoCol = database["Video"]
        self.PhotoCol = database["Photo"]
        self.PlaylistCol = database["Playlist"]
        self.ProfileCol = database["Profile"]

    def dropCollections(self):
        try:
            self.VideoCol.drop()
            self.ProfileCol.drop()
            self.PlaylistCol.drop()
            self.PhotoCol.drop()
            print("Collections Dropped")

        except Exception as e:
            print("Failed to drop the collections")
            print("Error", e)

    def createProfile(self, name, accountType) -> str:
        try:
            profile = {}

            profile["name"] = name
            profile["account"] = accountType
            profile["email"] = name.replace(" ", "").lower() + "@videohub.inf"
            profile["password"] = "login1234"
            profile["hashedpassword"] = ""
            profile["profilepicURL"] = "defaults/defaultprofilepic2.jpg"

            profile["playlist"] = []

            profile["video"] = {
                "uploads": [],
                "features": [],
                "likes": [],
                "dislikes": [],
                "watchlater": []
            }

            profile["photo"] = {
                "uploads": [],
                "features": [],
                "likes": [],
                "dislikes": []
            }

            savedProfile = self.ProfileCol.insert_one(profile)
            return savedProfile.inserted_id
        except Exception as e:
            print("Failed to create the Profile")
            print("Error", e)
            return None

    def saveVideo(self, videoData: Video) -> str:
        try:
            newVideo = {}
            newVideo["title"] = videoData.title
            newVideo["video"] = videoData.video
            newVideo["thumbnail"] = videoData.thumbnail
            newVideo["uploader"] = videoData.uploader
            newVideo["features"] = videoData.features
            newVideo["tags"] = videoData.tags
            newVideo["uploaddate"] = videoData.uploadDate

            savedVideo = self.VideoCol.insert_one(newVideo)

            # print("Saved Video to Database", savedVideo.inserted_id)
            return savedVideo.inserted_id
        except Exception as e:
            print("Error Saving VideoData in Database")
            print("Error", e)
            return None

    def savePhoto(self, photoData: Photo) -> str:
        try:
            newPhoto = {}
            newPhoto["title"] = photoData.title

            newPhoto["filename"] = photoData.filename
            newPhoto["dir"] = photoData.dir
            newPhoto["path"] = photoData.path
            newPhoto["ext"] = photoData.ext
            newPhoto["dimension"] = photoData.dimension

            newPhoto["tags"] = []
            newPhoto["uploader"] = photoData.uploader
            newPhoto["features"] = photoData.features
            newPhoto["uploaddate"] = photoData.uploaddate
            savedPhoto = self.PhotoCol.insert_one(newPhoto)

            # print("Saved Photo to Database", savedPhoto.inserted_id)
            return savedPhoto.inserted_id
        except Exception as e:
            print("Error Saving PhotoData in Database")
            print("Error", e)
            return None

    def getProfileID(self, name: str, accountType: str) -> str:
        try:
            profileData = self.ProfileCol.find_one({"name": name})
            if profileData is None:
                return self.createProfile(name=name, accountType=accountType)
            return profileData["_id"]
        except Exception as e:
            print("Error Getting profile id")
            print("Error", e)
            return None

    def updateList_in_Profile(self, profileID: str, listname: str, itemID: str):
        try:
            self.ProfileCol.update_one(
                {"_id": profileID}, {"$push": {listname: itemID}}
            )
        except Exception as e:
            print("Error Updating profile list")
            print("Error", e)


class VideoHubReader:
    ABS_PATH = os.path.abspath(__file__)
    BASE_DIR = os.path.dirname(ABS_PATH)
    absolute_thumbnails_dir = "server/public/uploads/thumbnails"
    absolute_profilepic_dir = "server/public/uploads/profilepics"

    base_thumbnails_dir = os.path.join(BASE_DIR, absolute_thumbnails_dir)
    base_profilepic_dir = os.path.join(BASE_DIR, absolute_profilepic_dir)

    def __init__(self) -> None:
        self.mongoInstance = MongoDBConnection()

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

    def scanFeed(self, folderDir: str, docChoice: str):
        self.createThumbnailsFolder()
        self.videoFileCount = 0
        self.videoSkipCount = 0
        self.photoFileCount = 0
        self.photoSkipCount = 0
        for dirpath, dirs, files in os.walk(folderDir):
            for filename in files:
                dir = dirpath
                path = os.path.join(dirpath, filename)
                ext = filename.split(".")[-1]
                if ext in ["mp4", "mkv", "mov"] and docChoice in [1, 3]:
                    newVideo = Video(filename=filename,
                                     dir=dir, path=path, ext=ext)
                    newVideo.readFileData()
                    newVideo.readVideoProperties()
                    videoID = self.mongoInstance.saveVideo(videoData=newVideo)

                    if videoID is None:
                        self.videoSkipCount += 1
                        print(self.videoSkipCount,
                              ". xSkipped Videox:", filename)
                        continue

                    if newVideo.uploader:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=newVideo.uploader, listname="video.uploads", itemID=videoID)
                    for feature in newVideo.features:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=feature, listname="video.features", itemID=videoID)

                    self.videoFileCount += 1
                    print(self.videoFileCount, ". Saved Video:", filename)

                elif ext in ["jpg", "png", "jpeg"] and docChoice in [1, 2]:
                    newPhoto = Photo(filename=filename,
                                     dir=dir, path=path, ext=ext)
                    newPhoto.readFileData()
                    photoID = self.mongoInstance.savePhoto(photoData=newPhoto)

                    if photoID is None:
                        self.photoSkipCount += 1
                        print(self.photoSkipCount,
                              ". xSkipped Photox:", filename)
                        continue

                    if newPhoto.uploader:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=newPhoto.uploader, listname="photo.uploads", itemID=photoID)
                    for feature in newPhoto.features:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=feature, listname="photo.features", itemID=photoID)

                    self.photoFileCount += 1
                    print(self.photoFileCount, ". Saved Photo:", filename)


while True:
    choice = int(
        input(
            "1. Read Files, Create Thumbnails and Store in db\n2. Drop Collections and Thumbnails Folder\n3. Exit\n"
        )
    )

    auto = VideoHubReader()
    mongoInstance = MongoDBConnection()
    if choice == 1:
        filePath = input("Enter Files Dir Path : ")
        docChoice = int(
            input(
                "1. Both\n2. Photo\n3. Video\n"
            )
        )
        auto.scanFeed(folderDir=filePath, docChoice=docChoice)
    elif choice == 2:
        mongoInstance.dropCollections()
        auto.deleteThumbnails()
    else:
        break
