#Loading data from kaggle

import os 
from kaggle.api.kaggle_api_extended import KaggleApi
import pandas as pd
import numpy as np
import cv2



def download_fer_dataset():
    '''Download FER dataset from Kaggle'''

    data_dir = os.path.join(os.getcwd(), 'data')
    os.makedirs(data_dir, exist_ok=True)

    print(f'Downloading FER dataset to {data_dir}')

    
    #Kaggle API
    api = KaggleApi()
    api.authenticate()

    #Download dataset
    api.dataset_download_files('ananthu017/emotion-detection-fer', path=data_dir, unzip=True)


if __name__ == '__main__':
    download_fer_dataset()

    
    

