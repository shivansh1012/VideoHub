#!/usr/bin/env python
"""Schema for Video"""
import os
import random

from moviepy.editor import VideoFileClip
from PIL import Image

from pyreader.MongoDBConnection import MongoDBConnection


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
        self.tags = set()
        self.uploadDate = 0

    def analyzeFileName(self):
        filename = "".join(self.video["filename"].split(".")[0:-1])
        split_filename = filename.split("-")
        if len(split_filename) == 1:
            self.title = split_filename[0].strip()
        elif len(split_filename) == 2:
            self.title = split_filename[0].strip()
            split_casters = split_filename[1].split(",")
            self.uploader = MongoDBConnection().getProfileID(
                name=split_casters[0].strip(), accountType="model")
            self.tags.add(split_casters[0].strip())
            for i in range(1, len(split_casters)):
                self.features.append(MongoDBConnection().getProfileID(
                    name=split_casters[i].strip(), accountType="model"))
                self.tags.add(split_casters[i].strip())
        else:
            self.title = "".join(split_filename[0:-2]).strip()
            self.uploader = MongoDBConnection().getProfileID(
                name=split_filename[-1].strip(), accountType="channel")
            self.tags.add(split_filename[-1].strip())
            split_casters = split_filename[-2].split(",")
            for i in range(0, len(split_casters)):
                self.features.append(MongoDBConnection().getProfileID(
                    name=split_casters[i].strip(), accountType="model"))
                self.tags.add(split_casters[i].strip())
        self.uploadDate = int(
            os.path.getctime(os.path.join(
                self.video["dir"], self.video["filename"])) * 1000
        )

        if self.uploader == None:
            self.tags.add("Unknown")
            self.uploader = MongoDBConnection().getProfileID(
                name="Unknown", accountType="user")

        for name in self.title.split():
            if(name.isalpha() and name.lower() not in [
                "a", "an", "at", "are", "and",
                "for", "from",
                "i", "is", "in", "isnt", "isn't",
                "on",
                "to", "the", "that", "then", "than", "there", "their", "those",
                    "was", "with", "when", "what", "where", "whose"]):
                self.tags.add(name)

    def readVideoProperties(self, base_thumbnails_dir: str):
        source_path = os.path.join(self.video["dir"], self.video["filename"])
        clip = VideoFileClip(source_path)

        # return number of frame per second
        self.video["fps"] = clip.reader.fps
        # return number of frame in the video
        self.video["nframes"] = clip.reader.nframes
        # return duration of the video in second
        self.video["duration"] = clip.duration
        self.video["dimensions"] = clip.size
        max_duration = int(clip.duration) - 1

        while True:
            try:
                # here is the time where you want to take the thumbnail at second, it should be smaller than max_duration
                frame_at_second = random.randint(1, max_duration)
                # Gets a numpy array representing the RGB picture of the clip at time frame_at_second
                frame = clip.get_frame(frame_at_second)
                break
            except Exception as e:
                pass

        self.thumbnail["filename"] = self.title + ".jpg"
        new_image_filepath = os.path.join(
            base_thumbnails_dir, self.thumbnail["filename"]
        )
        new_image = Image.fromarray(frame)  # convert numpy array to image
        new_image.save(new_image_filepath)  # save the image

        self.thumbnail["path"] = self.thumbnail["dir"] + \
            self.thumbnail["filename"]

        clip.close()
