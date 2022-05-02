FROM node:14-alpine
WORKDIR /app
ADD . /app
RUN apk update
RUN apk upgrade
RUN apk add --no-cache udev ttf-freefont chromium
RUN npm install
CMD npm start