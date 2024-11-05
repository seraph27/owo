import os
from openai import OpenAI
from os.path import join, dirname
from dotenv import load_dotenv
from collections import defaultdict
import json

# dotenv_path = join(dirname(__file__), '.env')
# load_dotenv(dotenv_path)
api_key = os.environ.get("API_KEY")

client = OpenAI(
    api_key=api_key
)

#chatgpt part
def get_keywords_from_paper(paper_title):
    # Define the prompt for the API
    prompt = f"請你給我20個和這篇論文有關的中文專有名詞/keyword/相關詞彙'{paper_title}'. 長短皆可，不相關的請不要講不要贅述. please seperate each word with a comma, do not include numbers "

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
    )
    keywords = response.choices[0].message.content
    keywords = ''.join(keywords.split()).split(',')
    return keywords


# Function to create a dictionary from JSON data for fast lookup
def create_lookup_dict(data):
    lookup_dict = defaultdict(lambda: defaultdict(int))
    for paper in data:
        keywords = paper.get('keyword', '')
        keywords_list = keywords.split('；')
        name = paper.get('info', '')
        for keyword in keywords_list:
            lookup_dict[keyword][name] += 1 
    return lookup_dict

# Function to lookup names using keywords
def lookup_names(keywords, lookup_dict):
    counts = {}
    for keyword in keywords:
        if keyword in lookup_dict:
            for key, value in dict(lookup_dict[keyword]).items():
                if(counts.get(key)): counts[key] += value
                else: counts[key] = value
    counts = dict(sorted(counts.items(), key=lambda x: x[1], reverse=True)[:10])
    return counts

def get_res(papername) :
    keywords = get_keywords_from_paper(papername)
    # for keyword in keywords:
    #     print(keyword)

    # Load JSON data from file
    with open('backend/data/requests_test1.json', 'r', encoding='utf-8') as file:
        data = json.load(file)

    ans = lookup_names(keywords, create_lookup_dict(data))
    print(ans)
    # for name, cnt in ans.items():
    #     print(name, cnt)
    return ans
