import {ArrowRight,BookOpen,Clock3} from 'lucide-react';
import {picturebookSeason} from '../data/picturebookCatalog';
import {copy as c} from '../data/content';
import type {PageProps} from '../types';
import './PicturebookCatalog.css';
export default function PicturebookCatalog({go,t}:PageProps){
  return <section className="pb-catalog" aria-label={t(c('绘本剧集目录','Bilderbuchfolgen'))}>
    <div className="page-heading">
      <span className="eyebrow">SONATA · {t(c('绘本阅读','Bilderbuchzeit'))}</span>
      <h1>{t(c('选择一段新的故事。','Wähle eine neue Geschichte.'))}</h1>
      <p>{t(c('和 Sonata 一起，在生活中发现小小的冒险。','Entdecke mit Sonata kleine Abenteuer im Alltag.'))}</p>
    </div>
    <h2>{t(picturebookSeason.title)}</h2>
    <div className="pb-episode-list">{picturebookSeason.episodes.map((episode,index)=><button
      key={episode.id}
      className="pb-episode"
      disabled={!episode.route}
      onClick={()=>{if(episode.route)go(episode.route);}}
    >
      <span className="pb-episode-icon"><BookOpen size={25}/></span>
      <span className="pb-episode-copy">
        <small>{index<5?t(c(`第 ${index+1} 集`,`FOLGE 0${index+1}`)):t(c('特别篇','SONDERFOLGE'))}</small>
        <strong>{t(episode.title)}</strong>
        <span>{t(episode.route?c('进入互动绘本 · 德语对白与中文字幕','Interaktives Bilderbuch · Deutsche Dialoge und chinesische Untertitel'):c('即将推出','Demnächst verfügbar'))}</span>
      </span>
      {episode.route?<ArrowRight size={21}/>:<Clock3 size={19} aria-hidden="true"/>}
    </button>)}</div>
  </section>;
}
