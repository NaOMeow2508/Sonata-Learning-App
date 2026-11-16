export type Region = {left:number;top:number;width:number;height:number;line?:number};
export type BubbleAnchor = {left:number;top:number;targetX:number;targetY:number};
export const sceneLayouts: {hotspots:Record<string,Region>;bubbles:Record<string,BubbleAnchor>}[] = [
 {hotspots:{Sonata:{left:35,top:17,width:45,height:79}},bubbles:{}},
 {hotspots:{Sonata:{left:2,top:14,width:57,height:85},垃圾桶:{left:49,top:58,width:48,height:41}},bubbles:{}},
 {hotspots:{垃圾桶:{left:84,top:69,width:12,height:30},落叶:{left:40,top:81,width:35,height:18}},bubbles:{}},
 {hotspots:{Sonata:{left:22,top:32,width:47,height:58}},bubbles:{SONATA:{left:3,top:3,targetX:39,targetY:51}}},
 {hotspots:{孩子:{left:47,top:3,width:36,height:95},Sonata:{left:17,top:60,width:43,height:35}},bubbles:{孩子:{left:2,top:3,targetX:59,targetY:32},SONATA:{left:2,top:3,targetX:31,targetY:74}}},
 {hotspots:{孩子:{left:24,top:34,width:22,height:65},工作人员:{left:53,top:3,width:26,height:95}},bubbles:{孩子:{left:1,top:2,targetX:31,targetY:43},工作人员:{left:2,top:2,targetX:63,targetY:20}}},
 {hotspots:{孩子:{left:15,top:9,width:29,height:88,line:0},工作人员:{left:39,top:3,width:35,height:85,line:1},Sonata:{left:53,top:60,width:25,height:38,line:0}},bubbles:{孩子:{left:65,top:2,targetX:26,targetY:26},工作人员:{left:65,top:2,targetX:51,targetY:22}}},
 {hotspots:{Sonata:{left:5,top:40,width:44,height:55,line:0},孩子:{left:69,top:4,width:23,height:94,line:1}},bubbles:{SONATA:{left:2,top:2,targetX:38,targetY:61},孩子:{left:2,top:2,targetX:77,targetY:25}}},
 {hotspots:{工作人员:{left:46,top:1,width:53,height:98,line:0},Sonata:{left:27,top:53,width:31,height:46,line:1},孩子:{left:9,top:23,width:24,height:76,line:2}},bubbles:{工作人员:{left:1,top:1,targetX:62,targetY:25},SONATA:{left:2,top:1,targetX:47,targetY:67},孩子:{left:2,top:1,targetX:20,targetY:40}}},
];
