#!/usr/bin/env python
"""Walks through the Specfied folder and generates data and thumbnail for all the video files found
in the folder and the sub-folders. The generated data is stored in the mongodb.

The VideoFiles in specified folder are scanned and the details of video files are
inserted into the MongoDB and A thumbnail is generated for the same in "./thumbnails" Folder"""

import os
import shutil

from pyreader.MongoDBConnection import MongoDBConnection
from pyreader.Photo import Photo
from pyreader.Video import Video

__author__ = "Shivansh Pandey"
__copyright__ = "MIT"
__credits__ = ["shivansh1012"]
__license__ = "GPL"
__version__ = "2.0.0"
__maintainer__ = "shivansh1012"
__status__ = "Development"


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

    def scanFeed(self, folderDir: str, docChoice: int):
        self.createThumbnailsFolder()
        self.videoFileCount = 0
        self.videoSkipCount = 0
        self.photoFileCount = 0
        self.photoSkipCount = 0
        for dirpath, dirs, files in os.walk(folderDir):
            for filename in files:
                dir = dirpath
                if dir.find("Ignore") != -1:
                    break
                path = os.path.join(dirpath, filename)
                ext = filename.split(".")[-1]
                if ext in ["mp4", "mkv", "mov"] and docChoice in [1, 3]:
                    if self.mongoInstance.checkFileInDB(
                        filename=filename, filetype="video"
                    ):
                        self.videoSkipCount += 1
                        print(self.videoSkipCount, "Video Already Present", filename)
                        continue

                    newVideo = Video(filename=filename, dir=dir, path=path, ext=ext)
                    newVideo.analyzeFileName()
                    newVideo.readVideoProperties(
                        base_thumbnails_dir=self.base_thumbnails_dir
                    )
                    videoID = self.mongoInstance.saveVideo(videoData=newVideo)

                    if videoID is None:
                        self.videoSkipCount += 1
                        print(self.videoSkipCount, ". xSkipped Videox:", filename)
                        continue

                    if newVideo.uploader:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=newVideo.uploader,
                            listname="video.uploads",
                            itemID=videoID
                        )
                    for feature in newVideo.features:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=feature, listname="video.features", itemID=videoID
                        )

                    self.videoFileCount += 1
                    print(self.videoFileCount, ". Saved Video:", filename)

                elif ext in ["jpg", "png", "jpeg"] and docChoice in [1, 2]:
                    if self.mongoInstance.checkFileInDB(
                        filename=filename, filetype="photo"
                    ):
                        self.photoFileCount += 1
                        print(self.photoFileCount, "Photo Already Present", filename)
                        continue

                    newPhoto = Photo(filename=filename, dir=dir, path=path, ext=ext)
                    newPhoto.readFileData()
                    photoID = self.mongoInstance.savePhoto(photoData=newPhoto)

                    if photoID is None:
                        self.photoSkipCount += 1
                        print(self.photoSkipCount, ". xSkipped Photox:", filename)
                        continue

                    if newPhoto.uploader:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=newPhoto.uploader,
                            listname="photo.uploads",
                            itemID=photoID
                        )
                    for feature in newPhoto.features:
                        self.mongoInstance.updateList_in_Profile(
                            profileID=feature, listname="photo.features", itemID=photoID
                        )

                    self.photoFileCount += 1
                    print(self.photoFileCount, ". Saved Photo:", filename)


while True:
    choice = int(
        input(
            "1. Read Files, Create Thumbnails and Store in db\n2. Drop Collections\n3. Thumbnails Folder\n4. Exit\n"
        )
    )

    auto = VideoHubReader()
    mongoInstance = MongoDBConnection()
    if choice == 1:
        filePath = input("Enter Files Dir Path : ")
        docChoice = int(input("1. Both\n2. Photo\n3. Video\n"))
        auto.scanFeed(folderDir=filePath, docChoice=docChoice)
    elif choice == 2:
        mongoInstance.dropCollections()
    elif choice == 3:
        auto.deleteThumbnails()
    else:
        break
