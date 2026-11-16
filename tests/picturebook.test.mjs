import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {pages} from '../src/data/picturebook/s01e01-sc01.ts';
import {parseReadingState,saveReadingState,loadReadingState,selectLocalVoice,noVoiceMessage} from '../src/services/picturebookState.ts';
import {getRoute} from '../src/services/learningProgress.ts';
const source=new URL('../../project-hub/02_Episodes/E01_Waste_Sorting/AI_Release/S01E01_SC01_Opening_READY_FOR_AI.md',import.meta.url);
test('9 页插图存在且均为 1920×1080',()=>{
 assert.equal(pages.length,9);
 for(const page of pages){const path=new URL('../public'+page.image,import.meta.url);assert.ok(existsSync(path));const png=readFileSync(path);assert.equal(png.readUInt32BE(16),1920);assert.equal(png.readUInt32BE(20),1080);}
});
test('第 3–9 页中德对白逐字等于发布剧本且顺序一致',()=>{
 const script=readFileSync(source,'utf8');
 const expected=[...script.matchAll(/\*\*([^*]+)\*\*[^\n]*\r?\nDE: (.+)\r?\nZH: (.+)/g)].map(m=>({speaker:m[1].replace('（凑近）',''),de:m[2].trim(),zh:m[3].trim()}));
 const actual=pages.slice(2).flatMap(page=>page.lines.map(({speaker,de,zh})=>({speaker,de,zh})));
 assert.equal(expected.length,14);assert.deepEqual(actual,expected);assert.equal(pages[2].lines.length,0);
});
test('家长选择、页码与横屏提示偏好可独立保存和恢复',()=>{
 let value=null;globalThis.localStorage={getItem:()=>value,setItem:(_,v)=>{value=v;}};
 const state={page:5,subtitles:'reveal',configured:true,portraitDismissed:true};assert.equal(saveReadingState(state),true);assert.deepEqual(loadReadingState(),state);
 assert.equal(parseReadingState('{bad').page,0);assert.equal(parseReadingState('{"page":99}').page,0);
 globalThis.localStorage={getItem(){throw Error();},setItem(){throw Error();}};assert.equal(saveReadingState(state),false);assert.equal(loadReadingState().page,0);
});
test('缺少本机德语语音时可安全退回文字并提供确认文案',()=>{
 assert.equal(selectLocalVoice([],'Sonata'),undefined);
 assert.equal(selectLocalVoice([{lang:'de-DE',localService:false}],'孩子'),undefined);
 assert.equal(noVoiceMessage,'本机暂无可用的德语语音，请阅读字幕。');
 const voices=[0,1,2].map(i=>({name:String(i),lang:'de-DE',localService:true}));
 assert.notEqual(selectLocalVoice(voices,'孩子'),selectLocalVoice(voices,'工作人员'));
});
test('原六路由保留且绘本新路由可解析',()=>{
 for(const route of ['home','map','story','mother','lesson','tasks','picturebook/s01e01-sc01'])assert.equal(getRoute('#/'+route),route);
});

import {sceneLayouts} from '../src/data/picturebook/sceneLayouts.ts';
test('每页热点与插画布局一致并保持在画面内',()=>{
 assert.equal(sceneLayouts.length,9);
 pages.forEach((page,index)=>{
  const layout=sceneLayouts[index];
  assert.deepEqual(Object.keys(layout.hotspots).sort(),[...page.hotspots].sort());
  for(const region of Object.values(layout.hotspots)){
   assert.ok(region.left>=0&&region.top>=0&&region.width>0&&region.height>0);
   assert.ok(region.left+region.width<=100&&region.top+region.height<=100);
   if(region.line!==undefined)assert.ok(page.lines[region.line]);
  }
  if(!page.narration)for(const line of page.lines)assert.ok(layout.bubbles[line.speaker]);
 });
});
test('第7至9页角色热点精确重播规格指定的对白',()=>{
 assert.equal(sceneLayouts[6].hotspots.Sonata.line,0);
 assert.equal(sceneLayouts[6].hotspots['工作人员'].line,1);
 assert.equal(sceneLayouts[7].hotspots.Sonata.line,0);
 assert.equal(sceneLayouts[7].hotspots['孩子'].line,1);
 assert.equal(sceneLayouts[8].hotspots['工作人员'].line,0);
 assert.equal(sceneLayouts[8].hotspots.Sonata.line,1);
 assert.equal(sceneLayouts[8].hotspots['孩子'].line,2);
});

