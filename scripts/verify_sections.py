import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def run_verification():
    # 1. Desktop Verification
    print("Starting Desktop Verification (1440x900)...")
    options = Options()
    options.add_argument('--headless=new')
    options.add_argument('--disable-gpu')
    options.add_argument('--window-size=1440,900')

    driver = webdriver.Chrome(options=options)
    driver.get('http://localhost:5173')
    time.sleep(2)

    # Scroll to location section
    loc = driver.find_element(By.ID, 'location-section')
    driver.execute_script('arguments[0].scrollIntoView({behavior: "instant", block: "start"});', loc)
    time.sleep(1)
    driver.save_screenshot('desktop_location.png')
    print("Saved desktop_location.png")

    # Scroll to footer
    footer = driver.find_element(By.ID, 'site-footer')
    driver.execute_script('arguments[0].scrollIntoView({behavior: "instant", block: "start"});', footer)
    time.sleep(1)
    driver.save_screenshot('desktop_footer.png')
    print("Saved desktop_footer.png")

    # Test Newsletter
    try:
        email_input = driver.find_element(By.ID, 'newsletter-email')
        submit_btn = driver.find_element(By.ID, 'btn-newsletter-subscribe')
        email_input.send_keys('guest@biryanidistrict.com')
        submit_btn.click()
        time.sleep(0.5)
        feedback = driver.find_element(By.ID, 'newsletter-feedback')
        print("Newsletter feedback text:", feedback.text, "Visible:", feedback.is_displayed())
        driver.save_screenshot('newsletter_tested.png')
    except Exception as e:
        print("Newsletter test error:", e)

    driver.quit()

    # 2. Mobile Verification (390x844)
    print("Starting Mobile Verification (390x844)...")
    mob_options = Options()
    mob_options.add_argument('--headless=new')
    mob_options.add_argument('--disable-gpu')
    mob_options.add_argument('--window-size=390,844')

    mob_driver = webdriver.Chrome(options=mob_options)
    mob_driver.get('http://localhost:5173')
    time.sleep(2)

    mob_loc = mob_driver.find_element(By.ID, 'location-section')
    mob_driver.execute_script('arguments[0].scrollIntoView({behavior: "instant", block: "start"});', mob_loc)
    time.sleep(1)
    mob_driver.save_screenshot('mobile_location.png')
    print("Saved mobile_location.png")

    mob_footer = mob_driver.find_element(By.ID, 'site-footer')
    mob_driver.execute_script('arguments[0].scrollIntoView({behavior: "instant", block: "start"});', mob_footer)
    time.sleep(1)
    mob_driver.save_screenshot('mobile_footer.png')
    print("Saved mobile_footer.png")

    mob_driver.quit()
    print("All captures completed successfully!")

if __name__ == '__main__':
    run_verification()
