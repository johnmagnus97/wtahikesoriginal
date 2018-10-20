#note that you need BeautifulSoup and selenium installed in order to run this
#code

import urllib.request, urllib.parse, urllib.error
from bs4 import BeautifulSoup
from selenium import webdriver
import json

def getImages(soup):
    images = soup.findAll("div", {"class", "captioned-image"})
    imagearr = []
    for image in images:
        src = image.findAll("img")[1]["src"]
        imagearr.append(src)
    print(imagearr)
    return imagearr

def hikeinfo(soup, f):
    try:
        name = soup.find("h1", {"class": "documentFirstHeading"}).getText()
    except:
        return #if this hike doesn't even have a name don't add it
    try:
        latlongdiv = soup.find("div", {"class": "latlong"})
        coordinates = latlongdiv.findAll("span")
        lat = coordinates[0].getText()
        lng = coordinates[1].getText()
    except:
        return #if theres no lat and long don't add it
    try:
        rating = soup.find("div", {"class": "current-rating"}).getText().split()[0]
    except:
        rating = "\"unknown\""
    try:
        distance = soup.find("div", {"id": "distance"}).find("span").getText().split()[0]
    except:
        distance = "\"unknown\""
    try:
        elevation = soup.findAll("div", {"class": "hike-stat"})[2].findAll("span")
        gain = elevation[0].getText()
        top = elevation[1].getText()
    except:
        gain = "\"unknown\""
        top = "\"unknown\""
    try:
        image = soup.find("div", {"class": "image-with-caption"}).findAll("img")[1]["src"]
        imagearr = []
        imagearr.append(image)
    except:
        imagearr = []
    try:
        comments = soup.find("div", {"id": "reports_target"}).findAll("div", {"class", "report-text"})
        commentsdate = soup.find("div", {"id": "reports_target"}).findAll("p", {"class", "hike-date"})
        i = 0
        commentarr = []
        for comment in comments:
            commentps = comment.findAll("p")
            commentdate = commentsdate[i].find("span").getText()
            commenttext = ""
            i = i + 1
            for commentp in commentps:
                commenttext = commenttext + commentp.getText()
            commentarr.append({"comment": commenttext, "date":commentdate})
    except:
        commentarr = []
    try:
        reports = soup.find("div", {"id": "reports_target"}).findAll("div", {"class", "thumb-background"})
        print(len(reports))
        for report in reports:
            try:
                url = report.find("a").get("href", None)
                html = urllib.request.urlopen(url).read()
                soup = BeautifulSoup(html, 'html.parser')
                imagearr.extend(getImages(soup))
            except:
                pass
    except:
        pass

    f.write("{\n")
    f.write("\"name\":" + "\"" + name + "\"" + ',\n')
    f.write("\"position\":{\"lat\":" + lat + ", \"lng\":" + lng + "},\n")
    f.write("\"rating\":"  + rating + ',\n')
    f.write("\"distance\":"  + distance + ',\n')
    f.write("\"gain\":"  + gain + ',\n')
    f.write("\"top\":"  + top + ',\n')
    #f.write("\"images\":" + "[" + "\"" + image + "\"" + "]" + ',\n')
    f.write("\"comments\":" + json.dumps(commentarr) + ",\n")
    f.write("\"images\":" + json.dumps(imagearr))
    f.write("},\n")

def listhikes(soup, f):
    hikes = soup.findAll("div", {"class": "search-result-item"})
    for hike in hikes:
        url = hike.find("a", {"class": "listitem-title"}).get("href", None)
        browser = webdriver.Chrome("/Users/johnmagnus/Downloads/chromedriver")
        browser.get(url)
        html = browser.page_source
        soup = BeautifulSoup(html, 'html.parser')
        #html = urllib.request.urlopen(url).read()
        #soup = BeautifulSoup(html, 'html.parser')
        hikeinfo(soup, f)

url = "https://www.wta.org/go-outside/hikes"
print("Retrieving", url)
html = urllib.request.urlopen(url).read()
soup = BeautifulSoup(html, 'html.parser')



f = open("hikes2.txt", "w")
f.write("{\"hikes\":[")
listhikes(soup, f)
while(True):
    pages = soup.find("nav", {"class": "pagination"})
    nextpage = pages.find("li", {"class": "next"})
    if (nextpage == None):
        break
    nextlink = nextpage.find("a").get("href", None)
    url = soup.find("nav", {"class": "pagination"}).find("li", {"class": "next"}).find("a").get("href", None)
    html = urllib.request.urlopen(url).read()
    soup = BeautifulSoup(html, 'html.parser')
    listhikes(soup, f)
f.write("]}")
f.close()
