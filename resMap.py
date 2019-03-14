#!/usr/bin/python
# -*- coding: UTF-8 -*-

import os
import sys
import re

if sys.getdefaultencoding() != "utf-8":
    reload(sys)
    sys.setdefaultencoding("utf-8")

root = os.getcwd()
texturePath = root + "/assets/resources/texture"
tsPath = root + "/assets/scripts/core/constant"


def readFile(filePath):
    if os.path.exists(filePath):
        with open(filePath, "rb") as f:
            return f.read()
    else:
        return None


def createResTs(data):
    filePath = tsPath + "/UIResMap.ts"
    with open(filePath, "w") as f:
        f.write(data)
        print("create file %s success!!!" % filePath)


def processAtlas(atlas):
    filePath = texturePath + "/" + atlas + ".plist"
    fileContent = readFile(filePath)
    if not fileContent:
        print("file %s is not exists!!!!!!!!!" % filePath)
        return

    frames = re.findall(r'<key>\w*.png</key>', fileContent)
    resName = "texture/" + atlas
    atlasCode = ""
    for frame in frames:
        frame = re.search(r'\w*.png', frame).group()
        lineData = "\n    [\"%s\"]: { [\"resName\"]: \"%s\", [\"resType\"]: cc.SpriteAtlas }," % (frame, resName)
        atlasCode += lineData

    return atlasCode


def processSingle(locPng):
    resName = "texture/" + locPng
    lineData = "\n    [\"%s\"]: { [\"resName\"]: \"%s\", [\"resType\"]: cc.SpriteFrame }," % (locPng + ".png", resName)

    return lineData


def createResMap():
    plistArr = []
    pngArr = []

    for f in os.listdir(texturePath):
        endStr = os.path.splitext(f)
        if endStr[-1] == ".plist":
            plistArr.append(endStr[0])
        elif endStr[-1] == ".png":
            pngArr.append(endStr[0])

    singleArr = []
    for png in pngArr:
        flag = False
        for plist in plistArr:
            if png == plist:
                flag = True
                break
        if not flag:
            singleArr.append(png)

    resMap = "\nlet UIResMap = {"

    for atlas in plistArr:
        resMap += processAtlas(atlas)

    for locPng in singleArr:
        resMap += processSingle(locPng)

    resMap += "\n};\n\nexport default UIResMap;\n"

    createResTs(resMap)


if __name__ == "__main__":
    createResMap()