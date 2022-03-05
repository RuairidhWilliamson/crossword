import words from './words/words_by_length.json';

export function lookupWords(query: string): string[] {
    const length = query.length;
    const possible_words = words[length];
    const regex = new RegExp("^" + query.replace(/ /g, ".") + "$");
    console.log(regex);
    const output = [];
    for (let i = 0; i < possible_words.length; i++) {
        if (regex.test(possible_words[i])) {
            output.push(possible_words[i]);
        }
    }
    return output;
}