test('16段本地德语音频存在、含有效PCM数据且不是静音',()=>{
 const lines=pages.flatMap(page=>page.lines);assert.equal(lines.length,16);
 for(const line of lines){
  const file=new URL('../public/picturebook/s01e01-sc01/audio/'+line.audioId.replace(/\.mp3$/,'.wav'),import.meta.url);
  const wav=readFileSync(file);assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
  const dataOffset=wav.indexOf(Buffer.from('data'));assert.ok(dataOffset>=0);
  const length=wav.readUInt32LE(dataOffset+4);assert.ok(length>10000);
  assert.ok(wav.subarray(dataOffset+8,dataOffset+8+length).some(sample=>sample!==0));
 }
});

import {dialogueOrder,availableLine} from '../src/services/picturebookInteraction.ts';
test('第5页按孩子、Sonata、孩子、Sonata逐句引导且只重播点击角色',()=>{
 const order=dialogueOrder(4,4);
 assert.deepEqual(order,[0,1,2,3]);
 assert.equal(availableLine(order,[],[0,2]),0);
 assert.equal(availableLine(order,[],[1,3]),undefined);
 assert.equal(availableLine(order,[0],[0,2]),0);
 assert.equal(availableLine(order,[0],[1,3]),1);
 assert.equal(availableLine(order,[0,1],[0,2]),2);
 assert.equal(availableLine(order,[0,1,2],[0,2]),2);
 assert.equal(availableLine(order,[0,1,2],[1,3]),3);
 assert.equal(availableLine(order,[0,1,2,3],[1,3]),3);
});
test('第9页引导顺序为Sonata、小孩、工作人员，不改动原文数据顺序',()=>{
 const order=dialogueOrder(8,3);assert.deepEqual(order,[1,2,0]);
 assert.equal(availableLine(order,[],[1]),1);
 assert.equal(availableLine(order,[1],[2]),2);
 assert.equal(availableLine(order,[1,2],[0]),0);
 assert.equal(availableLine(order,[1,2],[1]),1);
});

import {recordingSources} from '../src/data/picturebook/recordingSources.ts';
test('16段新角色配音映射完整并与提供的MP3逐字节相同',()=>{
 const lines=pages.flatMap(page=>page.lines);assert.equal(Object.keys(recordingSources).length,16);
 for(const line of lines){const relative=recordingSources[line.audioId];assert.ok(relative);const filename=relative.split('/').pop();const role=line.speaker==='SONATA'?'sonata':line.speaker==='孩子'?'kind':'mann';assert.ok(filename.toLowerCase().includes(role));const actual=readFileSync(new URL('../public/picturebook/s01e01-sc01/audio/'+relative,import.meta.url));const original=readFileSync(new URL('../../project-hub/02_Episodes/E01_Waste_Sorting/Voice/C01/'+filename,import.meta.url));assert.ok(actual.equals(original));}
 assert.equal(recordingSources[pages[8].lines[1].audioId],'voices/14Sonata.mp3');
 assert.equal(recordingSources[pages[8].lines[2].audioId],'voices/15Kind.mp3');
 assert.equal(recordingSources[pages[8].lines[0].audioId],'voices/16Mann.mp3');
 assert.equal(recordingSources['magic.wav'],undefined);assert.equal(recordingSources['meow.wav'],undefined);
});

import {recordingUrl} from '../src/data/picturebook/recordedVoices.ts';
test('播放器实际URL使用第8页13Kind和第9页15Kind配音',()=>{
 assert.equal(recordingUrl(pages[7].lines[1].audioId),'/picturebook/s01e01-sc01/audio/voices/13Kind.mp3');
 assert.equal(recordingUrl(pages[8].lines[2].audioId),'/picturebook/s01e01-sc01/audio/voices/15Kind.mp3');
 assert.equal(recordingUrl(pages[8].lines[0].audioId),'/picturebook/s01e01-sc01/audio/voices/16Mann.mp3');
 assert.equal(recordingUrl('magic.wav'),'/picturebook/s01e01-sc01/audio/magic.wav');
 assert.equal(recordingUrl('meow.wav'),'/picturebook/s01e01-sc01/audio/meow.wav');
});
