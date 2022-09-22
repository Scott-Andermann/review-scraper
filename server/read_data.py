from distutils.command import upload
import pandas as pd
import boto3
from io import StringIO
import numpy as np

def upload_to_s3(df, filename):
    print('uploading')
    bucket = 'amazonreviewdata'
    csv_buffer = StringIO()
    df.to_csv(csv_buffer)
    s3_resource = boto3.resource('s3')
    s3_resource.Object(bucket, f'{filename}.csv').put(
        Body=csv_buffer.getvalue())

bucket = 'amazonreviewdata'
s3_client = boto3.client('s3')
filename = 'FlowZone Typhoon 25 VariablePressure 5Position Battery Powered Backpack Sprayer 4Gallon'

response = s3_client.get_object(
    Bucket=bucket, Key=f'{filename}.csv')

status = response.get("ResponseMetadata", {}).get("HTTPStatusCode")

if status == 200:
    print(f'successful S3 get_object response. Status - {status}')
    df = pd.read_csv(response.get("Body"))
    print(df)
else:
    print("error: " + status)

df['sentiment'] = np.nan

print(df)

upload_to_s3(df, filename)



