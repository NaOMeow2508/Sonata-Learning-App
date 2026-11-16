export function dialogueOrder(pageIndex:number,lineCount:number):number[] {
  return pageIndex===8 ? [1,2,0] : Array.from({length:lineCount},(_,index)=>index);
}
export function availableLine(order:number[],heard:number[],roleLines:number[]):number|undefined {
  const next=order.find(index=>!heard.includes(index));
  if(next!==undefined&&roleLines.includes(next))return next;
  return [...heard].reverse().find(index=>roleLines.includes(index));
}
