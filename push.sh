#!/bin/bash
echo "Enter commit message:"
read msg
git add .
git commit -m "$msg"
git pull --no-rebase origin main
git push origin main
git push origin main:pages