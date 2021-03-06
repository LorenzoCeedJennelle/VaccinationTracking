//graph for all of the total 1st dose and 2nd dose of vaccination
import React, { useState, useEffect } from "react";
import { firestore } from "../../../Firebase/utils";
import { Bar } from "react-chartjs-2";
import SelectVaccine from "../SelectVaccine/selectVaccine";

const VaccineGraph = (props) => {
  const [selectedVaccine, setSelectedVaccine] = useState(0);
  const handleChangeVaccine = (e) => setSelectedVaccine(e.target.value);
  const [boosterUser, setBoosterUser] = useState([]);

  const [vaccines, setVaccines] = useState([]);
  useEffect(() => {
    const unsubscribe = firestore
      .collection("vaccines")
      .onSnapshot((snapshot) => {
        const arr = [];
        snapshot.forEach((doc) =>
          arr.push({
            ...doc.data(),
            id: doc.id,
          })
        );
        setVaccines(arr);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    let mounted = true;

    const getData1 = async () => {
      const citiesRef = firestore.collection("users");
      const snapshot = await citiesRef
        .where("doses.selectedVaccine", "==", selectedVaccine)
        .get();
      if (snapshot.empty) {
        setUsers([]); //for the sputnik where data is empty
        return;
      }

      snapshot.forEach((doc) => {
        if (mounted) {
          const usersData = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setUsers(usersData);
        }
      });
    };

    //2nd try for the selectedBooster---------------------------------
    const getData2 = async () => {
      const citiesRef = firestore.collection("users");
      const snapshot = await citiesRef
        .where("doses.selectedBooster", "==", selectedVaccine)
        .get();
      if (snapshot.empty) {
        setBoosterUser([]); //for the sputnik where data is empty
        return;
      }

      snapshot.forEach((doc) => {
        if (mounted) {
          const usersData = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
          setBoosterUser(usersData);
        }
      });
    };
    //2nd try for the selectedBooster---------------------------------

    if (selectedVaccine) {
      getData1();
      getData2(); //2nd try for the selectedBooster---------------------------------
    }

    return () => {
      mounted = false;
    };
  }, [selectedVaccine]);

  const total = users.length;

  const doses1 = users.filter((v) => v.doses?.dose1 == true);

  const doses2 = users.filter(
    (v) => v.doses?.dose1 == true && v.doses?.dose2 == true
  );

  const booster = users.filter(
    (v) =>
      v.doses?.dose1 == true &&
      v.doses?.dose2 == true &&
      v.doses.selectedBooster !== undefined
  );

  let dose1Percent = ((doses1.length / total) * 100).toFixed(2);
  let dose2Percent = ((doses2.length / total) * 100).toFixed(2);
  let boosterPercent = ((booster.length / total) * 100).toFixed(2); //-----booster

  //2nd try for the selectedBooster---------------------------------
  let percentage = ((boosterUser.length / total) * 100).toFixed(2);

  return (
    <div>
      <div>
        <SelectVaccine
          value={selectedVaccine}
          onChange={handleChangeVaccine}
          vaccines={vaccines}
        />
      </div>
      {selectedVaccine == "J&J" ? (
        <>
          <h5>Only the first dosage is available from J&J</h5>
          <h5>Total vaccinated: {doses1.length}</h5>
        </>
      ) : (
        <>
          {" "}
          <h5>Total vaccinated with 1st dose: {doses1.length}</h5>
          <h5>Total vaccinated with 2nd dose: {doses2.length}</h5>
          <h5>Total vaccinated with Booster: {boosterUser.length}</h5>{" "}
          {/**  //-----booster*/}
        </>
      )}

      <div>
        <Bar
          data={{
            labels: ["1st Dose", "2nd Dose", "Booster"],
            datasets: [
              {
                label: "1st Dose",
                data: [dose1Percent, dose2Percent, percentage],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(255, 159, 64, 0.2)", //-----booster
                ],
                borderColor: ["rgba(255, 99, 132, 1)"],
                borderWidth: 1,
              },
              {
                label: "2nd Dose",
                backgroundColor: ["rgba(75, 192, 192, 0.2)"],
                borderColor: ["rgba(158,207,250,0.3)"],
              },
              {
                label: "Booster", //-----booster
                backgroundColor: [" rgba(255, 159, 64, 0.2)"], //-----booster
                borderColor: ["rgba(255, 159, 64, 0.2)"], //-----booster
              },
            ],
          }}
          height={400}
          width={600}
          options={{
            maintainAspectRatio: false,
            title: {
              display: true,
              text: "Hello",
              fontSize: 20,
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: function (context) {
                    var label = context.dataset.label || "";
                    if (context.parsed.y !== null) {
                      label += " " + context.parsed.y + "%";
                    }
                    return label;
                  },
                },
              },
              datalabels: {
                formatter: (val, context) => `${val || 0}%`,
              },
            },
            scales: {
              y: {
                min: 0,
                max: 100,
                ticks: {
                  stepSize: 20,
                  callback: function (value) {
                    return ((value / this.max) * 100).toFixed(0) + "%"; // convert it to percentage
                  },
                },
              },
            },
            legend: {
              labels: {
                fontSize: 25,
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default VaccineGraph;
