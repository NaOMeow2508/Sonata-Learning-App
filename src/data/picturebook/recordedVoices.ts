import {recordingSources} from './recordingSources.ts';

export const recordedVoices: Record<string,string> = Object.fromEntries(
  Object.entries(recordingSources).map(([id,source])=>[id,source.replace(/^voices\//,'')]),
);

export function recordingUrl(audioId:string):string {
  const supplied=recordingSources[audioId];
  return '/picturebook/s01e01-sc01/audio/'+(supplied ?? audioId.replace(/\.mp3$/,'.wav'));
}

