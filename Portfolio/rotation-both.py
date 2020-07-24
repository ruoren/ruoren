import pickle
import numpy as np
import cv2
import pyglet
from pyglet.window import key
import threading
import time
import imutils

# # openCV image constants
boxsize = 120
imageWidth = 1920
imageHeight = 1080
boxleft = imageWidth/2 - boxsize/2
boxright = imageWidth/2 + boxsize/2
boxtop = imageHeight/2 - boxsize/2
boxbottom = imageHeight/2 + boxsize/2
squaredoff = np.array([ [boxleft,boxtop], [boxright,boxtop], [boxright,boxbottom], [boxleft,boxbottom]], dtype="float32")
fullscreenbox = np.array([ [0,0], [1920,0], [1920,1080], [0,1080]], dtype="float32")

polycorners = pickle.load(open( "poly.p", "rb" ))
mrkrcorners = pickle.load(open( "marker.p", "rb" ))
# mrkrcorners = pickle.load(open( "pmarker.p", "rb" ))
rectcorners = pickle.load(open( "rect.p", "rb" ))

# get corners to crop:
left = rectcorners[0][1].astype(int)
right = rectcorners[2][1].astype(int)
up = rectcorners[0][0].astype(int)
down = rectcorners[2][0].astype(int)

# pyglet output image
display = pyglet.canvas.get_display()
screens = display.get_screens()
projectorscreen = screens[0]
window = pyglet.window.Window(width= 1920, height= 1080, fullscreen=True, screen= projectorscreen, resizable=False)
keys = key.KeyStateHandler()
window.push_handlers(keys)

white = pyglet.image.load('white.jpg')
outputimg = white
warpedOut = white
done = False
frame = None
# croppedFrame = None

doShapes = False
doInteract = False
doPredict = False
doMarker = False

@window.event
def on_key_press(symbol, modifiers):

    global done
    global doShapes
    global doInteract
    global doMarker
    global doPredict
    # Symbolic names:
    if symbol == key.Q:
        print("Quit")
        done = True
    if symbol == key.S:
        print("Shape")
        doMarker = False
        doPredict = False
        doInteract = False
        doShapes = True
    if symbol == key.I:
        print("Interact")
        doMarker = False
        doPredict = False
        doShapes = False
        doInteract = True
    if symbol == key.P:
        print("Predict")
        doInteract = False
        doShapes = False
        doMarker = False
        doPredict = True
    if symbol == key.M:
        print("Marker")
        doInteract = False
        doShapes = False
        doPredict = False
        doMarker = True




@window.event
def on_draw():
    global outputimg
    window.clear()
    warpedOut.blit(0,0,0)

# rotate input frame
def rotateFrame(frame, mrkrcorners):
    global imageWidth
    global imageHeight
    global squaredoff
    warpmtx = cv2.getPerspectiveTransform(mrkrcorners, squaredoff)
    rotframe = cv2.warpPerspective(frame, warpmtx, (imageWidth,imageHeight))
    return rotframe

# rotate output frame
def rotateOut(inputimg, mrkrcorners, polycorners, rectcorners):
    global fullscreenbox
    global squaredoff

    # to unrotate the image we need to reverse this transform
    warpmtx = cv2.getPerspectiveTransform(mrkrcorners, squaredoff)

    # place the output into the right perspective in the flat image
    fullToRectmtx = cv2.getPerspectiveTransform( fullscreenbox, rectcorners)

    # to stretch the unrotated image back to full screen for projection
    polyToFullmtx = cv2.getPerspectiveTransform( polycorners, fullscreenbox)

    # load output image
    testshape = cv2.imread(inputimg,cv2.IMREAD_COLOR)
    # testshape = cv2.imread('lastrect.jpg',cv2.IMREAD_COLOR)

    # scale the output down into the rectangle
    testout = cv2.warpPerspective(testshape,fullToRectmtx,(1920,1080))
    cv2.imwrite("testout.jpg",testout)

    # unrotate the image
    unrotout = cv2.warpPerspective(testout, warpmtx, (1920,1080), flags=cv2.WARP_INVERSE_MAP)
    cv2.imwrite("unrot.jpg",unrotout)

    #unwarp the image
    warptestout = cv2.warpPerspective(unrotout,polyToFullmtx,(1920,1080))
    cv2.imwrite("warptestout.jpg", warptestout)



