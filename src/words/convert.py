import json
from tqdm import tqdm

with open("words_alpha.txt") as f:
    words = f.read().split("\n")
words_by_length = {}

for word in tqdm(words):
    length = len(word)
    if not length in words_by_length:
        words_by_length[length] = []
    words_by_length[length].append(word)

with open("words_by_length.json", "w") as f:
    json.dump(words_by_length, f, separators=(',', ':'))