FROM ubuntu
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup | sudo bash - && apt-get install -y nodejs
RUN npm install -g npm
RUN apt-get install -y pdftk
RUN apt-get install -y poppler-utils
RUN apt-get install -y ghostscript
RUN apt-get install -y tesseract-ocr
RUN apt-get install -y zsh
RUN apt-get install -y build-essential

# Custom Tesseract languages
ADD share/dia.traineddata /usr/share/tesseract-ocr/tessdata/dia.traineddata
ADD share/eng.traineddata /usr/share/tesseract-ocr/tessdata/eng.traineddata
ADD share/configs/alphanumeric /usr/share/tesseract-ocr/tessdata/configs/alphanumeric

# Install App
ADD app /app
WORKDIR /app
RUN npm install
