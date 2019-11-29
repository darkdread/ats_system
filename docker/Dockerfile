FROM python:3.7.5-buster

RUN curl -sL https://deb.nodesource.com/setup_13.x | bash -
RUN apt-get install -y nodejs

WORKDIR /walson_atsapp
COPY package*.json ./
RUN npm ci
COPY requirements.txt ./
RUN pip install -r requirements.txt

# COPY requirements.txt /walson_atsapp/
# RUN pip install -r requirements.txt

COPY . /walson_atsapp/