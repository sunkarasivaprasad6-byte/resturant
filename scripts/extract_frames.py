import zipfile
import os

desktop_zip = os.path.join('reference', '6aad2319452411845vRZnPdnTS3160_gwr_video_mvp_30fps_webp_frames.zip')
mobile_zip = os.path.join('reference', 'Creating_food_advertisement_video_1080p_20260918172643_gwr_video_mvp_30fps_webp_frames.zip')

os.makedirs(os.path.join('public', 'frames', 'desktop'), exist_ok=True)
os.makedirs(os.path.join('public', 'frames', 'mobile'), exist_ok=True)

print('Extracting desktop frames...')
with zipfile.ZipFile(desktop_zip, 'r') as zd:
    zd.extractall(os.path.join('public', 'frames', 'desktop'))
desktop_count = len(os.listdir(os.path.join('public', 'frames', 'desktop')))
print(f'Desktop frames extracted: {desktop_count}')

print('Extracting mobile frames...')
with zipfile.ZipFile(mobile_zip, 'r') as zm:
    zm.extractall(os.path.join('public', 'frames', 'mobile'))
mobile_count = len(os.listdir(os.path.join('public', 'frames', 'mobile')))
print(f'Mobile frames extracted: {mobile_count}')
