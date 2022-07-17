import json
import gzip
import wget
from tqdm import tqdm
from os.path import exists

def is_abc(word):
    for c in word:
        if not c in abc:
            return False
    return True

abc = "abcdefghijklmnopqrstuvwxyz"
selected_abc = abc
ngrams = [f"googlebooks-eng-all-1gram-20120701-{i}.gz" for i in selected_abc]
for x in ngrams:
    if exists(x):
        print(f"\n{x} already downloaded skipping")
        continue
    print(f"\n{x} missing downloading")
    wget.download(f"http://storage.googleapis.com/books/ngrams/books/{x}")

words_by_length = {}
try:
    print("\nBuilding words by length")
    for letter, fname in zip(selected_abc, ngrams):
        print(f"\nBuilding words starting with {letter}")
        with gzip.open(fname) as f:
            for line in tqdm(f):
                sp = line.decode().split("\t")
                count = int(sp[-1])
                if count < 1000:
                    continue
                word = sp[0]
                word = word.split("_")[0]
                word = word.lower()
                if not is_abc(word):
                    continue
                length = len(word)
                if not length in words_by_length:
                    words_by_length[length] = []
                words_by_length[length].append(word)
except KeyboardInterrupt:
    print("CTRL+C caught stopping...")

print("\nRemoving duplicates")
for i in words_by_length:
    words_by_length[i] = list(set(words_by_length[i]))
print("\nDone writing file")

with open("words_by_length.json", "w") as f:
    output = json.dumps(words_by_length, separators=(',', ':'))
    f.write("export default" + output)

print("\nTotals")
total = 0
for i in range(1, 31):
    count = 0
    if i in words_by_length:
        count = len(words_by_length[i])
    total += count
    print(f"{i}\t{count}")
print(f"Total\t{total}")
