FROM --platform=linux/amd64 python:3.8-buster
#Layer for python and gdal support
# RUN apt update && apt install -y software-properties-common curl \
#     && add-apt-repository ppa:ubuntugis/ubuntugis-unstable && apt-get update \
#     && apt-get install -y python3-pip libssl-dev libffi-dev \
#     && update-alternatives --install /usr/bin/python python /usr/bin/python3 10 \
#     && update-alternatives --install /usr/bin/pip    pip    /usr/bin/pip3    10 \
#     && rm -rf /var/lib/apt/lists/*

#Begin of mandatory layers for Microsoft ODBC Driver 13 for Linux
# RUN apt-get update && apt-get install -y apt-transport-https wget
# RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
# RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
# RUN curl https://packages.microsoft.com/config/ubuntu/18.04/prod.list | tee /etc/apt/sources.list.d/msprod.list
# RUN apt-get update -y
# ENV ACCEPT_EULA=Y
# RUN apt install -y mssql-tools unixodbc-dev
# RUN apt-get install unixodbc-dev -y
RUN apt update -y  &&  apt upgrade -y && apt-get update 
RUN apt install -y curl unixodbc-dev

# Add SQL Server ODBC Driver 17 for Ubuntu 18.04
RUN curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add -
RUN curl https://packages.microsoft.com/config/ubuntu/18.04/prod.list > /etc/apt/sources.list.d/mssql-release.list
RUN apt-get update
RUN apt upgrade -y
RUN ACCEPT_EULA=Y apt install -y --allow-unauthenticated msodbcsql17
RUN ACCEPT_EULA=Y apt install -y --allow-unauthenticated mssql-tools
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bash_profile
RUN echo 'export PATH="$PATH:/opt/mssql-tools/bin"' >> ~/.bashrc


# RUN sh -c 'echo "deb [arch=amd64] https://apt-mo.trafficmanager.net/repos/mssql-ubuntu-xenial-release/ xenial main" > /etc/apt/sources.list.d/mssqlpreview.list'
# RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 417A0893
# RUN apt-get update -y
# RUN apt install mssql-tools unixodbc-dev odbcinst1debian2 msodbcsql17 unixodbc libodbc1

# RUN apt-get install -y locales
# RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen
# RUN locale-gen
#End of mandatory layers for Microsoft ODBC Driver 13 for Linux
RUN apt-get remove -y curl
#Layers for the django app
WORKDIR /backend
COPY . /backend
RUN pip install pip --upgrade
RUN pip install -r requirements.txt
EXPOSE 8000
EXPOSE 1433
COPY . .


# FROM registry.access.redhat.com/ubi8/python-38

# USER root
# RUN yum update --assumeyes && \
#   yum install --assumeyes \
#     unixODBC-devel \
#   && yum clean all

# RUN curl https://packages.microsoft.com/config/rhel/8/prod.repo > /etc/yum.repos.d/mssql-release.repo
# RUN yum download -y msodbcsql17
# # RUN ACCEPT_EULA=y rpm -Uvh --nodeps msodbcsql17*rpm
# WORKDIR /backend
# COPY . /backend
# RUN pip install pip --upgrade
# RUN pip install -r requirements.txt
# EXPOSE 8000
# EXPOSE 1433
# COPY . .