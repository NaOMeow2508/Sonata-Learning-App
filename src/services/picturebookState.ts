export const picturebookKey = 'kleine-welten-picturebook-v1';
export const noVoiceMessage = '本机暂无可用的德语语音，请阅读字幕。';
export type ReadingState = {page:number; subtitles:'parallel'|'reveal'; configured:boolean; portraitDismissed:boolean};
export function parseReadingState(raw:string|null):ReadingState {
  const defaults:ReadingState = {page:0,subtitles:'parallel',configured:false,portraitDismissed:false};
  try {
    const value = JSON.parse(raw || 'null');
    if (!value || typeof value !== 'object') return defaults;
    return {page:Number.isInteger(value.page) && value.page>=0 && value.page<9 ? value.page:0,subtitles:value.subtitles==='reveal'?'reveal':'parallel',configured:value.configured===true,portraitDismissed:value.portraitDismissed===true};
  } catch {return defaults;}
}
export function loadReadingState():ReadingState {
  try {return parseReadingState(localStorage.getItem(picturebookKey));} catch {return parseReadingState(null);}
}
export function saveReadingState(state:ReadingState):boolean {
  try {localStorage.setItem(picturebookKey,JSON.stringify(state));return true;} catch {return false;}
}
export function selectLocalVoice(voices:SpeechSynthesisVoice[],speaker:string):SpeechSynthesisVoice|undefined {
  const local = voices.filter(voice=>voice.localService && voice.lang.startsWith('de'));
  const index = speaker==='孩子'?1:speaker==='工作人员'?2:0;
  return local[index % local.length];
}
