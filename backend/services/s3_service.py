# import boto3
# import os

# s3 = boto3.client(
#     "s3",
#     aws_access_key_id=os.getenv("AWS_ACCESS_KEY"),
#     aws_secret_access_key=os.getenv("AWS_SECRET_KEY"),
#     # region_name="ap-south-1"
# )

# def upload_file_to_s3(file, filename):
#     s3.upload_fileobj(
#         file,
#         os.getenv("S3_BUCKET"),
#         filename
#     )

#     return f"https://{os.getenv('S3_BUCKET')}.s3.amazonaws.com/{filename}"


# def delete_file_from_s3(filename):
#     s3.delete_object(
#         Bucket=os.getenv("S3_BUCKET"),
#         Key=filename
#     )