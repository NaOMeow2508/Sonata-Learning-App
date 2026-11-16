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
