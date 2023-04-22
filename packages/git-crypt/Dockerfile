FROM amd64/amazonlinux:2

RUN yum update -y && \
    yum install -y git && \
    yum install -y make gcc gcc-c++ openssl-devel && \
    git clone https://github.com/AGWA/git-crypt.git && \
    cd git-crypt && \
    make && \
    make install

RUN chmod +x /usr/local/bin/git-crypt
