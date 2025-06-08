FROM node:20.11.1



WORKDIR /app
COPY backend/package*.json ./
COPY backend/package-lock.json* ./
RUN npm install
COPY backend .

# ENV DB_NAME=htec
# ENV DB_USER=root
# ENV DB_PASSWORD=root
# ENV DB_HOST=htec_mysql
# ENV JWT_SECRET_KEY=e6KQpx9DnQ2ecwgAn5RqXzHefN0KRTXL
# ENV SMTP_USER=MS_j886YX@trial-neqvygm9708l0p7w.mlsender.net
# ENV SMTP_PASSWORD=mo21HlHYkMVf9OWU
# ENV SMTP_PORT=587
# ENV SMTP_HOST=smtp.mailersend.net
# ENV APP_URL=http://localhost:5173/
# ENV EXCHANGE_API_KEY=3182dfdf82d7f23578880c6f
# ENV EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest/BAM

EXPOSE 5000

CMD ["npm", "run", "start"]