clfhand = pickle.load (open("sliderreg.p", "rb" ))
# regression_model_hand = pickle.load (open("sliderreg.p", "rb" ))
#ipdb.set_trace()
def slider(inframe):
    # reading=[]
    # data = []
    global outputimg
    i=0
    # global reading
    # global data

    # while(True):
    toProj =  cv2.imread('output.jpg',cv2.IMREAD_COLOR)
    for shape in shapes:
        print(shape[len(shape)-1])
        if(shape[len(shape)-1]=="line"):
            print(shape[1])
            # toProj = inframe
            # draw bounding box on projector
            # toProj = cv2.rectangle(toProj,
            #                         ( shape[1][0],shape[1][1] ),
            #                         ( shape[1][2],shape[1][3] ),
            #                         (0,255,0),2)

            # Capture frame-by-frame - slider 16:9
            # ret, frame = cap.read()
            handframe= cv2.rectangle(inframe,
                                    ( shape[1][0],shape[1][1] ),
                                    ( shape[1][2],shape[1][3] ),
                                    (0,255,0),2)

            # handframe= cv2.rectangle(inframe,(400,200),(1120,605),(0,255,0),2)

            # handframe= cv2.rectangle(inframe,(80,200),(880,650),(0,255,0),2)
            #roi = im[y1:y2, x1:x2]
            roi = handframe[shape[1][1]-20:shape[1][3]+20, shape[1][0]-20:shape[1][2]+20]
            # roi = handframe[200:650, 80:880]

            # toProj =  cv2.imread('border.jpg',cv2.IMREAD_COLOR)

            toDisplay = handframe
            # data.append(toDisplay)


            ##predict seciton ##

            def Harshedge(k):                               # first part of pipeline
                gray = cv2.cvtColor(k, cv2.COLOR_BGR2GRAY) # convert to grayscale
                blur = cv2.blur(gray, (1, 1)) # blur the image
                ret, thresh = cv2.threshold(blur, 175, 255, cv2.THRESH_BINARY)
                return thresh

            out=[]
            y=0
            fv=[]
            k=[]
            i=0
            total_feature=[]

            img=roi
            y = cv2.resize(img,(40,22)) # resizing images #40 x 40

            #y = Master_List[62]
            edges = cv2.Canny(y,30,200)
            fv = np.reshape(edges,(880,1))
            fv = fv[:,0]
            #print(len(fv))
            #out.append(fv)
            # k = Harshedge(y)
            # fv1 = np.reshape(k,(880,1))
            # fv1 = fv1[:,0]
            for v in range(0,len(fv)):
                total_feature.append(fv[v])
            # for v in range(0,len(fv1)):
            #     total_feature.append(fv1[v])
            out.append(total_feature)
            total_feature=[]

            # clf.predict(out)

            result = clfhand.predict(out)
            if(result == -1):
                result = "no hand"
            else:
                result = str(result)
            # result1 = str(regression_model.predict(out))

            font = cv2.FONT_HERSHEY_SIMPLEX

            cv2.putText(handframe,result,(100,100), font, 4, (0,255,0), 3, cv2.LINE_AA)
            cv2.putText(toProj,result,(shape[1][0],shape[1][1]), font, 4, (255,255,255), 3, cv2.LINE_AA)
            #cv2.putText(frame,result1,(200,200), font, 4, (255,0,0), 3, cv2.LINE_AA)

            ## End of ML predict secion ##

            cv2.imwrite('output.jpg',toProj)

            ##camera showing section##
            toDisplay = handframe
            # data.append(toDisplay)
            # cv2.imshow('input',toDisplay)
            return(toDisplay)
            ## camera done section ##

            # if cv2.waitKey(1) & 0xFF == ord('q'):
            #     break





clfrotary = pickle.load (open("rotary.p", "rb" ))

