#!/usr/bin/env python
"""Schema for Photo"""
import os

from PIL import Image
from pyreader.MongoDBConnection import MongoDBConnection


class Photo:
    def __init__(self, filename: str, dir: str, path: str, ext) -> None:
        self.title = ""
        self.filename = filename
        self.dir = dir
        self.path = path
        self.ext = ext
        self.dimension: list[int] = []
        self.tags: set[str] = set()
        self.uploader = None
        self.features: list[int] = []
        self.uploaddate = int(
            os.path.getctime(os.path.join(self.dir, self.filename)) * 1000
        )

    def readFileData(self):
        filename = "".join(self.filename.split(".")[0:-1])
        split_filename = filename.split("-")
        self.title = split_filename[0].strip()
        if len(split_filename) > 1:
            split_casters = split_filename[1].split(",")
            self.tags.add(split_casters[0].strip())
            self.uploader = MongoDBConnection().getProfileID(
                name=split_casters[0].strip(), accountType="model"
            )
            for i in range(1, len(split_casters)):
                self.tags.add(split_casters[i].strip())
                self.features.append(
                    MongoDBConnection().getProfileID(
                        name=split_casters[i].strip(), accountType="model"
                    )
                )
        img = Image.open(self.dir + "\\" + self.filename)
        self.dimension = img.size

        if self.uploader is None:
            self.tags.add("Unknown")
            self.uploader = MongoDBConnection().getProfileID(
                name="Unknown", accountType="user"
            )

        for name in self.title.split():
            if name.isalpha() and name.lower() not in [
                "a",
                "an",
                "at",
                "are",
                "and",
                "for",
                "from",
                "i",
                "is",
                "in",
                "isnt",
                "isn't",
                "on",
                "of",
                "to",
                "the",
                "that",
                "then",
                "than",
                "there",
                "their",
                "those",
                "was",
                "with",
                "when",
                "what",
                "where",
                "whose",
            ]:
                self.tags.add(name)
