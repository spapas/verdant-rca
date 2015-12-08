#!/bin/bash

PROJECT_DIR=/vagrant/django-verdant
VIRTUALENV_DIR=/home/vagrant/.virtualenvs/rca

PYTHON=$VIRTUALENV_DIR/bin/python
PIP=$VIRTUALENV_DIR/bin/pip

# Dependencies for LDAP
apt-get install -y libldap2-dev libsasl2-dev

# Node.js, CoffeeScript and LESS
if ! command -v npm; then
    wget http://nodejs.org/dist/v4.2.3/node-v4.2.3.tar.gz
    tar xzf node-v4.2.3.tar.gz
    cd node-v4.2.3/
    ./configure && make && make install
    cd ..
    rm -rf node-v4.2.3/ node-v4.2.3.tar.gz
fi
if ! command -v coffee; then
    npm install -g coffee-script
fi
if ! command -v lessc; then
    npm install -g less
fi

# use YAML for test fixtures
apt-get install -y libyaml-dev

# Create database
su - vagrant -c "createdb verdant"


# Virtualenv setup for project
su - vagrant -c "virtualenv --python=python2 $VIRTUALENV_DIR"
su - vagrant -c "echo $PROJECT_DIR > $VIRTUALENV_DIR/.project"


# Install PIP requirements
su - vagrant -c "$PIP install -r $PROJECT_DIR/requirements.txt"


# Install CoffeeScript and LESS (into /home/vagrant/node_modules/)
su - vagrant -c "npm install --prefix=/home/vagrant/ coffee-script less"


# Set execute permissions on manage.py as they get lost if we build from a zip file
chmod a+x $PROJECT_DIR/manage.py


# Add a couple of aliases to manage.py into .bashrc
cat << EOF >> /home/vagrant/.bashrc
export PYTHONPATH=$PROJECT_DIR
export DJANGO_SETTINGS_MODULE=rcasite.settings.dev

alias dj="django-admin.py"
alias djrun="dj runserver 0.0.0.0:8000"

source $VIRTUALENV_DIR/bin/activate
export PS1="[rca \W]\\$ "
export PATH=/home/vagrant/node_modules/.bin/:\$PATH
cd $PROJECT_DIR
EOF
