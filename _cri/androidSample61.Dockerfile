FROM 4d1d69a4986a

RUN apt update && \
  apt install -y curl

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -

RUN apt install -y nodejs

RUN node --version

WORKDIR /build
COPY package*.json ./
RUN npm install

WORKDIR sample61
COPY package*.json ./
RUN npm install

WORKDIR /build
COPY . .

CMD sh ./_cri/test.sh
