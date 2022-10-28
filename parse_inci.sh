#!/bin/bash


while mapfile -t -n 2 ary && ((${#ary[@]})); do
    echo "\"${ary[1]}\"" >> INCI.out.csv
done < INCI.in.csv 
