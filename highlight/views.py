import json
import requests
import re
import textwrap

from bs4 import BeautifulSoup

from django.shortcuts import render
from django.contrib.auth.models import User
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt

import spacy
import torch
from transformers import LukeTokenizer, LukeForEntitySpanClassification

from tqdm import tqdm

def index(request):
    # loading model
    global model, tokenizer
    model = LukeForEntitySpanClassification.from_pretrained("luke_model/luke-large-finetuned-conll-2003")
    model.eval()
    tokenizer = LukeTokenizer.from_pretrained("luke_model/luke-large-finetuned-conll-2003")   
    return HttpResponse("Entity highlighter model loaded!")

@csrf_exempt
def find_entities(request):
    #print('we got here')
    #print(json.loads(request.body))
    text = json.loads(request.body)['site_text'][0]
    nlp = spacy.load("en_core_web_sm")

    total_doc = []
    total_sequence = []

    tokens = nlp(text)
    #count = 1
    for sent in tqdm(tokens.sents, total=len(list(tokens.sents))):
        #doc = nlp(chunk)
        clean = str(sent).strip()
        doc = nlp(clean)

        entity_spans = []
        original_word_spans = []
        for token_start in doc:
            for token_end in doc[token_start.i:]:
                entity_spans.append((token_start.idx, token_end.idx + len(token_end)))
                original_word_spans.append((token_start.i, token_end.i + 1))

        inputs = tokenizer(clean, entity_spans=entity_spans, return_tensors="pt", padding=True)
        #inputs = inputs.to("cuda")
        with torch.no_grad():
            outputs = model(**inputs)

        logits = outputs.logits
        max_logits, max_indices = logits[0].max(dim=1)

        predictions = []
        for logit, index, span in zip(max_logits, max_indices, original_word_spans):
            if index != 0:  # the span is not NIL
                predictions.append((logit, span, model.config.id2label[int(index)]))

        # construct an IOB2 label sequence
        predicted_sequence = ["O"] * len(doc)
        for _, span, label in sorted(predictions, key=lambda o: o[0], reverse=True):
            if all([o == "O" for o in predicted_sequence[span[0] : span[1]]]):
                predicted_sequence[span[0]] = "B-" + label
                if span[1] - span[0] > 1:
                    predicted_sequence[span[0] + 1 : span[1]] = ["I-" + label] * (span[1] - span[0] - 1)
        
        total_doc += doc
        total_sequence += predicted_sequence
        #print(f'Sentence processed {count}/{len(list(tokens.sents))}')
        #count += 1

    entities = set()
    entity = []
    #print(total_sequence)
    for token, tag in zip(total_doc, total_sequence):
        if 'B' in tag or 'I' in tag:
            entity.append(str(token))
        elif 'O' in tag and len(entity) > 0:
            new_e = ' '.join(entity).replace(' - ', '-')
            quotes = [m.start() for m in re.finditer('\'', new_e)]
            if len(quotes) == 2:
                new_e = new_e[0:quotes[0]+1] + new_e[quotes[0]+2:quotes[1]-1] + new_e[quotes[1]:]
                entities.add(new_e)
            else:
                entities.add(new_e.replace(' \' ', '\''))
            entity.clear()
    if len(entity) > 0:
        entities.add(' '.join(entity))
    #print(entities)

    data = {'entities': list(entities)}

    return JsonResponse(data)