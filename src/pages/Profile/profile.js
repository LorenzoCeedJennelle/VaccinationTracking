import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Container,
  makeStyles,
  AppBar,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@material-ui/core";
import Profile from "../../components/Profile/profile";
import SideEffects from "../../components/vaccinationSideEffects/SideEffects";
import Complaints from "../../components/Complaints/complaints";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: "transparent",
    marginTop: "1rem",
  },
  tab: {
    justifyContent: "center",
  },
}));

const ProfilePage = () => {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <section>
      <br />
      <br />
      <br />
      <Container fixed>
        <div className={classes.root}>
          <Box display="flex" justifyContent="center" width="100%">
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              aria-label="scrollable auto tabs example"
              variant="scrollable"
              scrollButtons={"on"}
              centered
            >
              <Tab label=" Profile" {...a11yProps(0)} />
              <Tab label="Vaccination Status" {...a11yProps(1)} />
              <Tab label="Complaints" {...a11yProps(1)} />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            <Profile />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <SideEffects />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Complaints />
          </TabPanel>
        </div>
      </Container>
    </section>
  );
};

export default ProfilePage;
