import {copy} from './content';
import type {Route} from '../services/learningProgress';
export const picturebookSeason = {
  title: copy('第一季《人们的生活》', 'Staffel 1 · Das Leben der Menschen'),
  episodes: [
    {id:'s01e01',title:copy('第一集《垃圾分类》','Folge 1 · Mülltrennung'),route:'picturebook/s01e01-sc01' as Route},
    {id:'s01e02',title:copy('第二集《公共交通》','Folge 2 · Öffentliche Verkehrsmittel'),route:null},
    {id:'s01e03',title:copy('第三集《超市购物》','Folge 3 · Einkaufen im Supermarkt'),route:null},
    {id:'s01e04',title:copy('第四集《生活设施》','Folge 4 · Einrichtungen im Alltag'),route:null},
    {id:'s01e05',title:copy('第五集《社区文化活动》','Folge 5 · Kultur im Stadtteil'),route:null},
    {id:'s01special-a',title:copy('《特别篇上》','Sonderfolge · Teil 1'),route:null},
    {id:'s01special-b',title:copy('《特别篇下》','Sonderfolge · Teil 2'),route:null},
  ],
};

export const picturebookSeasons = [
  {id:'season-1',title:picturebookSeason.title,description:copy('和 Sonata 一起发现人们的日常生活。','Entdecke mit Sonata den Alltag der Menschen.'),cover:'/branding/season-1.png',route:'picturebooks/season-1' as Route,episodes:picturebookSeason.episodes},
  {id:'season-2',title:copy('第二季《旋律与色彩》','Staffel 2 · Die Melodien und Farben'),description:copy('和 Sonata 一起探索旋律与色彩。','Entdecke mit Sonata Melodien und Farben.'),cover:'/branding/season-2.png',route:'picturebooks/season-2' as Route,episodes:[]},
  {id:'season-3',title:copy('第三季《我们能做什么》','Staffel 3 · Was können wir tun'),description:copy('和 Sonata 一起发现我们能做的小小行动。','Entdecke mit Sonata, was wir gemeinsam tun können.'),cover:'/branding/season-3.png',route:'picturebooks/season-3' as Route,episodes:[]},
  {id:'season-4',title:copy('第四季《为什么会这样？》','Staffel 4 · Warum ist das so?'),description:copy('和 Sonata 一起提问，发现身边的为什么。','Stelle mit Sonata Fragen und entdecke das Warum im Alltag.'),cover:'/branding/season-4.png',route:'picturebooks/season-4' as Route,episodes:[]},
];

