import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import re
import time
from datetime import datetime
import matplotlib.dates as mdates
import matplotlib.ticker as ticker
from urllib.request import urlopen
from bs4 import BeautifulSoup
import random
import requests
#page = 1
headers = {"Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"}
all_reviews = []
def star_val_switcher(num):
    star_dict = {'0':5,
                 '8':4,
                 '6':3,
                 '4':2,
                 '2':1}
    return star_dict[num]
def get_data(pages):
    reviews = []
    r = requests.get(f'https://www.homedepot.com/p/reviews/RYOBI-ONE-18V-Cordless-Battery-1-Gal-Chemical-Sprayer-with-1-3-Ah-Battery-and-Charger-P2810/206339956/{pages}',
                     headers=headers,
                     timeout=5)
    content = r.content
    soup = BeautifulSoup(content, features='lxml')

    #input(print(soup.prettify()))
    try:
        #print(soup.findAll('div', attrs={'class':'review_item'}))
        for d in soup.findAll('div', attrs={'class':'review_item'}):
            #input(d)
            title = d.find('span', attrs={'class':'review-content__title'})
            rev = d.find('div', attrs={'class':'review-content-body'})
            stars = d.find('span', attrs={'class':'stars'})
            date = d.find('span', attrs={'class':'review-content__date'})
            #print(title)
            #print(rev)
            rating = str(stars)
            rating = rating[-12:]
            stars = star_val_switcher(rating[0])
            #print(stars)
            r_title = title.text
            r = rev.text
            r_date = date.text
            if r == 'Rating provided by a verified purchaser':
                r = ''
            reviews.append([r_title, r, stars, r_date])
            #print(reviews)
        return reviews
    except AttributeError:
        print('Error: ')
        return 'exit'
    except Exception as e:
        print(e)

        return 'exit'

        # print(reviews)
pages = 50
count = 0
for page in range(1, pages):
    print(f'Scraping page {page}')
    data = get_data(page)
    #print(data)
    if data == 'exit' or data ==[]:
        print('blank')
        count += 1
        if count == 3:
            break
        continue
    all_reviews.append(data)
    pause = random.uniform(10, 15)
    print(f'Pausing for {pause} seconds')
    time.sleep(pause)
    count = 0
#print(all_reviews)
flatten = lambda l: [item for sublist in l for item in sublist]
df = pd.DataFrame(flatten(all_reviews), columns=['Title', 'Review', 'StarRating', 'Date'])
#print(df.head())
df.to_csv('ryobi_1gal_hd_reviews.csv', index=False, encoding='utf-8')
print(f'Finished scraping, {len(df.index)} reviews gathered')
