FROM node:20-alpine
RUN apk add --no-cache bash
WORKDIR /mnt
EXPOSE 9090
COPY . /mnt

