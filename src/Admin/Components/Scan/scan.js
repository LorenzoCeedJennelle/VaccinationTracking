//those textfields are not yet final
import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  makeStyles,
  CardHeader,
  CardContent,
  TextField,
} from "@material-ui/core";
import ButtonForm from "../../../components/Forms/Button/button";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { firestore } from "../../../Firebase/utils";
import SelectVaccinator from "../SelectVaccinator/selectVaccinator";
import SelectVaccine from "../SelectVaccine/selectVaccine";
const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    margin: "0 auto",
    marginBottom: "1rem",
  },
});

const Scan = ({ scanResult }) => {
  const classes = useStyles();
  const [isLoading, setIsLoading] = useState(false);
  //variables in the textfield
  const [id, setID] = useState("");
  // const [firstName, setFirstName] = useState("");
  // const [middleName, setMiddletName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [birthdate, setBirthdate] = useState("");
  const [ctrlNumber, setCtrlNumber] = useState("");
  const [firstDose, setFirstDose] = useState(new Date().toLocaleDateString());

  const [selectedDate, handleDateChange] = useState(new Date());

  const [users, setUsers] = useState([]); //variable for storing user data info in an array

  useEffect(() => {
    const unsubscribe = firestore
      .collection("users")
      .doc(scanResult)
      .onSnapshot((snapshot) => {
        const arr = [];
        arr.push({
          ...snapshot.data(),
        });

        setUsers(arr);
        setIsLoading(true);
        // console.log(JSON.stringify(arr));
      });

    return () => {
      unsubscribe();
    };
  }, []);

  //useEffect for the vaccinator name;------------------------
  const [names, setNames] = useState([]);
  useEffect(() => {
    const unsubscribe = firestore
      .collection("vaccinator-name")
      .onSnapshot((snapshot) => {
        const arr = [];
        snapshot.forEach((doc) =>
          arr.push({
            ...doc.data(),
            id: doc.id,
          })
        );
        setNames(arr);
      });

    return () => {
      unsubscribe();
    };
  }, []);

  //first selected value vaccinator names
  const [firstVaccinator, setFirstVaccinator] = useState(0);
  const [secondVaccinator, setSecondVaccintor] = useState(0);
  const handleChange = (e) => setFirstVaccinator(e.target.value);
  const handleChange2 = (e) => setSecondVaccintor(e.target.value);
  //2nd selected value vaccinator names----------------------------

  //for the vaccines-------------------------------------------------
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

  const [selectedVaccine, setSelectedVaccine] = useState(0);
  const handleChangeVaccine = (e) => setSelectedVaccine(e.target.value);
  console.log(selectedVaccine);
  //--------------------------------------------------------------------

  //for the estimated 2nd Dose of vaccine logic--------------------------
  const date = new Date();
  var newdate = new Date(date);

  newdate.setDate(newdate.getDate() + 28);

  var dd = newdate.getDate();
  var mm = newdate.getMonth() + 1;
  var y = newdate.getFullYear();

  const secondDose = mm + "/" + dd + "/" + y;
  const [secDose, setSecDose] = useState(secondDose); //variable for 2nd dose
  //for the estimated 2nd Dose of vaccine logic------------------------------

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(
      id,
      selectedVaccine,
      ctrlNumber,
      firstDose,
      firstVaccinator,
      secDose.toLocaleDateString(),
      secondVaccinator
    );
  };

  return (
    <Card className={classes.root}>
      <CardHeader title="Update Vaccination Status" />
      <CardContent>
        {isLoading ? (
          <>
            {users &&
              users.map((user) => (
                <li style={{ listStyle: "none" }}>
                  <form onSubmit={handleSubmit}>
                    <Grid container direction={"column"} spacing={2}>
                      <Grid item>
                        <TextField
                          label="ID No"
                          variant="outlined"
                          value={id}
                          onChange={(e) => setID(e.target.value)}
                          fullWidth
                          required
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="First Name"
                          variant="outlined"
                          value={user.firstName}
                          // onChange={(e) => setFirstName(e.target.value)}
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="Middle Name (Optional)"
                          variant="outlined"
                          value={user.middleName}
                          // onChange={(e) => setMiddleName(e.target.value)}
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          label="Last Name"
                          variant="outlined"
                          value={user.lastName}
                          // onChange={(e) => setLastName(e.target.value)}
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid item>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                            format="MM/dd/yyyy"
                            value={user.birthdate}
                            onChange={handleDateChange}
                            fullWidth
                            id="date-picker-inline"
                            label="BirthDate"
                            disabled={true}
                          />
                        </MuiPickersUtilsProvider>
                      </Grid>
                      <Grid item>
                        <TextField
                          type="text"
                          value={user.address}
                          label="Address"
                          variant="outlined"
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          type="text"
                          value={user.phoneNumber}
                          label="Phone Number"
                          variant="outlined"
                          fullWidth
                          disabled={true}
                        />
                      </Grid>
                      <Grid item>
                        <SelectVaccine
                          value={selectedVaccine}
                          onChange={handleChangeVaccine}
                          vaccines={vaccines}
                        />
                      </Grid>

                      <Grid item>
                        <TextField
                          type="text"
                          label="Control Number of the Vaccine "
                          variant="outlined"
                          fullWidth
                          value={ctrlNumber}
                          onChange={(e) => setCtrlNumber(e.target.value)}
                        />
                      </Grid>

                      <Grid item>
                        <TextField
                          type="text"
                          label="1st Dosage"
                          variant="outlined"
                          value={firstDose}
                          onChange={(e) => setFirstDose(e.target.value)}
                          fullWidth
                        />
                      </Grid>
                      <Grid item>
                        <SelectVaccinator
                          value={firstVaccinator}
                          onChange={handleChange}
                          names={names}
                        />
                      </Grid>
                      {selectedVaccine == "J&J" || selectedVaccine == "" ? (
                        <></>
                      ) : (
                        <>
                          <Grid item>
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                              <DatePicker
                                format="MM/dd/yyyy"
                                value={secDose}
                                onChange={setSecDose}
                                fullWidth
                                id="date-picker-inline"
                                label="Estimated 2nd Dose of Vaccination"
                              />
                            </MuiPickersUtilsProvider>
                          </Grid>
                          <Grid item>
                            <SelectVaccinator
                              value={secondVaccinator}
                              onChange={handleChange2}
                              names={names}
                            />
                          </Grid>
                        </>
                      )}

                      <br />
                      <Grid>
                        <ButtonForm type="submit" fullWidth>
                          Submit
                        </ButtonForm>
                      </Grid>
                    </Grid>
                  </form>
                </li>
              ))}
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </CardContent>
    </Card>
  );
};

export default Scan;
