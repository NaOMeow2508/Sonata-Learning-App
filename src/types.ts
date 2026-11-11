import type {Copy,Language} from './data/content';
import type {Progress,Route} from './services/learningProgress';
export type PageProps={p:Progress;setP:(update:(p:Progress)=>Progress)=>void;go:(route:Route)=>void;lang:Language;t:(copy:Copy)=>string};
