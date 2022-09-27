import sys
import boto3
import logging
from botocore.exceptions import ClientError
import os

s3_client = boto3.client('s3')

# keeping this for now as a reference

bucket_name = 'amazonreviewdata'

testfile = 'C:\\Users\\Scott\\Documents\\Personal\\review-scraper\\server\\scraped-data\\FlowZone Typhoon 25 VariablePressure 5Position Battery Powered Backpack Sprayer 4Gallon.csv'


def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = os.path.basename(file_name)

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True

def list_all_objects():
    s3_client = boto3.client('s3')
    for key in s3_client.list_objects(Bucket='amazonreviewdata')['Contents']:
        print(key['Key'])

# upload_file(testfile, bucket_name)

list_all_objects()