import os
from dotenv import load_dotenv
from flask import Flask, request, Response
import boto3
import json
import pandas as pd
from nanoid import generate
from amazon_scraper import get_title, run_main, get_img_src
from indexMethods import add_to_index, remove_from_index, get_objects_from_index
import userLogin

api = Flask(__name__)
load_dotenv()
AWS_ACCESS_KEY_ID= os.environ['AWS_ACCESS_KEY_ID']
AWS_SECRET_ACCESS_KEY= os.environ['AWS_SECRET_ACCESS_KEY']
s3_client = boto3.client('s3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY)
BUCKET_NAME = 'amazonreviewdata'

def get_all_objects_in_directory(directory):
    all_objects_in_directory = []
    # print('Directory: ', directory)
    for key in s3_client.list_objects(Bucket=BUCKET_NAME)['Contents']:
        if (directory in key['Key']):
            if (directory == key['Key'] or 'index' in key['Key']):
                continue
            all_objects_in_directory.append({"title": key['Key'], "complete": True, "id": key['Key'][0:10]})
    return all_objects_in_directory

@api.route('/')
def home():
    response_body = {
        "name": "Scott Andermann",
        "about": "It's working so far! need to set up env variables"
    }
    return response_body

@api.route('/profile')
def my_profile():
    response_body = {
        "name": "Scott Andermann",
        "about": "the about section goes here"
    }
    return response_body

@api.route('/all_objects')
def get_all_objects():
    args = request.args
    directory = args.get('directory')
    # all_objects = get_all_objects_in_directory(directory)
    # get objects from index
    all_objects = get_objects_from_index(directory)
    # print(all_objects_2)
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
        # scrape for image src
        src = get_img_src(id)
        # remove extra spaces from title variable
        while '  ' in title:
            title = title.replace('  ', ' ')
        return {"title": title, "complete": False, "id": id, "src": src}
    return 'Error, invalid request'

@api.route('/scrape', methods=['POST'])
def scrape():
    print('SCRAPING WEBPAGE /')
    if request.method == 'POST':
        data = json.loads(request.data)
        id = data['id']
        page_count = data['pageCount']
        title = data['title']
        src = data['src']
        print(title)
        print(f'Scraping {page_count} pages')
        num = run_main(id, page_count, title)
        item = [id, src, title + '.csv', num, True]
        add_to_index(item, item[2][0:21])
        # update index file
        return {"status": 'success', "num": num}
    return 'Error, invalid request'

@api.route('/delete', methods=['POST'])
def delete_object():
    print('DELETE OBJECT /')
    if request.method == 'POST':
        data = json.loads(request.data)
        item_title = data['itemTitle']
        s3_client.delete_object(Bucket=BUCKET_NAME, Key=f'{item_title}')
        print(item_title)
        remove_from_index(item_title, item_title[0:21])
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
        username = data['username']
        password = data['password']
        if userLogin.check_password(username, password) == True:
            directory = userLogin.get_dir(username)
            return {'token': 'OK', 'directory': directory}
    return {}

@api.route('/add_user', methods=['POST'])
def add_user():
    print('ADD USER /')
    if request.method == 'POST':
        data=json.loads(request.data)
        username = data['username']
        password = data['password']
        status = userLogin.add_user([username, password])
        if status:
            return 'success'
        else:
            return 'Account already exists for that email'