import {useEffect,useRef,useState} from 'react';
import {House,Map,BookOpen,Heart,ArrowLeft,Leaf,ShieldCheck,ArrowLeftRight} from 'lucide-react';
import {copy as c} from './data/content';
import {getRoute,loadProgress,saveProgress} from './services/learningProgress';
import type {Route} from './services/learningProgress';
import FamilyHome from './pages/FamilyHome';
import AdventureMap from './pages/AdventureMap';
import ChildStory from './pages/ChildStory';
import MotherCenter from './pages/MotherCenter';
import AdultLesson from './pages/AdultLesson';
import RealTasks from './pages/RealTasks';
export default function App(){
 const [p,setP]=useState(loadProgress),[route,setRoute]=useState(()=>getRoute(location.hash)),[storageOk,setStorageOk]=useState(true);
 const main=useRef<HTMLElement>(null);const lang=p.language;const t=(text:{zh:string;de:string})=>text[lang];
 useEffect(()=>{setStorageOk(saveProgress(p));},[p]);
 useEffect(()=>{document.documentElement.lang=lang==='zh'?'zh-CN':'de';},[lang]);
 useEffect(()=>{const sync=()=>setRoute(getRoute(location.hash));window.addEventListener('hashchange',sync);window.addEventListener('popstate',sync);return()=>{window.removeEventListener('hashchange',sync);window.removeEventListener('popstate',sync);};},[]);
 useEffect(()=>{main.current?.focus();window.scrollTo(0,0);if('speechSynthesis'in window)window.speechSynthesis.cancel();if(route==='map'||route==='story')setP(prev=>prev.mode==='child'?prev:{...prev,mode:'child'});if(route==='mother'||route==='lesson')setP(prev=>prev.mode==='mother'?prev:{...prev,mode:'mother'});},[route]);
 function go(next:Route){if(next!==route)history.pushState(null,'',`#/${next}`);setRoute(next);}
 const child=route==='map'||route==='story';
 const nav=[{id:'home',label:c('家庭首页','Familie'),Icon:House},{id:'map',label:c('儿童冒险','Abenteuer'),Icon:Map},{id:'mother',label:c('母亲学习','Für Mama'),Icon:BookOpen},{id:'tasks',label:c('现实任务','Gemeinsam'),Icon:Heart}] as const;
 const pages={home:FamilyHome,map:AdventureMap,story:ChildStory,mother:MotherCenter,lesson:AdultLesson,tasks:RealTasks};const Page=pages[route];
 return <div className={`app ${child?'child-mode':''}`}><a className="skip-link" href="#main-content" onClick={e=>{e.preventDefault();main.current?.focus();}}>{t(c('跳到正文','Zum Inhalt'))}</a><header className="site-header"><button className="brand" onClick={()=>go('home')} aria-label="Kleine Welten Home"><span className="brand-symbol"><Leaf size={24}/></span><span>Kleine Welten<small>{t(c('一起长大的小世界','Gemeinsam wachsen'))}</small></span></button><div className="header-controls"><span className="local-badge"><ShieldCheck size={14}/>{t(c('安心的家庭空间','Euer geschützter Lernraum'))}</span><select aria-label={t(c('界面语言','Sprache'))} value={lang} onChange={e=>setP(prev=>({...prev,language:e.target.value as 'zh'|'de'}))}><option value="zh">中文 / DE</option><option value="de">Deutsch</option></select></div></header><div className="desktop-nav"><nav aria-label={t(c('主导航','Hauptnavigation'))}>{nav.map(({id,label,Icon})=><button key={id} className={route===id||(id==='map'&&route==='story')||(id==='mother'&&route==='lesson')?'active':''} aria-current={route===id||(id==='map'&&route==='story')||(id==='mother'&&route==='lesson')?'page':undefined} onClick={()=>go(id)}><Icon size={18}/>{t(label)}</button>)}</nav><span>{t(c('一个主题，两种发现。','Ein Thema, zwei Entdeckungswege.'))}</span></div><main ref={main} id="main-content" tabIndex={-1}>
 {route!=='home'&&<div className="back-row"><button className="text-button" onClick={()=>go(route==='story'?'map':route==='lesson'?'mother':'home')}><ArrowLeft size={16}/>{t(c('返回','Zurück'))}</button>{(child||route==='mother'||route==='lesson')&&<button className="text-button mode-switch" onClick={()=>go(child?'mother':'map')}><ArrowLeftRight size={15}/>{t(child?c('换母亲学习','Zu Mama wechseln'):c('换孩子冒险','Zum Kind wechseln'))}</button>}</div>}
 {!storageOk&&<p className="storage-warning" role="alert">{t(c('浏览器无法保存进度。当前仍可学习，关闭后可能丢失记录。','Der Browser kann den Fortschritt nicht speichern. Nach dem Schließen kann er verloren gehen.'))}</p>}
 <Page key={`${route}-${lang}`} p={p} setP={setP} go={go} lang={lang} t={t}/></main><footer><span><Leaf size={14}/>Kleine Welten</span><span>{t(c('无需账号 · 进度保存在这台设备的浏览器','Ohne Konto · Fortschritt bleibt in diesem Browser'))}</span></footer></div>;
}
