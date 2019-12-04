import cv2
import numpy as np
import screeninfo

#circle_loc=[]
frame = cv2.imread('/Users/lauren/Pictures/MLS/final/circles/circles7.png')
res = cv2.resize(frame, None, fx=.5, fy=.5)
gray = cv2.cvtColor(res, cv2.COLOR_BGR2GRAY)
grey= cv2.cvtColor(gray,cv2.COLOR_GRAY2RGB)
print(grey.shape)

project = np.zeros([722,1282,3],dtype=np.uint8)
project.fill(255)

circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, 20, param1=50, param2=20, minRadius=0, maxRadius=20)
for i in circles[0, :]:
    # draw the outer circle
    cv2.circle(grey, (i[0], i[1]), i[2], (255, 255, 255), 2)
    # draw the center of the circle
    a=int(round(i[2]/8))
    b=int(round(i[0]+a*2.5))
    cv2.circle(grey, (b, i[1]), a, (0, 0, 255), 2)
    cv2.circle(project, (b, i[1]), a, (0, 0, 255), 2)
    #cv2.circle(grey, (i[0], i[1]), 2, (255, 255, 255), 3)
    #cv2.circle(grey, int(round(a)), int(i[1]), int(round(r_n)), (255, 0, 0), 1)

edges = cv2.Canny(gray,50,150,apertureSize = 3)
lines = cv2.HoughLinesP(edges,1,np.pi/180,100,minLineLength=20,maxLineGap=15)

for x1,y1,x2,y2 in lines[:,0,:]:
    cv2.line(grey,(x1,y1),(x2,y2),(0,255,0),2)
    if ((y2-y1)/(x2-x1))<1:
        cv2.rectangle(grey, (x1,y1+4),(x1+12,y1-4), (255,0,0), -1)
    else:
        cv2.rectangle(grey, (x1-4, y1), (x1+4, y1+12), (255, 0, 0), -1)



#cv2.imwrite('/Users/lauren/Pictures/MLS/final/circles/houghlines.jpg',res)

# detector = cv2.SimpleBlobDetector()
# detector.detect(gray)
# im_with_keypoints = cv2.drawKeypoints(im, keypoints, np.array([]), (0,0,255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)

imgray = cv2.cvtColor(grey, cv2.COLOR_BGR2GRAY)
ret, thresh = cv2.threshold(imgray, 127, 255, 0)
contours, hierarchy = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
for i in range(len(contours)):
    cnt=contours[i]
    x,y,w,h = cv2.boundingRect(cnt)
    cv2.rectangle(grey,(x-6,y-6),(x+w+6,y+h+6),(0,255,255),2)
    # (x1,y1),radius = cv2.minEnclosingCircle(cnt)
    # center = (int(x1),int(y1))
    # radius = int(radius)
    # cv2.circle(grey,center,radius,(0,255,0),2)

# (x,y),radius = cv.minEnclosingCircle(cnt)
# center = (int(x),int(y))
# radius = int(radius)
# cv.circle(img,center,radius,(0,255,0),2)

window_name = 'projector'
# from screeninfo import get_monitors
# for m in get_monitors():
#     print(str(m))
# screen = screeninfo.get_monitors()[0]
cv2.namedWindow(window_name, cv2.WND_PROP_FULLSCREEN)
cv2.moveWindow(window_name, 1920, 1080)
cv2.setWindowProperty(window_name, cv2.WND_PROP_FULLSCREEN,cv2.WINDOW_FULLSCREEN)
cv2.imshow(window_name, project)
cv2.waitKey(0)
cv2.destroyAllWindows()

cv2.imshow('gray',grey)
cv2.waitKey(0)
# toDisplay = res
# cv2.imshow('frame', toDisplay)
