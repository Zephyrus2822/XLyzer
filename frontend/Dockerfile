# Use official Node image to build React
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Use nginx to serve build
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