def rotary(inframe):
    # Capture frame-by-frame
    global outputimg
    toProj =  cv2.imread('output.jpg',cv2.IMREAD_COLOR)

    for shape in shapes:
        if(shape[len(shape)-1]=="circle"):
            print(shape[2])
            # toProj = cv2.rectangle(toProj,
            #                         (shape[2][0].astype(int)-60,shape[2][1].astype(int)-60),
            #                         (shape[2][2].astype(int)+60,shape[2][3].astype(int)+60),
            #                         (0,255,0),2)

            # inframe= cv2.rectangle(inframe,
            #                         (shape[2][0].astype(int)-30,shape[2][1].astype(int)-30),
            #                         (shape[2][2].astype(int)+30,shape[2][3].astype(int)+30),
            #                         (0,255,0),2)
            # #roi = im[y1:y2, x1:x2]
            # roi = inframe[shape[2][1].astype(int):shape[2][3].astype(int),
            #              shape[2][0].astype(int):shape[2][2].astype(int)]

            # toProj = cv2.rectangle(toProj,
            #                         (shape[2][0]-60,shape[2][1]-60),
            #                         (shape[2][2]+60,shape[2][3]+60),
            #                         (0,255,0),2)

            inframe= cv2.rectangle(inframe,
                                    (shape[2][0]-30,shape[2][1]-30),
                                    (shape[2][2]+30,shape[2][3]+30),
                                    (0,255,0),2)
            #roi = im[y1:y2, x1:x2]
            roi = inframe[shape[2][1]:shape[2][3],
                         shape[2][0]:shape[2][2]]


            toDisplay = inframe
            # data.append(toDisplay)


            ##predict seciton ##

            def Harshedge(k):                               # first part of pipeline
                gray = cv2.cvtColor(k, cv2.COLOR_BGR2GRAY) # convert to grayscale
                blur = cv2.blur(gray, (1, 1)) # blur the image
                ret, thresh = cv2.threshold(blur, 175, 255, cv2.THRESH_BINARY)
                return thresh

            out=[]
            y=0
            fv=[]
            k=[]
            i=0
            total_feature=[]
            img = roi                   # ROI - rectangle - is being read as the circle detection area
            y = cv2.resize(img,(40,40)) # resizing images #40 x 40

            edges = cv2.Canny(y,30,200)
            fv = np.reshape(edges,(1600,1))
            fv = fv[:,0]
            #print(len(fv))
            #out.append(fv)
            # k = Harshedge(y)
            # fv1 = np.reshape(k,(1600,1))
            # fv1 = fv1[:,0]
            for v in range(0,len(fv)):
                total_feature.append(fv[v])
            # for v in range(0,len(fv1)):
            #     total_feature.append(fv1[v])
            out.append(total_feature)
            total_feature=[]

            # print(clfrotary.predict(out))
            font = cv2.FONT_HERSHEY_SIMPLEX
            result = clfrotary.predict(out)
            # result = str(clfrotary.predict(out)[0])

            if(result == -1):
                result = "no hand"
            else:
                result = str(result)

            cv2.putText(toProj,result,
                        ( shape[2][0]+70, shape[2][1]-70),
                        font, 5, (255,255,255), 3, cv2.LINE_AA)
            cv2.putText(inframe,result,(100,100), font, 5, (0,0,0), 3, cv2.LINE_AA)

    ## End of ML predict secion ##

    cv2.imwrite('output.jpg',toProj)
    ##camera showing section##
    toDisplay = inframe
    # data.append(toDisplay)
    return(toDisplay)
    # cv2.imshow('input',toDisplay)
    ## camera done section ##

