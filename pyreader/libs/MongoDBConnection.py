#!/usr/bin/env python
"""Handling MongoDB Connection"""

import pymongo

DATABASEURI  = "mongodb://localhost:27017/"
DATABASENAME = "VideoHub2"

class MongoDBConnection:
    def __init__(self) -> None:
        client = pymongo.MongoClient(DATABASEURI)
        database = client[DATABASENAME]
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

    def createProfile(self, name, accountType):
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
                "watchlater": [],
            }

            profile["photo"] = {
                "uploads": [],
                "features": [],
                "likes": [],
                "dislikes": [],
            }

            savedProfile = self.ProfileCol.insert_one(profile)
            return savedProfile.inserted_id
        except Exception as e:
            print("Failed to create the Profile")
            print("Error", e)
            return None

    def saveVideo(self, videoData):
        try:
            newVideo = {}
            newVideo["title"] = videoData.title
            newVideo["video"] = videoData.video
            newVideo["thumbnail"] = videoData.thumbnail
            newVideo["uploader"] = videoData.uploader
            newVideo["features"] = videoData.features
            newVideo["tags"] = list(videoData.tags)
            newVideo["uploaddate"] = videoData.uploadDate

            savedVideo = self.VideoCol.insert_one(newVideo)

            # print("Saved Video to Database", savedVideo.inserted_id)
            return savedVideo.inserted_id
        except Exception as e:
            print("Error Saving VideoData in Database")
            print("Error", e)
            return None

    def savePhoto(self, photoData):
        try:
            newPhoto = {}
            newPhoto["title"] = photoData.title

            newPhoto["filename"] = photoData.filename
            newPhoto["dir"] = photoData.dir
            newPhoto["path"] = photoData.path
            newPhoto["ext"] = photoData.ext
            newPhoto["dimension"] = photoData.dimension

            newPhoto["tags"] = list(photoData.tags)
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

    def getProfileID(self, name: str, accountType: str):
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

    def checkFileInDB(self, filename: str, filetype: str) -> bool:
        try:
            if filetype.lower() == "video":
                fileData = self.VideoCol.find_one({"video.filename": filename})
            elif filetype.lower() == "photo":
                fileData = self.PhotoCol.find_one({"filename": filename})
            else:
                raise Exception("Invalid Collection name")
            if fileData is None:
                return False
            return True
        except Exception as e:
            print("Error Checking file in db")
            print("Error", e)
            return False
