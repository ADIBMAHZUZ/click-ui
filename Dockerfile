# The builder from node image
FROM node:12-alpine as builder

RUN apk update && apk add --no-cache make git

# Move our files into directory name "app"
WORKDIR /app
COPY package.json package-lock.json  /app/
RUN npm install @ionic/cli -g
RUN cd /app && npm install
COPY .  /app

# Build with $env variable from outside
RUN cd /app && ionic build --prod

# Build a small nginx image with static website
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
COPY nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/www/ /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
