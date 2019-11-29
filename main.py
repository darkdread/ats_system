import datetime
import requests
import re
import time
import argparse
import sys

class atsmaster:

    session = ""
    sessionid = ""
    csrf = ""

    ats_login_page = "https://myats.sp.edu.sg/psc/cs90atstd/EMPLOYEE/HRMS/c/A_STDNT_ATTENDANCE.A_ATS_STDNT_SBMIT.GBL?cmd=login&languageCd=ENG"
    ats_code_page = "https://myats.sp.edu.sg/psc/cs90atstd/EMPLOYEE/HRMS/c/A_STDNT_ATTENDANCE.A_ATS_STDNT_SBMIT.GBL?"

    def __init__(self, ats):
        self.session = requests.Session()
        self.ats = ats
        print("init class")
    
    def submit_ats(self, id, pw):
        login_fields = {
            "userid": id,
            "pwd": pw
        }
        
        headers = {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36',
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3",
            "Accept-Encoding": "gzip, deflate, br",
            "Accept-Language": "en-US,en;q=0.9",
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        print(f"logging user {id}...")
        login_resp = self.session.post(self.ats_login_page, data=login_fields, headers=headers)
        
        # for cookie in login_resp.cookies:
        #     print(f'{cookie.name}:{cookie.value}')
        
        login_failed = re.search("errorCode=(\d+)", login_resp.url)

        if login_failed:
            print(f'{id} failed to login with error code: {login_failed.groups()[0]}')
            return

        ats_fields = {
            'A_ATS_ATCD_SBMT_A_ATS_ATTNDNCE_CD': self.ats,
            "ICAction": "A_ATS_ATCD_SBMT_SUBMIT_BTN"
        }

        print(f"{id} submitting ats {self.ats}...")
        submit_ats_resp = self.session.post(self.ats_code_page, data=ats_fields)

        ats_code_failed = re.search("Invalid attendance code", submit_ats_resp.text)

        if ats_code_failed:
            print(f'{id} failed to submit ats, code failed.')
            return
        
        ats_code_not_in_module = re.search("You are not registered in (.+?), please", submit_ats_resp.text)

        if ats_code_not_in_module:
            print(f'{id} failed to submit ats, not registered in module: {ats_code_not_in_module.groups()[0]}')
            return
        
        ats_already_submitted = re.search("Please check with your lecturer", submit_ats_resp.text)

        if ats_already_submitted:
            print(f'{id} already submitted ats.')
            return
        
        # print(submit_ats_resp.text)
        print(f'{id} ats submitted!')
        # print(submit_ats_resp.text)

parser = argparse.ArgumentParser()
parser.add_argument('ats', type=str, help='ATS code (6 int)')

args = parser.parse_args()

if args.ats.__len__() != 6:
    sys.exit("ATS code length not 6.")

slave = atsmaster(args.ats)

now = datetime.datetime.now()

ats_list = open("list.txt", "r")
lines = ats_list.readlines()

linear_time = 0.1

# Calculate time to submit each ats.
if (now.minute < 15):
    linear_time = (15-1) / (lines.__len__() + 1)
    print(linear_time)

i = 0
for line in lines:
    vars = line.rstrip('\n').split(",")
    ats_id = vars[0]
    ats_pw = vars[1]

    # print(f'{ats_id}={ats_pw}')
    slave.submit_ats(ats_id, ats_pw)

    if i >= lines.__len__() - 1:
        print("End of list.")
        break

    print(f"Waiting {linear_time * 60}s to execute next task.")
    time.sleep(linear_time * 60)

    i += 1
