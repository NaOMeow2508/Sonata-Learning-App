import {useEffect,useState} from 'react';
import {Volume2,Square} from 'lucide-react';
export default function SpeakButton({text,lang,label}:{text:string;lang:'zh'|'de';label:string}) {
 const [state,setState]=useState<'idle'|'speaking'|'unavailable'>('idle');
 useEffect(()=>()=>{if('speechSynthesis' in window)window.speechSynthesis.cancel();},[text]);
 function speak(){
  if(!('speechSynthesis' in window)){setState('unavailable');return;}
  if(state==='speaking'){window.speechSynthesis.cancel();setState('idle');return;}
  const voice=window.speechSynthesis.getVoices().find(v=>v.localService&&v.lang.startsWith(lang));
  if(!voice){setState('unavailable');return;}
  window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.voice=voice;utterance.lang=voice.lang;utterance.rate=.85;
  utterance.onend=()=>setState('idle');utterance.onerror=()=>setState('unavailable');setState('speaking');window.speechSynthesis.speak(utterance);
 }
 return <div className="speech"><button className="audio-button" onClick={speak} aria-label={state==='speaking'?(lang==='zh'?'停止朗读':'Vorlesen stoppen'):label}>{state==='speaking'?<Square size={18}/>:<Volume2 size={20}/>}<span>{label}</span></button>{state==='unavailable'&&<small role="status">{lang==='zh'?'未找到本机语音，请一起读文字。':'Keine lokale Stimme verfügbar. Bitte gemeinsam lesen.'}</small>}</div>;
}
