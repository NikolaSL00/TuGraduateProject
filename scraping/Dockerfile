FROM node:alpine

RUN apk update && apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

# add a non-root user to run the container
RUN addgroup -S myuser && adduser -S -G myuser myuser
USER myuser

CMD ["npm", "start"]
