Takes Tyrrz's Discord Chat Exporter's exported JSON files and converts them into .jsonl files to use in ChatGPT fine-tuning.

The way the code is written, it only takes messages where there are replies. I don't have it built out to just take any message right now, because honestly I don't know how to approach identifying un-replied (discord reply's) messages as normal pattern of conversation programmatically.

Maybe one day I'll get inspired and have an epiphany. Until then, this works well enough for me.
