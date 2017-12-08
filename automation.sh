#!bin/bash
if [ $1 = "install" ]
then
  export service_path="$(pwd)/xcd-api/services/*"
  for d in $service_path
    do
      echo $d
      ( cd "$d" && npm install)
    done;
  # patient_test = ./Intigration-test-patient
fi

#!bin/bash
if [ $1 = "start" ]
then
  export service_path="$(pwd)/xcd-api/services/*"
  for d in $service_path
    do
      echo $d
      ( cd "$d" && node .)
    done;
  # patient_test = ./Intigration-test-patient
fi
