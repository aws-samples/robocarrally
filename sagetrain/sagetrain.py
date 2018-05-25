import os
import sagemaker as sage
from sagemaker import get_execution_role

sagemaker_session = sage.Session()

role = get_execution_role()

inputs = "s3://sagemaker-us-east-1-xxxx/data/racecar/"
image="writeyourimagename"
algo = sage.estimator.Estimator(image,
                       role, 1, 'ml.p3.2xlarge',
                       output_path="s3://{}/output".format(sagemaker_session.default_bucket()),
                       sagemaker_session=sagemaker_session)

algo.fit(inputs)