def findshapes(croppedFrame):
    global shapes
    global project
    # global croppedFrame
    global done

    if(not done):
        if(croppedFrame is None):
            print("None type")
        #take this out if other way works
        print("test")

        if len(project)>0:
            project = np.zeros([1080,1920,3],dtype=np.uint8)
            project.fill(0)
            project = cv2.rectangle(project,(0,0),(1919,1079),(255,255,255),5)
            cv2.imwrite('output.jpg',project)
            print("projected")




        gray = cv2.cvtColor(croppedFrame, cv2.COLOR_BGR2GRAY)
        grey= cv2.cvtColor(gray,cv2.COLOR_GRAY2RGB)
        ratio_sm = float(grey.shape[0])/project.shape[0]
        ratio = project.shape[0] // float(grey.shape[0])

        #probably make some if loop for shape detection, if no one is in frame
        #for now on key press? but to run the thread itself

        ##SHAPE DETECTION GOES HERE#

        #shapes=[shape variables, shape project, shape bound, shape type]
        #code to mask pre-existing shapes
        if len(shapes) !=0:
            for shape_ in shapes:
                mask = np.zeros([1080,1920],dtype=np.uint8)
                mask.fill(0)
                shapevar=shape_[0]
                if shape_[3]=="circle":
                    cv2.circle(mask, (shapevar[0], shapevar[1]), (shapevar[2]+35), (255, 255, 255), -1)
                elif shape_[3]=="line":
                    cv2.line(mask,(shapevar[0]-10,shapevar[1]),(shapevar[2]-10,shapevar[3]),(255,255,255),25)
                #elseif other shapes HERE
                #mask = np.asarray(mask*255, dtype=np.uint8)
                grey = cv2.inpaint(grey,mask,3,cv2.INPAINT_TELEA)
                cv2.imshow('grey',grey)
                cv2.waitKey(0)

        #code to process image and check for shapes
        #probably should check for circles first, if size of circles=0, then check for shapes, if no shapes then check for lines


        gray = cv2.cvtColor(grey, cv2.COLOR_BGR2GRAY)
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        threshold=int(np.mean(blurred))
        thresh = cv2.threshold(gray, threshold-15, 255, cv2.THRESH_BINARY)[1]
        thresh= ~thresh

        ###circle detection
        # circles = cv2.HoughCircles(gray, cv2.HOUGH_GRADIENT, 1, 20, param1=50, param2=20, minRadius=20, maxRadius=20)
        circles = cv2.HoughCircles(thresh, cv2.HOUGH_GRADIENT, 1, 200, param1=30, param2=30, minRadius=20, maxRadius=300)
        cir=[]
        # print(circles)
        if not (circles is None):
            for i in circles[0, :]:
                # draw the outer circle
                # print(i[0], i[1], i[2])
                # cv2.circle(project, (i[0], i[1]), i[2], (0, 0, 255), 2)

                #making small circle to project
                #shapes=[shape variables, shape project, shape bound, shape type]

                cir.append([i[0], i[1], i[2]])
                a=int(round(i[2]/8))#*ratio
                b=int(round(i[0]+a*5))#*ratio
                cv2.circle(project, (b, i[1]), a, (0, 0, 255), 2)
                cir.append([b, i[1], a])
                cir.append([int(i[0]-i[2]-5), int(i[1]-i[2]-5), int(i[0]+i[2]+5), int(i[1]+i[2]+5)])
                cir.append("circle")
                shapes.append(cir)
                # cv2.imwrite('output.jpg',project)
                # print(a,b,ratio, i[1])
                #cv2.circle(project, (b.astype("int"), (i[1].astype("int")*ratio.astype("int"))), a.astype("int"), (0, 0, 255), 2)
                #cover up with inpaint????

        # ###general shape detection
        # cnts, h = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

        # cnts = imutils.grab_contours([cnts, h])
        # sd = ShapeDetector()
        # # loop over the contours
        # shp=[]
        # for c in cnts:
        #     # compute the center of the contour, then detect the name of the
        #     # shape using only the contour
        #     M = cv2.moments(c)
        #     # print(M["m00"])
        #     cX = int((M["m10"] / M["m00"]) * ratio)
        #     cY = int((M["m01"] / M["m00"]) * ratio)
        #     shape = sd.detect(c)
        #     # multiply the contour (x, y)-coordinates by the resize ratio,
        #     # then draw the contours and the name of the shape on the image
        #     c = c.astype("float")
        #     c *= ratio
        #     c = c.astype("int")
        #     #shapes=[shape variables, shape project, shape bound, shape type]
        #     shp.append(c)
        #     shp.append(c)#change to be larger or smaller
        #     shp.append(c)# change to be a square
        #     shp.append("shape")
        #     shapes.append(cir)
        #     cv2.drawContours(project, [c], -1, (0, 255, 0), -1)
        #     cv2.putText(project, shape, (cX, cY), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 0), 2)

        ###line detection
        lin=[]
        edges = cv2.Canny(thresh,50,150,apertureSize = 3)
        lines = cv2.HoughLinesP(edges,1,np.pi/180,100,minLineLength=20,maxLineGap=60)
        if not (lines is None):
            x1=int(min(lines[:,0,0]))
            y1=int(np.mean(lines[:,0,1]))
            x2=int(max(lines[:,0,2]))
            y2=int(np.mean(lines[:,0,3]))
            cv2.line(grey,(x1,y1),(x2,y2),(0,255,0),2)
            # for x1,y1,x2,y2 in lines[:,0,:]:
            #     #shapes=[shape variables, shape project, shape bound, shape type]
            #     lin.append([x1, y1, x2, y2])

                #come back to this shit
                # m=((y2-y1)/(x2-x1))
                # m_i=-1/m
                # theta=math.atan(m_i)
                # x_0=math.cos(theta)*2
                # y_0=(m_1*x_0)
                #
                # alpha=math.atan(m)
                # x_1=math.cos(alpha)*2
                # y_1=(m*x_1)
                #
                # xr1=
                #cv2.line(grey,(x1,y1),(x2,y2),(0,255,0),2)

            if ((y2-y1)/(x2-x1))<1:
                lin.append([x1, (y1+8), (x1+25), (y1-8)])
                cv2.rectangle(project, (x1,y1+8),(x1+25,y1-8), (255,0,0), -1)
            else:
                lin.append([x1-4, (y1), (x1+4), (y1+25)])
                cv2.rectangle(project, (x1-8, y1), (x1+8, y1+25), (255, 0, 0), -1)
            h=int((((x2-x1)+8)*(9/16))/2)
            lin.append([x1-4, (y1-h), (x2+4), (y2+h)])
            lin.append("line")
            shapes.append(lin)

            cv2.imwrite('output.jpg',project)
                # cv2.imwrite("output.jpg", project)



            #insert code to warp output back to projector


