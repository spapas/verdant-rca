#!/bin/bash

# Script to set up a Django project on Vagrant.

# Installation settings

PROJECT_NAME=$1

DB_NAME=$PROJECT_NAME
VIRTUALENV_NAME=$PROJECT_NAME

PROJECT_DIR=/home/vagrant/$PROJECT_NAME/django-verdant
VIRTUALENV_DIR=/home/vagrant/.virtualenvs/$PROJECT_NAME

PGSQL_VERSION=9.1

# Need to fix locale so that Postgres creates databases in UTF-8
cp -p $PROJECT_DIR/etc/install/etc-bash.bashrc /etc/bash.bashrc
locale-gen en_GB.UTF-8
dpkg-reconfigure locales

export LANGUAGE=en_GB.UTF-8
export LANG=en_GB.UTF-8
export LC_ALL=en_GB.UTF-8

# Install essential packages from Apt
apt-get update -y
# Python dev packages
apt-get install -y build-essential python python-dev python-setuptools python-pip
# Dependencies for image processing with PIL
apt-get install -y libjpeg62-dev zlib1g-dev libfreetype6-dev liblcms1-dev
# Dependencies for LDAP
apt-get install -y libldap2-dev libsasl2-dev
# Git (we'd rather avoid people keeping credentials for git commits in the repo, but sometimes we need it for pip requirements that aren't in PyPI)
apt-get install -y git

apt-get install -y redis-server

# Postgresql
if ! command -v psql; then
    apt-get install -y postgresql-$PGSQL_VERSION libpq-dev
    cp $PROJECT_DIR/etc/install/pg_hba.conf /etc/postgresql/$PGSQL_VERSION/main/
    /etc/init.d/postgresql reload
fi

# virtualenv global setup
if ! command -v pip; then
    easy_install -U pip
fi
if [[ ! -f /usr/local/bin/virtualenv ]]; then
    pip install virtualenv virtualenvwrapper stevedore==0.14.1 virtualenv-clone
fi

# bash environment global setup
cp -p $PROJECT_DIR/etc/install/bashrc /home/vagrant/.bashrc
su - vagrant -c "mkdir -p /home/vagrant/.pip_download_cache"

# Node.js, CoffeeScript and LESS
if ! command -v npm; then
    wget http://nodejs.org/dist/v0.10.0/node-v0.10.0.tar.gz
    tar xzf node-v0.10.0.tar.gz
    cd node-v0.10.0/
    ./configure && make && make install
    cd ..
    rm -rf node-v0.10.0/ node-v0.10.0.tar.gz
fi
if ! command -v coffee; then
    npm install -g coffee-script
fi
if ! command -v lessc; then
    npm install -g less
fi

# ---

# ElasticSearch
if ! command -v elasticsearch; then
    apt-get install -y openjdk-6-jre-headless
    echo "Downloading ElasticSearch..."
    wget -q https://download.elasticsearch.org/elasticsearch/elasticsearch/elasticsearch-0.90.5.deb
    dpkg -i elasticsearch-0.90.5.deb
    service elasticsearch start
fi

# postgresql setup for project
createdb -Upostgres $DB_NAME

# use YAML for test fixtures
apt-get install -y libyaml-dev

# dependencies for lxml (for HTML whitelisting)
apt-get install -y libxml2-dev libxslt-dev

# virtualenv setup for project
su - vagrant -c "/usr/local/bin/virtualenv $VIRTUALENV_DIR && \
    echo $PROJECT_DIR > $VIRTUALENV_DIR/.project && \
    PIP_DOWNLOAD_CACHE=/home/vagrant/.pip_download_cache $VIRTUALENV_DIR/bin/pip install -r $PROJECT_DIR/requirements.txt"

echo "workon $VIRTUALENV_NAME" >> /home/vagrant/.bashrc

# Set execute permissions on manage.py, as they get lost if we build from a zip file
chmod a+x $PROJECT_DIR/manage.py

# Django project setup
su - vagrant -c "source $VIRTUALENV_DIR/bin/activate && cd $PROJECT_DIR && ./manage.py syncdb --noinput && ./manage.py migrate --noinput"
