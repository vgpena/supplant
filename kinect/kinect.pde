import java.util.ArrayList;
import KinectPV2.KJoint;
import KinectPV2.*;
import processing.net.*;
import http.requests.*;

Client myClient;
KinectPV2 kinect;
String[] segments = {
  "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"
};
GetRequest get;

void setup() {
  size(1024, 768, P3D);
  kinect = new KinectPV2(this);
  
  //kinect.enableDepthMaskImg(true);
  kinect.enableSkeletonDepthMap(true);
  kinect.init();
}

void draw() {
  background(0);
  scale(2); 
  //image(kinect.getDepthMaskImage(), 0, 0);
  for (int i = 0; i < segments.length; i++) {
    segments[i] = "0";
  }
  ArrayList<KSkeleton> skelArr = kinect.getSkeletonDepthMap();
  for (int i = 0; i < skelArr.size(); i++) {
    KSkeleton skeleton = (KSkeleton) skelArr.get(i);
    KJoint[] joints = skeleton.getJoints();
    color col = skeleton.getIndexColor();
    fill(col);
    stroke(col); 
    KJoint joint = joints[KinectPV2.JointType_Head];
    int j = floor((joint.getX() / (1024/2)) * 10);
    if (j >= 0 && j <= 9) {
      segments[j] = "1";
      println(joint.getZ());
      drawHead(joints);
    }
  }
  
  get = new GetRequest("http://localhost:3000/update?segments=" + join(segments, ','));
  get.send();
  delay(200);
}

void drawHead(KJoint[] joints) {
  pushMatrix();
  KJoint joint = joints[KinectPV2.JointType_Head];
  translate(joint.getX(), joint.getY(), joint.getZ());
  ellipse(0, 0, 25, 25);
  popMatrix();
}