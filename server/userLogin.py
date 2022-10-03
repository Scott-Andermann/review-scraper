from io import StringIO
import boto3
import pandas as pd
from nanoid import generate
import hashlib

s3_client = boto3.client('s3')

def upload_to_s3(df, filename, directory = ''):
    print('uploading')
    BUCKET_NAME = 'amazonreviewdata'
    csv_buffer = StringIO()
    df.to_csv(csv_buffer, index=False)
    s3_resource = boto3.resource('s3')
    s3_resource.Object(BUCKET_NAME, f'{directory}{filename}.csv').put(Body=csv_buffer.getvalue())

def add_user(user):
    BUCKET_NAME = 'amazonreviewdata'
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    # check if user already exists
    user_info = df[df['email'] == user[0]]
    if user_info.empty:
        directory_id = generate('1234567890abcdef', 20) + '/'
        s3_client.put_object(Bucket=BUCKET_NAME, Body=b'', Key=f'{directory_id}')
        user.append(directory_id)
        df.loc[len(df.index)] = user
        upload_to_s3(df, 'UserInfo')
    else:
        print('user already exists')

def check_password(username, password):
    BUCKET_NAME = 'amazonreviewdata'
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
    BUCKET_NAME = 'amazonreviewdata'
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    # assume user exists because this should only be called from valid links
    df.loc[df['email'] == user, 'password'] = password
    upload_to_s3(df, 'UserInfo')

def get_dir(email):
    BUCKET_NAME = 'amazonreviewdata'
    df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    return df.loc[df['email'] == email, 'directory'].values[0]
    
if __name__ == "__main__":
    email_string = 'Scott@blah.com'
    password_string = 'password'


    email = hashlib.sha256(email_string.encode('utf-8')).hexdigest()
    password = hashlib.sha256(password_string.encode('utf-8')).hexdigest()

    add_user([email, password])
    check_password([email, password])

    # directory = get_dir(email)
    # print(directory)

    #create a new file
    # BUCKET_NAME='amazonreviewdata'
    # df = pd.read_csv(f"s3://{BUCKET_NAME}/UserInfo.csv")
    # print(df)
    # upload_to_s3(df, 'new_file', directory)

    # reset_password('user@blah.com', 'new password here')

    # add new account:
    # add user with 'add_user' (email, password, directory(generated))
    # login flow:
    # user enters email & password on app, hash to SHA256
    # pass hashed values to server, 'check_password'
    # pass success/failure with directory_id to app to redirect to main page
    # 