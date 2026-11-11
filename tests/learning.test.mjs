import {test} from 'node:test';
import assert from 'node:assert/strict';
import {initialProgress,parseProgress,saveProgress,loadProgress,sortItem,advanceAdult,getRoute} from '../src/services/learningProgress.ts';
import {chapter} from '../src/data/content.ts';
test('儿童答错不推进；三个正确分类才完成；不影响母亲进度',()=>{
 let p=initialProgress();assert.equal(sortItem(p,'bio','paper'),p);
 for(const item of chapter.items)p=sortItem(p,item.bin,item.bin);
 assert.equal(p.child.index,3);assert.equal(p.child.completed,true);assert.deepEqual(p.adult,initialProgress().adult);
 assert.equal(sortItem(p,'paper','paper'),p);
});
test('暂停会阻止进度推进，恢复后两条路线独立完成',()=>{
 let p=initialProgress();p.child.paused=true;p.adult.paused=true;
 assert.equal(sortItem(p,'paper','paper'),p);assert.equal(advanceAdult(p),p);
 p={...p,adult:{...p.adult,paused:false}};for(let i=0;i<4;i++)p=advanceAdult(p);
 assert.equal(p.adult.completed,true);assert.equal(p.child.index,0);assert.equal(p.child.paused,true);
});
test('刷新恢复语言、模式、暂停位置和现实任务',()=>{
 let stored=null;globalThis.localStorage={getItem:()=>stored,setItem:(_,value)=>{stored=value;}};
 const p={...initialProgress(),language:'de',mode:'mother',child:{index:1,completed:false,paused:true},adult:{step:2,completed:false,paused:true},tasks:[true,false,true]};
 assert.equal(saveProgress(p),true);assert.deepEqual(loadProgress(),p);
});
test('损坏或异常数据安全恢复，不相信伪造的完成标记',()=>{
 for(const raw of [null,'{bad','null','{"version":9}'])assert.deepEqual(parseProgress(raw),initialProgress());
 const p=parseProgress(JSON.stringify({version:1,child:{index:99,completed:true},adult:{step:2,completed:true},tasks:[true,'yes']}));
 assert.equal(p.child.completed,false);assert.equal(p.adult.completed,false);assert.deepEqual(p.tasks,[true,false,false]);
 globalThis.localStorage={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
 assert.deepEqual(loadProgress(),initialProgress());assert.equal(saveProgress(initialProgress()),false);
});
test('六个路由和未知地址回退',()=>{
 for(const route of ['home','map','story','mother','lesson','tasks'])assert.equal(getRoute(`#/${route}`),route);
 assert.equal(getRoute('#/missing'),'home');
});
test('章节的正确答案与双语内容完整',()=>{
 for(const item of chapter.items){assert.ok(chapter.bins.some(b=>b.id===item.bin));assert.ok(item.label.de&&item.label.zh);}
 for(const q of chapter.quiz)assert.ok(q.options[q.answer]);
 assert.equal(chapter.items.length,3);assert.equal(chapter.quiz.length,2);
});
