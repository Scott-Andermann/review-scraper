from flask import Flask, request, jsonify, Response
import boto3
import json
import pandas as pd
from amazon_scraper import get_title, run_main

api = Flask(__name__)
s3_client = boto3.client('s3')
BUCKET_NAME = 'amazonreviewdata'
all_objects = []

for key in s3_client.list_objects(Bucket=BUCKET_NAME)['Contents']:
    all_objects.append({"title": key['Key'], "complete": True, "id": key['Key'][0:10]})

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
    global all_objects
    print('ADD OBJECT /')
    if request.method == 'POST':
        data = json.loads(request.data)
        id = data['id']
        title = get_title(1, id)
        # remove extra spaces from title variable
        while '  ' in title:
            title = title.replace('  ', ' ')
        # title = id + title + '.csv'
        all_objects.append({"title": id + title + '.csv', "complete": False, "id": id})
        return {"title": title}
    return 'Error, invalid request'

@api.route('/scrape', methods=['POST'])
def scrape():
    print('SCRAPING WEBPAGE /')
    global all_objects
    if request.method == 'POST':
        data = json.loads(request.data)
        id = data['id']
        page_count = data['pageCount']
        title = data['title']
        print(f'Scraping {page_count} pages')
        run_main(id, page_count, title)
        index = all_objects.index({"title": title + '.csv', "complete": False, "id": id})
        all_objects[index] = {"title": title + '.csv', "complete": True, "id": id}
        return 'success'
    return 'Error, invalid request'

@api.route('/delete', methods=['POST'])
def delete_object():
    global all_objects
    print('DELETE OBJECT /')
    if request.method == 'POST':
        data = json.loads(request.data)
        item_title = data['itemTitle']
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=f'{item_title}')
        all_objects = list(filter(lambda i: i['title'] != f'{item_title}.csv', all_objects))
        return 'success'
    return 'Error, invalid request'

@api.route('/get_data', methods=['POST'])
def get_data():
    print('GET DATA /')
    if request.method == 'POST':
        data = json.loads(request.data)
        csv_data = []
        for key in data['selection']:
            df = pd.read_csv(f"s3://{BUCKET_NAME}/{key}")
            csv_data.append({"name": key, "data": json.loads(df.to_json(orient='records'))}) # this is a string
        resp = Response(response=json.dumps(csv_data), status=200, mimetype='application/json')
        return resp
    return 'Error: invalid input'

@api.route('/download')
def download_object():
    print('DOWNLOAD OBJECT /')
    return 'success'

@api.route('/login', methods=['POST'])
def login_user():
    print('LOGIN USER /')
    if request.method == 'POST':
        data = json.loads(request.data)
        print(data)
        username = data['username']
        password = data['password']
        print(username, ': ', password)
    return {"token": 'test123'}