from cmath import log
from flask import Flask, request
import boto3
import json
from amazon_scraper import get_title, run_main

api = Flask(__name__)
s3_client = boto3.client('s3')
BUCKET_NAME = 'amazonreviewdata'
all_objects = []

for key in s3_client.list_objects(Bucket=BUCKET_NAME)['Contents']:
    all_objects.append({"title": key['Key'][:-4], "complete": True, "id": key['Key'][0:10]})

@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Scott Andermann",
        "about": "the about section goes here"
    }
    return response_body

@api.route('/all_objects')
def get_all_objects():
    # all_objects = []
    response_body = {
        "type": "all_objects",
        "data": all_objects
    }
    return response_body

@api.route('/add', methods=['POST'])
def add_object():
    print('ADD OBJECT /')
    if request.method == 'POST':
        data = json.loads(request.data)
        id = data['id']
        title = get_title(1, id)
        return {"title": title}
    return 'Error, invalid request'

@api.route('/scrape', methods=['POST'])
def scrape():
    print('SCRAPING WEBPAGE /')
    if request.method == 'POST':
        data = json.loads(request.data)
        id = data['id']
        page_count = data['pageCount']
        title = data['title']
        print(f'Scraping {page_count} pages')
        run_main(id, page_count, title)
        return 'success'
    return 'Error, invalid request'

@api.route('/delete', methods=['POST'])
def delete_object():
    print('DELETE OBJECT /')
    if request.method == 'POST':
        data = json.loads(request.data)
        item_title = data['itemTitle']
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=f'{item_title}.csv')
        return 'success'
    return 'Error, invalid request'

@api.route('/download')
def download_object():
    print('DOWNLOAD OBJECT /')
    return 'success'