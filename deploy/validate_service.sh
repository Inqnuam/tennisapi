#!/bin/bash

if curl -s localhost:3000 | grep êtes
then
    # if the keyword is in the conent
    echo "OK"
else
    echo "Error, server is not running"
fi