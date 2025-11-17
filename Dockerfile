FROM node:18-alpine

WORKDIR /app/cart-service

# COPY ONLY the package.json first (important!)
COPY cart-service/package*.json ./

# Also copy common-utils package.json to install dependencies correctly
COPY common-utils/package*.json ./common-utils/

# Now copy actual service code
COPY cart-service .

# Copy common-utils (actual code)
COPY common-utils ./common-utils

# Install dependencies (this prevents idealTree errors)
RUN npm install

EXPOSE 4003

CMD ["npm", "start"]