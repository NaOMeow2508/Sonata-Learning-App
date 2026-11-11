import {useState} from 'react';
import {Pause,Play,ArrowRight,RotateCcw} from 'lucide-react';
import {chapter,copy as c} from '../data/content';
import {sortItem} from '../services/learningProgress';
import Lumo from '../components/Lumo';
import SpeakButton from '../components/SpeakButton';
import type {PageProps} from '../types';
export default function ChildStory({p,setP,go,t,lang}:PageProps){
 const [wrong,setWrong]=useState(false),[success,setSuccess]=useState(false);const item=chapter.items[p.child.index];
 function choose(bin:string){if(!item||success)return;if(bin!==item.bin){setWrong(true);return;}setWrong(false);setSuccess(true);}
 function next(){setP(prev=>sortItem(prev,item.bin,item.bin));setSuccess(false);}
 return <div className="child-story"><div className="activity-top"><span className="tag">01 · {t(chapter.topic)}</span><span>{Math.min(p.child.index,3)} / 3</span>{!p.child.completed&&<button className="quiet-button" onClick={()=>{if('speechSynthesis'in window)window.speechSynthesis.cancel();setP(prev=>({...prev,child:{...prev.child,paused:true}}));setSuccess(false);}}><Pause size={17}/>{t(c('暂停','Pause'))}</button>}</div>
 {p.child.paused?<section className="pause-card"><Lumo small/><h1>{t(c('休息一下吧。','Zeit für eine Pause.'))}</h1><p>{t(c('Lumo 会等你，进度已经记住啦。','Lumo wartet. Dein Fortschritt bleibt hier.'))}</p><button className="primary" onClick={()=>setP(prev=>({...prev,child:{...prev.child,paused:false}}))}><Play size={20}/>{t(c('继续冒险','Weiterspielen'))}</button><button className="text-button" onClick={()=>go('home')}>{t(c('回到家庭首页','Zur Familienstartseite'))}</button></section>:p.child.completed?<section className="finish-card"><span className="celebration">✦</span><Lumo/><h1>{t(c('森林又整洁啦！','Der Wald ist wieder sauber!'))}</h1><p>{t(c('你帮 3 个小物品找到了家。谢谢你！','Du hast für alle drei Dinge den richtigen Platz gefunden. Danke!'))}</p><button className="primary" onClick={()=>go('tasks')}>{t(c('一起去现实中试试','Jetzt gemeinsam ausprobieren'))}<ArrowRight size={19}/></button><button className="text-button" onClick={()=>{setP(prev=>({...prev,child:{index:0,completed:false,paused:false}}));setWrong(false);}}><RotateCcw size={16}/>{t(c('再玩一次','Noch einmal spielen'))}</button></section>:<>
 <div className="story-dialog"><Lumo small/><div><p>{t(chapter.story)}</p><SpeakButton text={`${t(chapter.story)} ${t(item.label)}. ${t(c('放在哪里呢？','Wo gehört das hin?'))}`} lang={lang} label={t(c('听 Lumo 说','Lumo anhören'))}/></div></div>
 <div className="sorting-scene"><span className="scene-spark">✦</span><div className="item-illustration" aria-hidden="true">{item.icon}</div><h1>{t(item.label)}</h1><p>{t(c('放在哪里呢？','Wo gehört das hin?'))}</p></div>
 <div className="bin-grid">{chapter.bins.map(bin=><button disabled={success} key={bin.id} className={`bin ${bin.color}`} onClick={()=>choose(bin.id)}><span className="bin-picture"><span>{bin.icon}</span></span><strong>{t(bin.label)}</strong><small>{bin.name}</small></button>)}</div>
 <div className={`child-feedback ${success?'positive':''}`} role="status">{success?<><span>🌟 {t(c('找对啦！','Richtig gefunden!'))}</span><button className="primary" onClick={next}>{t(c(p.child.index===2?'完成冒险':'下一个',p.child.index===2?'Abenteuer abschließen':'Weiter'))}<ArrowRight size={19}/></button></>:wrong?<><span>{t(item.hint)}</span><SpeakButton text={t(item.hint)} lang={lang} label={t(c('听提示','Tipp anhören'))}/></>:<span>{t(c('点一点，帮它找到家。','Tippe auf die passende Tonne.'))}</span>}</div>
 </>}</div>;
}