#class for shape detection
class ShapeDetector:
    def __init__(self):
        pass
    def detect(self, c):
        # initialize the shape name and approximate the contour
        shape = "unidentified"
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.04 * peri, True)
        if len(approx) == 3:
            shape = "triangle"
		# if the shape has 4 vertices, it is either a square or
		# a rectangle
        elif len(approx) == 4:
			# compute the bounding box of the contour and use the
			# bounding box to compute the aspect ratio
            (x, y, w, h) = cv2.boundingRect(approx)
            ar = w / float(h)

			# a square will have an aspect ratio that is approximately
			# equal to one, otherwise, the shape is a rectangle
            shape = "square" if ar >= 0.95 and ar <= 1.05 else "rectangle"

		# if the shape is a pentagon, it will have 5 vertices
        elif len(approx) == 5:
            shape = "pentagon"

		# otherwise, we assume the shape is a circle
        else:
            shape = "circle"

		# return the name of the shape
        return shape

shapes=[] #where previously drawn shapes are stored [shape variables, shape box, shape type]

#is it okay to fully initialize project
project = np.zeros([1080,1920,3],dtype=np.uint8)
project.fill(0)
project = cv2.rectangle(project,(0,0),(1919,1079),(255,255,255),5)
cv2.imwrite('output.jpg',project)
#project=[] #what is being projected, save here



cv2.namedWindow("input",cv2.WINDOW_AUTOSIZE)
cv2.moveWindow("input", 1930, 20)

if __name__ == "__main__":
    done = False
    outputimg = 'output.jpg'
    croppedFrame = None

    camindex = 0
    cap = cv2.VideoCapture(camindex)
    doShapes = True
    # shapeThread = threading.Thread(target=findshapes)
    # threads.append(markerThread)
    # shapeThread.start()
    # cv2.namedWindow("input",cv2.WINDOW_AUTOSIZE)
    # cv2.moveWindow("input", 1930, 20)
    # testThread = threading.Thread(target=testProc)
    # # threads.append(marke÷÷rThread)
    # testThread.start()


    while(not done):
        # capture frame
        ret, frame = cap.read()

        # rotat frame
        rotframe = rotateFrame(frame,mrkrcorners)

        # crop
        rectframe = rotframe[left:right,up:down,:]
        croppedFrame = cv2.resize(rectframe,(1920,1080))


        # process frame
        if(doShapes):
            shapes = []
            findshapes(croppedFrame)
            cv2.imshow("input", rectframe)
            cv2.imwrite("circlecap.jpg",croppedFrame)
            doShapes = False

        if(doInteract):
            print(shapes)
            toProj = cv2.imread('border.jpg',cv2.IMREAD_COLOR)
            cv2.imwrite('output.jpg',toProj)
            processed = slider(croppedFrame)
            processed = rotary(croppedFrame)
            cv2.imshow("input", processed)

        # show on screen
        # cv2.imshow("input", rectframe)
        # cv2.imwrite("circlecap.jpg",croppedFrame)
        # cv2.imshow("input", processed)

        # press q to quit
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

        pyglet.clock.tick()

        rotateOut(outputimg,mrkrcorners,polycorners,rectcorners)
        warpedOut = pyglet.image.load('warptestout.jpg')
        for window in pyglet.app.windows:
            window.switch_to()
            window.dispatch_events()
            window.dispatch_event('on_draw')
            window.flip()
        if(done):
            break

    cap.release()
    cv2.destroyAllWindows()
