from types import NoneType
from xml.sax.handler import property_lexical_handler
import pandas as pd
import re
import time
from bs4 import BeautifulSoup
import random
import requests
from datetime import datetime
from sentiment import sentiment
import json
from userLogin import upload_to_s3
#page = 1
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0", "Accept-Encoding": "gzip, deflate",
           "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "DNT": "1", "Connection": "close", "Upgrade-Insecure-Requests": "1"}

proxy_url = 'http://api.proxiesapi.com/?auth_key=2763fb4208f90f38babd2782225d6fae_sr98766_ooPq87&url='


def get_title(pages, item_no):

    r = requests.get(f'{proxy_url}http://www.amazon.com/dp/{item_no}',
                     headers=headers)

    content = r.content
    soup = BeautifulSoup(content, features='lxml')
    # print(soup)
    try:
        title_text = soup.find(
            'h1', attrs={'class': 'a-size-large'})
        # print(title_text.text)
        image = soup.find('img', id='landingImage')
        title = re.sub('[^A-Za-z0-9 ]+', '', title_text.text)
        return title, image['src']
    except AttributeError:
        return 'exit', 'https://cdn-icons-png.flaticon.com/512/107/107817.png'
    except TypeError:
        return 'Scraping Error', 'https://cdn-icons-png.flaticon.com/512/107/107817.png'

def convert_date(date):
    res = re.sub(r'[^\w\s]', '', date)
    res = res.split()[-3:]
    s = ' '.join(res)
    parsed = datetime.strptime(s, '%B %d %Y')
    return parsed

def get_data(pages, item_no):
    reviews = []
    r = requests.get(f'{proxy_url}https://www.amazon.com/product-reviews/{item_no}/ref=cm_cr_arp_d_viewopt_sr?ie=UTF8&filterByStar=all_stars&reviewerType=all_reviews&pageNumber={pages}#reviews-filter-bar',
                     headers=headers)

    content = r.content
    soup = BeautifulSoup(content, features='lxml')
    # print(soup)
    # print(soup.prettify())
    try:
        for d in soup.findAll('div', attrs={'class': 'a-section celwidget'}):
            # print('div found: ' + d)
            try:
                title = d.find('a', attrs={'data-hook': 'review-title'})
                rev = d.find('span', attrs={'data-hook': 'review-body'})
                stars = d.find('i', attrs={'data-hook': 'review-star-rating'})
                date = d.find('span', attrs={'data-hook': 'review-date'})
                # reviews.append(rev.text.strip())
                r_title = title.find('span').text
                r = rev.find('span').text.strip()
                r_stars = stars.find('span').text[0]
                r_date = date.text
                r_date = convert_date(r_date)
                reviews.append([r_title, r, r_stars, r_date])
            except AttributeError as e:
                print(e)
                continue
        # print('Reviews: ', reviews)
        return reviews
    except AttributeError as e:
        print('ERROR: ' + e)
        return 'exit'

def get_img_src(item_no):
    r = requests.get(f'{proxy_url}http://www.amazon.com/dp/{item_no}', headers=headers)

    content = r.content
    # print(content)
    soup = BeautifulSoup(content, features='lxml')

    try:
        element = soup.find('img', id='landingImage')
        return element['src']
    except AttributeError as e:
        print('Error: ', e)
    except TypeError as e:
        print('Error: ', e)
        return 'https://cdn-icons-png.flaticon.com/512/107/107817.png'

# def upload_to_s3(df, filename):
#     print('uploading')
#     BUCKET_NAME = 'amazonreviewdata'
#     csv_buffer = StringIO()
#     df.to_csv(csv_buffer, index=False)
#     s3_resource = boto3.resource('s3')
#     s3_resource.Object(BUCKET_NAME, f'{filename}.csv').put(
#         Body=csv_buffer.getvalue())


def run_main_node(arg):
    all_reviews = []
    res = json.loads(arg)

    pages = int(res['pageCount'])
    item_no = res['item_no']


    title = item_no + get_title(1, item_no)
    # title = re.sub('[^A-Za-z0-9 ]+', '', title)

    for page in range(1, pages):

        # print(f'Scraping page {page}')
        data = get_data(page, item_no)
        if data == 'exit' or data == []:
            break
        all_reviews.append(data)
        pause = random.uniform(1, 5)
        # print(f'Pausing for {pause} seconds')
        time.sleep(pause)

    def flatten(l): return [item for sublist in l for item in sublist]
    df = pd.DataFrame(flatten(all_reviews), columns=[
                      'Title', 'Review', 'StarRating', 'Date'])
    # df.to_csv(f'scraped-data/{title}.csv', index=False, encoding='utf-8')
    df = sentiment(df)
    # print(df)
    upload_to_s3(df, title)
    # print(f'Finished scraping {title}, {len(df.index)} reviews gathered')
    # print({'title': title, 'numberReviews': len(df.index)})

def run_main(item_no, pages, title):
    all_reviews = []
    for page in range(1, int(pages)):
        data = get_data(page, item_no)
        if data == 'exit' or data == []:
            break
        all_reviews.append(data)
        pause = random.uniform(1, 5)
        time.sleep(pause)
    def flatten(l): return [item for sublist in l for item in sublist]
    df = pd.DataFrame(flatten(all_reviews), columns=[
                      'Title', 'Review', 'StarRating', 'Date'])
    # df.to_csv(f'scraped-data/{title}.csv', index=False, encoding='utf-8')
    df = sentiment(df)
    # print(df)
    upload_to_s3(df, title)
    return len(df.index)
    # print(f'Finished scraping {title}, {len(df.index)} reviews gathered')
    # print({'title': title, 'numberReviews': len(df.index)})


# run_main('B08VF6ZVMH', '10')

if __name__ == "__main__":
    print(get_img_src('B079JLY5M5'))