import {useEffect,useRef,useState} from 'react';
import {picturebookText} from '../data/picturebook/interfaceText';
import {copy as c} from '../data/content';
import type {PageProps} from '../types';
import {recordingUrl} from '../data/picturebook/recordedVoices';

import {keywords,pages} from '../data/picturebook/s01e01-sc01';
import {loadReadingState,saveReadingState,selectLocalVoice,noVoiceMessage} from '../services/picturebookState';
import './Picturebook.css';
import {dialogueOrder,availableLine} from '../services/picturebookInteraction';
import {sceneLayouts} from '../data/picturebook/sceneLayouts';
export default function Picturebook({t,lang}:PageProps){
  const ui=(text:string)=>t(picturebookText[text] ?? c(text,text));
  const [saved,setSaved] = useState(loadReadingState);
  const [portrait,setPortrait] = useState(()=>innerHeight>innerWidth && !saved.portraitDismissed);
  const [settings,setSettings] = useState(!saved.configured);
  const [visible,setVisible] = useState(0);
  const [ready,setReady] = useState(false);
  const [translation,setTranslation] = useState(false);
  const [hidden,setHidden] = useState(false);
  const [notice,setNotice] = useState('');
  const [storageOk,setStorageOk] = useState(true);
  const [heardEffects,setHeardEffects] = useState<string[]>([]);
  const effectSource = useRef<AudioBufferSourceNode|null>(null);
  const [heard,setHeard] = useState<number[]>([]);
  const [playing,setPlaying] = useState<string|null>(null);

  const [focusedLine,setFocusedLine] = useState<number|null>(null);


  const startX = useRef<number|null>(null);

  const recordedAudio = useRef<HTMLAudioElement|null>(null);
  const audioContext = useRef<AudioContext|null>(null);
  const page = pages[saved.page];
  useEffect(()=>{setStorageOk(saveReadingState(saved));},[saved]);
  useEffect(()=>()=>{recordedAudio.current?.pause();audioContext.current?.close();},[]);
  function stopRecording(){
    const audio=recordedAudio.current;
    if(audio){audio.onended=null;audio.onerror=null;audio.pause();recordedAudio.current=null;}
  }
  function playRecording(audioId:string,done:()=>void,failed:()=>void){
    stopRecording();
    const audio=new Audio(recordingUrl(audioId));
    recordedAudio.current=audio;
    let settled=false;
    const finish=(callback:()=>void)=>{if(settled||recordedAudio.current!==audio)return;settled=true;callback();};
    audio.onplaying=()=>setNotice('正在播放德语对白…');
    audio.onended=()=>finish(()=>{setNotice('');done();});
    audio.onerror=()=>finish(failed);
    setNotice('');
    void audio.play().catch(()=>finish(failed));
  }
  useEffect(()=>{
    stopRecording();
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    setHeardEffects([]);setHeard([]);setPlaying(null);setFocusedLine(null);
    setVisible(0);setReady(true);setTranslation(false);setHidden(saved.subtitles==='reveal');setNotice('点击闪光或气泡，听听角色说什么。');
    return ()=>{if(effectSource.current){effectSource.current.onended=null;effectSource.current.stop();effectSource.current=null;}stopRecording();if('speechSynthesis' in window)window.speechSynthesis.cancel();};
  },[saved.page,portrait,settings]);
  function speakText(text:string,speaker:string,index?:number){
    if(index!==undefined)setFocusedLine(index);

    const recording=page.lines.find(line=>line.de===text);
    if(recording){playRecording(recording.audioId,()=>{},()=>setNotice('音频加载失败，请刷新后再点一次。'));return;}
    const voice='speechSynthesis' in window && selectLocalVoice(speechSynthesis.getVoices(),speaker);
    if(!voice){setNotice(noVoiceMessage);return;}
    speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang='de-DE';utterance.rate=.85;
    utterance.onerror=()=>setNotice(noVoiceMessage);speechSynthesis.speak(utterance);
  }
  function sound(kind:string){
    try {
      const context=audioContext.current || new AudioContext();audioContext.current=context;void context.resume();
      const buffer=context.createBuffer(1,context.sampleRate*.65,context.sampleRate);
      const channel=buffer.getChannelData(0);for(let i=0;i<channel.length;i++)channel[i]=(Math.random()*2-1)*.13*(1-i/channel.length);
      const source=context.createBufferSource();source.buffer=buffer;
      const filter=context.createBiquadFilter();filter.type='bandpass';filter.frequency.value=kind==='落叶'?1700:650;
      if(effectSource.current){effectSource.current.onended=null;effectSource.current.stop();}
      effectSource.current=source;setPlaying(kind);
      source.onended=()=>{effectSource.current=null;setPlaying(null);setHeardEffects(value=>value.includes(kind)?value:[...value,kind]);};
      source.connect(filter);filter.connect(context.destination);source.start();
    }catch {setNotice('本机无法播放音效，请观察画面。');}
  }
  function hotspot(name:string){

    if(saved.subtitles==='parallel')setHidden(false);
    const effect=saved.page===1&&name==='垃圾桶'?'magic':saved.page===2&&name==='垃圾桶'?'meow':null;
    if(effect){
      setPlaying(name);
      playRecording(effect+'.wav',()=>{setPlaying(null);setHeardEffects(value=>value.includes(name)?value:[...value,name]);},()=>{setPlaying(null);setNotice('音效加载失败，请重新点击。');});
      return;
    }
    if(saved.page===2){sound(name);return;}
    const role=name==='Sonata'?'SONATA':name;
    const roleLines=page.lines.flatMap((line,index)=>line.speaker===role||page.narration?[index]:[]);
    const index=availableLine(dialogueOrder(saved.page,page.lines.length),heard,roleLines);
    if(index===undefined)return;
    const line=page.lines[index];
    if('speechSynthesis' in window)window.speechSynthesis.cancel();
    if(saved.subtitles==='reveal'&&index!==focusedLine)setHidden(true);
    setFocusedLine(index);setVisible(value=>Math.max(value,index+1));setPlaying(name);
    const finish=()=>{setPlaying(null);setHeard(value=>value.includes(index)?value:[...value,index]);};
    playRecording(line.audioId,finish,()=>{
      const voice='speechSynthesis' in window && selectLocalVoice(speechSynthesis.getVoices(),line.speaker);
      if(!voice){setPlaying(null);setNotice('音频加载失败，请重新点击。');return;}
      const utterance=new SpeechSynthesisUtterance(line.de);
      utterance.voice=voice;utterance.lang='de-DE';utterance.rate=.85;
      utterance.onend=finish;
      utterance.onerror=()=>{setPlaying(null);setNotice('播放失败，请重新点击。');};
      speechSynthesis.speak(utterance);
    });
  }
  const requiredEffects=saved.page===1?['垃圾桶']:saved.page===2?['垃圾桶','落叶']:[];
  const pageComplete=heard.length===page.lines.length&&requiredEffects.every(name=>heardEffects.includes(name))&&!playing;
  const order=dialogueOrder(saved.page,page.lines.length);
  const nextLine=order.find(index=>!heard.includes(index));
  const interactiveNames=page.hotspots.filter(name=>{
    if(!page.lines.length||page.narration)return true;
    const role=name==='Sonata'?'SONATA':name;
    return page.lines.some((line,index)=>line.speaker===role&&(index===nextLine||heard.includes(index)));
  });
  function isNext(name:string){return page.narration||!page.lines.length||page.lines[nextLine ?? -1]?.speaker===(name==='Sonata'?'SONATA':name);}

  function turn(next:number){if(!ready || next<0 || next>8)return;setSaved(value=>({...value,page:next}));}
  const layout=sceneLayouts[saved.page];
  const activeIndex=focusedLine ?? Math.max(0,visible-1);
  const activeLine=page.lines[activeIndex];

  function renderLine(line:typeof page.lines[number],index:number){
    return <article key={line.audioId} className="pb-line"><small>{ui(line.speaker)}</small><p lang="de">{saved.subtitles==='parallel'?line.de.split(/\b(Entschuldigung|helfen|bitte|Katze|Danke|frei|verstehen)\b/g).map((part,i)=>keywords.includes(part)?<button className="pb-word" key={i} onClick={()=>speakText(part,line.speaker)}>{part}</button>:part):line.de}</p>{lang==='zh'&&<button className="pb-translation" aria-label={t(c(`第 ${index+1} 句中文翻译`,`Chinesische Übersetzung von Satz ${index+1}`))} onClick={()=>setTranslation(value=>!value)}>{saved.subtitles==='parallel'||translation?<span lang="zh">{line.zh}</span>:ui('点击显示中文')}</button>}</article>;
  }
  return <section className="picturebook" aria-label={ui("Sonata 的初次相遇")}>
    <header className="pb-toolbar"><h1>{ui("Sonata 的初次相遇")}</h1><button onClick={()=>setSettings(true)}>{ui("家长字幕设置")}</button>{saved.subtitles==='parallel'&&<button onClick={()=>setHidden(value=>!value)}>{ui(hidden?'显示字幕':'隐藏字幕')}</button>}</header>
    {!storageOk&&<p role="alert">{ui("浏览器无法保存绘本进度，本次仍可阅读。")}</p>}
    {portrait?<div className="pb-dialog" role="dialog" aria-modal="true" aria-label={ui("横屏阅读提示")}><p>{ui("推荐横屏阅读，获得更好的画面效果。")}</p><button autoFocus onClick={()=>{setSaved(value=>({...value,portraitDismissed:true}));setPortrait(false);}}>{ui("继续阅读")}</button><button onClick={()=>setPortrait(false)}>{ui("我知道了")}</button></div>:settings?<div className="pb-dialog" role="dialog" aria-modal="true" aria-label={ui("家长字幕形式")}><h2>{ui("请选择字幕形式")}</h2><button autoFocus onClick={()=>{setSaved(value=>({...value,subtitles:'parallel',configured:true}));setSettings(false);}}>{ui("A · 中德对照，标记重点词汇")}</button><button onClick={()=>{setSaved(value=>({...value,subtitles:'reveal',configured:true}));setSettings(false);}}>{ui("B · 默认关闭字幕，点击显示")}</button></div>:<>
    <div className="pb-scene">
    <div className="pb-art" onTouchStart={event=>{startX.current=event.touches[0].clientX;}} onTouchEnd={event=>{if(startX.current===null)return;const distance=event.changedTouches[0].clientX-startX.current;if(Math.abs(distance)>60)turn(saved.page+(distance<0?1:-1));startX.current=null;}}>
      <img src={page.image} alt={t(c(`Sonata 绘本第 ${saved.page+1} 页`,`Sonata-Bilderbuch, Seite ${saved.page+1}`))}/>
      {interactiveNames.map(name=>{const {left,top,width,height}=layout.hotspots[name];return <button key={name} className="pb-hotspot" aria-label={`${ui(name)} · ${ui(saved.page===2||saved.page===1&&name==='垃圾桶'?'播放音效':'重播对白')}`} style={{left:`${left}%`,top:`${top}%`,width:`${width}%`,height:`${height}%`}} onClick={()=>hotspot(name)}>{isNext(name)&&<span className="pb-sparkle" aria-hidden="true">✦<span>✧</span></span>}</button>;})}
      {interactiveNames.map(name=><button key={name} className={playing===name?'pb-mini-bubble pb-speaking':'pb-mini-bubble'} aria-label={ui(name)+' · '+ui('播放对白气泡')} onClick={()=>hotspot(name)} style={{left:Math.min(88,Math.max(12,layout.hotspots[name].left+layout.hotspots[name].width/2))+'%',top:Math.max(4,layout.hotspots[name].top-5)+'%'}}>...</button>)}

    </div>
    </div>
    <div className="pb-hotspot-labels">{interactiveNames.map(name=><button key={name} onClick={()=>hotspot(name)}>{ui(name)} · {ui(saved.page===2||saved.page===1&&name==='垃圾桶'?'听音效':'重播')}</button>)}</div>
    {notice&&<p role="status">{ui(notice)}</p>}
    {saved.subtitles==='reveal'&&visible>0&&activeLine&&<button className="pb-reveal-subtitle" onClick={()=>setHidden(value=>!value)}>{t(hidden?c('显示该句字幕','Untertitel für diesen Satz anzeigen'):c('隐藏该句字幕','Untertitel für diesen Satz ausblenden'))}</button>}
    {!hidden&&!page.narration&&visible>0&&activeLine&&<div className="pb-click-subtitle" aria-live="polite">{renderLine(activeLine,activeIndex)}</div>}
    {!hidden&&page.narration&&<div className="pb-narration" aria-live="polite">{page.lines.slice(0,visible).map(renderLine)}</div>}
    {saved.subtitles==='parallel'&&!hidden&&!page.narration&&heard.length>1&&<details className="pb-history"><summary>{t(c(`已读对白（${heard.length}）`,`Gehörte Dialoge (${heard.length})`))}</summary>{heard.map(index=>renderLine(page.lines[index],index))}</details>}
    {pageComplete&&<div className="pb-turn-hint" role="status">{t(saved.page===8?c('本集已听完！可以再读一遍，或返回剧集目录。','Du hast die ganze Folge gehört! Lies sie noch einmal oder kehre zur Folgenübersicht zurück.'):c('本页已听完！点击右箭头或左右滑动，继续故事。','Du hast diese Seite zu Ende gehört! Tippe auf den rechten Pfeil oder wische nach links oder rechts, um weiterzublättern.'))}</div>}
    <nav className="pb-pagination" aria-label={ui("绘本翻页")}><button disabled={!ready||saved.page===0} onClick={()=>turn(saved.page-1)} aria-label={ui("上一页")}>←</button><span>{saved.page+1} / 9{pageComplete&&saved.page===8?t(c(' · 完成',' · Geschafft')):''}</span><button className={pageComplete?'pb-next-ready':undefined} disabled={!ready||saved.page===8} onClick={()=>turn(saved.page+1)} aria-label={ui("下一页")}>→</button></nav>
    <div className="pb-dots">{pages.map((_,index)=><button aria-label={t(c(`第 ${index+1} 页`,`Seite ${index+1}`))} aria-current={index===saved.page?'page':undefined} disabled={!ready} key={index} onClick={()=>turn(index)}>{index===saved.page?'●':'○'}</button>)}</div>

    {heard.length===page.lines.length&&saved.page===8&&<div className="pb-end"><button onClick={()=>turn(0)}>{t(c('再读一遍','Noch einmal lesen'))}</button><a href="#/picturebooks">{t(c('返回目录','Zur Folgenübersicht'))}</a></div>}
    </>}
  </section>;
}









