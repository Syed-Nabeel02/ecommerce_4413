# Build stage - build the React app
FROM node:20-alpine AS build
WORKDIR /app

# Build argument for backend URL
ARG VITE_BACK_END_URL=http://localhost:8080
ENV VITE_BACK_END_URL=$VITE_BACK_END_URL

# Copy package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Production stage - serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
