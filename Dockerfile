FROM node:0.10.33
RUN apt-get install -y pdftk
RUN apt-get install -y poppler-utils
RUN apt-get install -y ghostscript
RUN apt-get install -y tesseract-ocr
ADD app /app
WORKDIR /app
RUN npm install
RUN apt-get update
RUN apt-get install -y zsh
RUN echo /usr/local/bin/zsh > /etc/shells
