import {ArrowRight,BookOpen,Heart,Check,Leaf} from 'lucide-react';
import {copy as c} from '../data/content';
import type {PageProps} from '../types';
import './FamilyHome.css';
export default function FamilyHome({p,go,t}:PageProps){
  return <div className="family-home">
    <div className="home-welcome"><h1>{t(c('今天，和 Sonata 一起发现','Heute mit Sonata die Welt entdecken'))}</h1><p>{t(c('一部手机，两条学习小路','Ein Handy, zwei kleine Lernwege'))}</p><span aria-hidden="true">✦</span></div>
    <section className="home-story-card">
      <div className="home-story-art"><img src="/branding/home-picturebook-background.png?v=a00b7cac457c" alt={t(c('Sonata 绘本世界','Sonatas Bilderbuchwelt'))}/></div>
      <div className="home-story-content"><h2>{t(c('和 Sonata 一起冒险','Mit Sonata auf Entdeckungsreise'))}</h2><button className="home-read-button" onClick={()=>go('picturebooks')}>{t(c('开始绘本阅读','Zum Bilderbuch'))}<ArrowRight size={28}/></button></div>
    </section>
    <div className="home-features">
      <button className="home-feature home-child" onClick={()=>go('map')}><img className="home-cat" src="/branding/sonata-adventure.png" alt="Sonata"/><span className="home-feature-copy"><strong>{t(c('儿童冒险','Abenteuer für Kinder'))}</strong><span>{t(c('听故事，玩分类游戏','Geschichten hören und Sortieren spielen'))}</span>{p.child.completed&&<small><Check size={16}/>{t(c('首章已完成','Erstes Kapitel geschafft'))}</small>}</span><ArrowRight className="home-feature-arrow" size={28}/></button>
      <button className="home-feature home-mother" onClick={()=>go('mother')}><span className="home-book-art" aria-hidden="true"><BookOpen size={54}/><span>✦</span></span><span className="home-feature-copy"><strong>{t(c('妈妈的学习时间','Lernzeit für Mama'))}</strong><span>{t(c('每天一点生活德语','Ein bisschen Deutsch für den Alltag'))}</span>{p.adult.completed&&<small><Check size={16}/>{t(c('微课程已完成','Lektion geschafft'))}</small>}</span><ArrowRight className="home-feature-arrow" size={28}/></button>
      <button className="home-feature home-together" onClick={()=>go('tasks')}><Heart size={40}/><span className="home-feature-copy"><strong>{t(c('一起完成家庭小任务','Gemeinsam im Alltag ausprobieren'))}</strong><span>{t(c('放下手机，一起试一试','Handy zur Seite und gemeinsam loslegen'))}</span></span><ArrowRight className="home-feature-arrow" size={26}/></button>
    </div>
    <p className="home-gentle"><Leaf size={18}/>{t(c('没有排名，没有赶进度。每一小步都很珍贵。','Keine Rangliste, kein Zeitdruck. Jeder kleine Schritt zählt.'))}</p>
  </div>;
}

