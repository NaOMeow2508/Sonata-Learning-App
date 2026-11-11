export type Language = 'zh' | 'de';
export type Copy = { zh: string; de: string };
export const copy = (zh: string, de: string): Copy => ({ zh, de });
export const chapter = {
 id: 'muelltrennung', title: copy('森林里的分类小队', 'Die Wald-Sortierbande'), topic: copy('垃圾分类', 'Mülltrennung'),
 story: copy('风把东西吹得到处都是。帮 Lumo 找到它们的家吧！', 'Der Wind hat alles verstreut. Hilf Lumo, den richtigen Platz zu finden!'),
 bins: [
  { id: 'paper', icon: '📰', label: copy('纸类', 'Papier'), name: 'Papiertonne', color: 'blue' },
  { id: 'bio', icon: '🍂', label: copy('厨余', 'Bio'), name: 'Biotonne', color: 'brown' },
  { id: 'yellow', icon: '🥛', label: copy('包装', 'Verpackung'), name: 'Gelbe Tonne', color: 'yellow' },
 ],
 items: [
  { id: 'newspaper', icon: '📰', label: copy('旧报纸', 'Die Zeitung'), bin: 'paper', hint: copy('报纸是纸做的。找找纸类桶。', 'Eine Zeitung ist aus Papier. Suche die Papiertonne.') },
  { id: 'banana', icon: '🍌', label: copy('香蕉皮', 'Die Bananenschale'), bin: 'bio', hint: copy('香蕉皮是食物的残余。找找厨余桶。', 'Eine Bananenschale ist ein Obstrest. Suche die Biotonne.') },
  { id: 'yogurt', icon: '🥛', label: copy('空塑料酸奶杯', 'Der leere Joghurtbecher'), bin: 'yellow', hint: copy('这是空塑料包装。找找包装桶。', 'Das ist eine leere Kunststoffverpackung. Suche die Gelbe Tonne.') },
 ],
 words: [{ de: 'die Zeitung', zh: '报纸', icon: '📰' }, { de: 'die Papiertonne', zh: '废纸桶', icon: '🗑️' }, { de: 'trennen', zh: '分类 / 分开', icon: '♻️' }],
 sentences: [{ de: 'Wo gehört das hin?', zh: '这个应该放在哪里？' }, { de: 'Die Zeitung gehört in die Papiertonne.', zh: '报纸应该放进废纸桶。' }],
 quiz: [
  { prompt: copy('“这个应该放在哪里？”用德语怎么说？', 'Wie fragt man nach dem richtigen Platz?'), options: ['Wo gehört das hin?', 'Wie heißt du?', 'Guten Morgen!'], answer: 0, explanation: copy('Wo 问的是地点。Wo gehört das hin? 可以在分类时使用。', 'Mit „Wo gehört das hin?“ fragst du nach dem richtigen Platz.') },
  { prompt: copy('补全句子：Die Zeitung gehört in die …', 'Ergänze: Die Zeitung gehört in die …'), options: ['Biotonne.', 'Papiertonne.', 'Gelbe Tonne.'], answer: 1, explanation: copy('Zeitung 是报纸，Papiertonne 是废纸桶。', 'Die Zeitung ist aus Papier und gehört in die Papiertonne.') },
 ],
 tasks: [
  copy('准备一张干净旧报纸和两个标有“纸类”“其他”的盒子。', 'Legt eine saubere alte Zeitung und zwei Kisten mit „Papier“ und „Andere“ bereit.'),
  copy('母亲问：“Wo gehört das hin?” 让孩子指出报纸的家。', 'Mama fragt: „Wo gehört das hin?“ Das Kind zeigt auf die passende Kiste.'),
  copy('一起说：“Die Zeitung gehört in die Papiertonne.” 然后把报纸放入纸类盒。', 'Sagt gemeinsam: „Die Zeitung gehört in die Papiertonne.“ Legt die Zeitung in die Papierkiste.'),
 ],
 localNote: copy('各地垃圾桶颜色和收集规则可能不同，请以当地规定为准。空塑料酸奶杯与盖子分开；纸套归纸类。本课不涉及押金瓶和特殊垃圾。', 'Farben und Sammelregeln können vor Ort abweichen. Beachte die örtlichen Regeln. Leeren Kunststoffbecher und Deckel trennen; Papierbanderole ins Altpapier. Pfand und Sonderabfälle sind nicht Teil dieser Lektion.'),
};
