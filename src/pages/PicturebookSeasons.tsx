import {ArrowRight} from 'lucide-react';
import {picturebookSeasons} from '../data/picturebookCatalog';
import {copy as c} from '../data/content';
import type {PageProps} from '../types';
import './PicturebookCatalog.css';
export default function PicturebookSeasons({go,t}:PageProps){
  return <section className="pb-catalog" aria-label={t(c('绘本季目录','Bilderbuchstaffeln'))}>
    <div className="page-heading"><span className="eyebrow">SONATA · {t(c('绘本阅读','Bilderbuchzeit'))}</span><h1>{t(c('选择一个小世界','Wähle eine neue Welt'))}</h1><p>{t(c('四季故事，和 Sonata 一起探索。','Vier Staffeln voller Geschichten mit Sonata.'))}</p></div>
    <div className="pb-season-list pb-season-integrated">{picturebookSeasons.map(season=><button className="pb-season-card" key={season.id} onClick={()=>go(season.route)}>
      <span className="pb-season-art"><img className="pb-season-frost" src={season.cover} alt="" aria-hidden="true"/><span className="pb-season-glass" aria-hidden="true"/><img className="pb-season-foreground" src={season.cover} alt=""/></span>
      <span className="pb-season-caption"><strong>{t(season.title)}</strong><span className="pb-season-description">{t(season.description)}</span><span className="pb-season-action"><span>{t(c('查看选集','Folgen ansehen'))}</span><span className="pb-season-arrow" aria-hidden="true"><ArrowRight size={25}/></span></span></span>
    </button>)}</div>
  </section>;
}
