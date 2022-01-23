import os
import shutil
import re
import pymongo
from moviepy.editor import * # import everythings (variables, classes, methods...) inside moviepy.editor
from PIL import Image

class Automation:
    def __init__(self) -> None:
        ABS_PATH = os.path.abspath(__file__) # get the chemin for this current file
        BASE_DIR = os.path.dirname(ABS_PATH)  # get the chemin for this current directory
        self.thumbnails_dir = os.path.join(BASE_DIR, 'webapp\\public\\thumbnails')

        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["VideoHub"]
        self.videoMetaData = mydb["VideoMetaData"]
        self.modelMetaData = mydb["ModelMetaData"]
        self.channelMetaData = mydb["ChannelMetaData"]
    
    def dropCollections(self, deleteVideoMetaData = 1, deleteModelMetaData = 1, deleteChannelMetaData = 1) -> bool:
        try:
            if(deleteVideoMetaData): 
                self.videoMetaData.drop();
                print("videoMetaData Collection Dropped")
            if(deleteModelMetaData): 
                self.modelMetaData.drop();
                print("modelMetaData Collection Dropped")
            if(deleteChannelMetaData): 
                self.channelMetaData.drop();
                print("channelMetaData Collection Dropped")
            return True
        except:
            print("Couldnt drop the Collection")
            return False

    def deleteThumbnails(self):
        try:
            shutil.rmtree(self.thumbnails_dir)
            print("Thumbnails Deleted")
            return True
        except OSError as error:
            print(error)
            print("Thumbnails deletion failed")
            return False
    
    def createThumbnailsFolder(self):
        try:
            os.makedirs(self.thumbnails_dir, exist_ok=True) # create the folder 'thumbnails'  at Ex : path/to/your/project/folder/data/outputs/thumbnails 
            print("Thumbnails Folder Created")
            return True
        except OSError as error:
            print(error)
            print("Thumbnails Folder Creation Failed")
            return False
    
    def createModel(self, name) -> str:
        model={}
        model['name'] = name
        model['videoList'] = []

        saveModel = self.modelMetaData.insert_one(model)
        return saveModel.inserted_id
        
    def createChannel(self, name) -> str:
        channel={}
        channel['name'] = name
        channel['videoList'] = []

        saveChannel = self.channelMetaData.insert_one(channel)
        return saveChannel.inserted_id

    def getVideoBasicData(self, dirpath, filename):
        dirpath=dirpath.replace("\\","/")
        noExtFileName = filename[0:-4]
        fileExt = filename[-4:]
        channel="Unknown"
        newFileName = noExtFileName
        if(noExtFileName[0]=="["):
            channel=noExtFileName.split("]")[0][1:].strip()
            newFileName = noExtFileName.split("]")[1].strip()
        path = os.path.join(dirpath,filename).replace("\\","/")

        model=[]
        try:
            modelSplitup = re.split('[-]',newFileName)[1].strip().split(',')
            cleanFileName = re.split('[-]',newFileName)[0]
            for m in modelSplitup:
                model.append(m.strip())
        except:
            cleanFileName=newFileName
            if(dirpath.find("Models")!=-1):
                model=[channel]
            else:
                model=[]
                
        tag = [t for t in cleanFileName.split() if len(t) >= 3]
        # tag.extend([channel])
        # tag.extend(model)

        return cleanFileName,dirpath,path,channel,list(set(tag)),model
    
    def getVideoProperties(self, dirpath, filename, cleanFileName, createThumbnail):
        # noExtFileName = filename[0:-4]

        # newFileName = noExtFileName
        # if(noExtFileName[0]=="["):
        #     newFileName = noExtFileName.split("]")[1].strip()
        
        VIDEOFILENAME = filename
        source_path = os.path.join(dirpath, VIDEOFILENAME) # get the path to our sample video
        
        clip = VideoFileClip(source_path) #

        fps = clip.reader.fps # return number of frame per second
        nframes = clip.reader.nframes # return number of frame in the video
        duration = clip.duration # return duration of the video in second
        dimensions = clip.size
        max_duration = int(clip.duration) + 1 
        frame_at_second = 28 # here is the time where you want to take the thumbnail at second, it should be smaller than max_duration
        frame = clip.get_frame(frame_at_second) # Gets a numpy array representing the RGB picture of the clip at time frame_at_second 
        
        if(createThumbnail):
            new_image_filepath = os.path.join(self.thumbnails_dir,f"{cleanFileName}.jpg")
            new_image = Image.fromarray(frame ) # convert numpy array to image
            new_image.save(new_image_filepath) # save the image

        clip.close()

        return fps, nframes, duration, dimensions
    
    def saveVideoMetaData(self, newFileName, originalFileName, videoDirPath, videoPath, channel, tagList, modelList, fps, nframes, duration, dimensions):
        video={}
        video['filename'] = newFileName
        video['originalfilename'] = originalFileName
        video['dir'] = videoDirPath
        video['path'] = videoPath
        video['channel'] = channel
        video['tags'] = tagList
        video['model'] = modelList
        video['fps'] = fps
        video['nframes'] = nframes
        video['duration'] = duration
        video['dimensions'] = dimensions
        savedVideo = self.videoMetaData.insert_one(video)
        return savedVideo.inserted_id

    def Automate(self, path:str, saveDataInDB:int = 1, createThumbnail:int = 1) -> int:
        if(createThumbnail): self.createThumbnailsFolder()
        fileCount = 0
        for dirpath, dirs, files in os.walk(path):
            for filename in files:
                if(filename[-4:] not in [".mp4",".mkv"]): continue

                newFileName, videoDirPath, videoPath, channel, tagList, modelList = self.getVideoBasicData(dirpath, filename)
                
                fps, nframes, duration, dimensions = self.getVideoProperties(dirpath, filename, newFileName, createThumbnail)
                
                if(saveDataInDB):
                    if(dirpath.find("Groups")):
                        channelData = self.channelMetaData.find_one({"name":channel})
                        if(channelData==None):
                            channelID = self.createChannel(channel)
                        else:
                            channelID = channelData["_id"]
                        modelListIDs=[]
                        for model in modelList:
                            modelData = self.modelMetaData.find_one({"name":model})
                            if(modelData==None):
                                modelListIDs.append(self.createModel(model))
                            else:
                                modelListIDs.append(modelData["_id"])
                        
                    videoID = self.saveVideoMetaData(newFileName, filename,videoDirPath, videoPath, channelID, tagList, modelListIDs, fps, nframes, duration, dimensions)
                    
                    self.channelMetaData.update_one({"_id":channelID}, {"$push": {"videoList": videoID} });

                    for modelID in modelListIDs:
                        self.modelMetaData.update_one({"_id": modelID}, {"$push": {"videoList": videoID}});

                fileCount+=1

                print("File Number:"+str(fileCount), newFileName, channel);

while(1):
    choice = int(input("1. Insert Data and Create Thumbnails\n2. Drop Collections and Thumbnails\n3. Exit\n"))

    auto = Automation();
    if(choice==1):
        commands = list(map(int,input().split()))
        if(commands==[]):
            auto.Automate(".\Files")
        else:
            auto.Automate(".\Files", commands[0], commands[1])
    elif(choice==2): 
        commands = list(map(int,input().split()))
        if(commands==[]):
            auto.dropCollections()
            auto.deleteThumbnails()
        elif(commands[0]==1):
            auto.dropCollections()
        elif(commands[1]==1):
            auto.deleteThumbnails()
    else: break
