from flask import Flask, request, jsonify, Response
import boto3
import json
import pandas as pd
from nanoid import generate
from amazon_scraper import get_title, run_main
import userLogin

api = Flask(__name__)
s3_client = boto3.client('s3')
# create bucket with random string that is linked to username?
BUCKET_NAME = 'amazonreviewdata'
# all_objects = []
users = {'Scott': 'password', 'Kelsey': 'Huck'}
all_objects = []

def get_all_objects_in_bucket(bucket_name):
    all_objects_in_bucket = []
    for key in s3_client.list_objects(Bucket=BUCKET_NAME)['Contents']:
        all_objects_in_bucket.append({"title": key['Key'], "complete": True, "id": key['Key'][0:10]})
    return all_objects_in_bucket

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
    args = request.args
    bucket = args.get('bucket')
    print(bucket)
    all_objects = get_all_objects_in_bucket(bucket)
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
        directory = data['directory']
        id = data['id']
        page_count = data['pageCount']
        title = data['title']
        print(f'Scraping {page_count} pages')
        run_main(id, page_count, title, directory)
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
    global users
    if request.method == 'POST':
        data = json.loads(request.data)
        print(data)
        username = data['username']
        password = data['password']
        if userLogin.check_password(username, password) == True:
            directory = userLogin.get_dir(username)
            print('success')
            return {'token': 'OK', 'directory': directory}
        # userlist stored in S3 with passwords hashed - will need a password reset function too

        # try:
        #     # need to decode username and password before checking
        #     if users[username] == password:
        #         print('Bucket name for Scott')
        #         # need to hash the BUCKET_NAME
        #         return {"token": 'OK', 'BUCKET_NAME': 'amazonreviewdata'}
        # except KeyError:
        #     return {"token": 'Bad user/password'}        

        # return {"token": 'Bad user/password'}

@api.route('/add_user', methods=['POST'])
def add_user():
    print('ADD USER /')
    # read users from external db
    global users
    # print(users)
    if request.method == 'POST':
        data=json.loads(request.data)
        print(data)
        users[data['username']] = data['password']
        # create new s3 bucket
        location = {'LocationConstraint': 'us-east-1'}
        new_bucket = print(generate('1234567890abcdef', 30))
        # s3_client.create_bucket(Bucket=new_bucket)
        # save new user, password, and bucket name in .csv file?

        return 'success'