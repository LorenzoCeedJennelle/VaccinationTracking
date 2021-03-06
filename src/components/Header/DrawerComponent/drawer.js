import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  IconButton,
  ListItemText,
  makeStyles,
  Drawer,
  Typography,
  AppBar,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { checkUserAdmin } from "../../../Admin/AdminRoute/checkAdmin";

import { auth } from "../../../Firebase/utils";
import { useSelector } from "react-redux";
import { DialogBtn } from "../../Forms/DialogButton/dialogBtn";

const mapState = ({ user }) => ({
  currentUser: user.currentUser,
});

const DrawerComponent = () => {
  const { currentUser } = useSelector(mapState);
  const [open, setOpen] = useState(false);
  const admin = checkUserAdmin(currentUser);
  const useStyles = makeStyles((theme) => ({
    drawerContainer: {
      width: "200",
    },
    iconButtonContainer: {
      marginLeft: "auto",
      color: "black",
      float: "right",
      marginRight: theme.spacing(2),
    },
    list: {
      width: 200,
    },
    link: {
      textDecoration: "none",
      "&:hover": {
        textDecoration: "none",
      },
    },
    menuIconToggle: {
      marginRight: "1rem",
      color: "black",
    },
    website: {
      marginRight: "1rem",
    },
    header: {
      backgroundColor: "whitesmoke",
    },
  }));

  const [openDrawer, setOpenDrawer] = useState(false);
  //Css
  const classes = useStyles();

  //Dialog or modal for loggin out
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  //-------------------------------
  return (
    <div>
      <AppBar className={classes.header}>
        <IconButton
          edge="start"
          className={classes.iconButtonContainer}
          onClick={() => setOpenDrawer(!openDrawer)}
          disableRipple
          aria-label="menu"
        >
          <Typography variant="h6" className={classes.website}>
            Ayala Vaccination Tracker
          </Typography>
          <MenuIcon fontSize="large" className={classes.menuIconToggle} />
        </IconButton>
      </AppBar>

      <Drawer
        anchor="left"
        classes={{ paper: classes.drawerContainer }}
        onClose={() => setOpenDrawer(false)}
        open={openDrawer}
        onOpen={() => setOpenDrawer(true)}
      >
        <List className={classes.list}>
          {admin && (
            <Link to="/admin" className={classes.link}>
              <ListItem divider button onClick={() => setOpenDrawer(false)}>
                <ListItemIcon>
                  <ListItemText>Admin</ListItemText>
                </ListItemIcon>
              </ListItem>
            </Link>
          )}
          <Link to="/" className={classes.link}>
            <ListItem divider button onClick={() => setOpenDrawer(false)}>
              <ListItemIcon>
                <ListItemText>Homepage</ListItemText>
              </ListItemIcon>
            </ListItem>
          </Link>

          {currentUser ? (
            <>
              <Link to="/QR-Code" className={classes.link}>
                <ListItem divider button onClick={() => setOpenDrawer(false)}>
                  <ListItemIcon>
                    <ListItemText>QR-Code</ListItemText>
                  </ListItemIcon>
                </ListItem>
              </Link>
              <Link to="/profile" className={classes.link}>
                <ListItem divider button onClick={() => setOpenDrawer(false)}>
                  <ListItemIcon>
                    <ListItemText>Profile</ListItemText>
                  </ListItemIcon>
                </ListItem>
              </Link>

              <ListItem
                divider
                button
                onClick={(() => setOpenDrawer(false), handleClickOpen)}
              >
                <ListItemIcon>
                  <ListItemText>Logout</ListItemText>
                </ListItemIcon>
              </ListItem>
            </>
          ) : (
            <>
              <Link to="/login" className={classes.link}>
                <ListItem divider button onClick={() => setOpenDrawer(false)}>
                  <ListItemIcon>
                    <ListItemText>Login</ListItemText>
                  </ListItemIcon>
                </ListItem>
              </Link>
            </>
          )}
        </List>
      </Drawer>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="alert-dialog-title">{"Log Out"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogBtn handleClose={handleClose}>
          <Button
            onClick={() => {
              auth.signOut();
              handleClose();
            }}
            color="primary"
          >
            Yes
          </Button>
        </DialogBtn>
      </Dialog>
    </div>
  );
};

export default DrawerComponent;
