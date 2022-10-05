# add new account:
# add user with 'add_user' (email, password) directory generated and stored with user credentials
# login flow:
# user enters email & password on app, hash to SHA256
# pass hashed values to server, 'check_password'
# pass success/failure with directory_id to app to redirect to main page
# 

from io import StringIO
import boto3
import pandas as pd
from nanoid import generate
import hashlib

s3_client = boto3.client('s3')

BUCKET_NAME = 'amazonreviewdata'

def upload_to_s3(df, filename, directory = ''):
    print('uploading')
    global BUCKET_NAME
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    s3_resource = boto3.resource('s3')
    s3_resource.Object(BUCKET_NAME, f'{directory}{filename}.csv').put(Body=csv_buffer.getvalue())

def add_user(user):
    global BUCKET_NAME
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    # check if user already exists
    user_info = df[df['email'] == user[0]]
    if user_info.empty:
        directory_id = generate('1234567890abcdef', 20) + '/'
        s3_client.put_object(Bucket=BUCKET_NAME, Body=b'', Key=f'{directory_id}')
        # create index file for image link storage
        index_df = pd.DataFrame(columns=['id', 'src', 'title', 'num', 'complete'])
        upload_to_s3(index_df, 'index', directory_id)
        # add user data to UserInfo file
        user.append(directory_id)
        df.loc[len(df.index)] = user
        upload_to_s3(df, 'UserInfo')
        return True
    else:
        print('user already exists')
        return False

def check_password(username, password):
    global BUCKET_NAME
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    user_info = df[df['email'] == username]
    if not user_info.empty:
        if password == user_info['password'].iloc[0]:
            # directory = get_dir(username)
            return True
        else:
            return 'Incorrect password'
    else:
        return 'User does not exist'

def reset_password(user, password):
    global BUCKET_NAME
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    # assume user exists because this should only be called from valid links
    df.loc[df['email'] == user, 'password'] = password
    upload_to_s3(df, 'UserInfo')

def get_dir(email):
    global BUCKET_NAME
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    return df.loc[df['email'] == email, 'directory'].values[0]

def delete_user(email):
    global BUCKET_NAME
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    df = df.loc[df['email'] != email]
    upload_to_s3(df, 'UserInfo')

    # print(df)

    
if __name__ == "__main__":
    # email_string = 'Scott@blah.com'
    # password_string = 'password'

    # email = hashlib.sha256(email_string.encode('utf-8')).hexdigest()
    # password = hashlib.sha256(password_string.encode('utf-8')).hexdigest()

    # add_user([email, password])
    # check_password([email, password])
    email = 'scott@gmail.com'
    delete_user(email)