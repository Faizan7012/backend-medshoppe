const express = require("express");
const UserRoute = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const userModel = require("../model/user.model");
UserRoute.use(cors());

UserRoute.get("/", async (req, res) => {
  res.send("welcome to UserRoute");
});

// SIGNUP

//Get Request
UserRoute.get("/signup", async (req, res) => {
  try {
    const result = await userModel.find();
    if (result) {
      res.status(200).json({
        Info_Of_All_Users: result,
      });
    } else {
      res.status(404).json({
        Info_Of_All_Users: "No User Found",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

UserRoute.get("/signup/:id", async (req, res) => {
  let id = req.params.id;
  try {
    let user = await userModel.findById(id);
    if (user) {
      res.status(200).json({
        oneUser: user,
      });
    } else {
      res.status(404).json({
        message: "user not found",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: error,
    });
  }
});

// Post Request

UserRoute.post("/signup", async (req, res) => {

  const hash = await argon2.hash(req.body.password);
  const email_users = await userModel.find({
    email: req.body.email,
  });
  if (email_users.length >= 1) {
    res.send({
      status:false , 
      message : 'Email Already Exists!'
    })
  } else {
    const token = req.headers["access_token"];
    if (token) {
      const access_verification = jwt.verify(token, 'qwerty');
      if (access_verification.userType === "admin") {
        try {
          const hash = await argon2.hash(req.body.password);
          const new_user = new userModel({
            name: req.body.name,
            username: req.body.username,
            password: hash,
            email: req.body.email,
            userType: "admin",
          });
          const created_users = await new_user.save();

          res.send({
            status:true, 
            message : 'Account created successfully'
          })
        } catch (error) {
          res.status(404).json({
            error: error,
          });
        }
      } else {
        res.status(403).send("You Don't have admin token");
      }
    } else {
      try {
        const hash = await argon2.hash(req.body.password);
        const new_user = new userModel({
          name: req.body.name,
          username: req.body.username,
          password: hash,
          email: req.body.email,
          userType: "user",
        });
        const created_users = await new_user.save();

        res.send({
          status:true , 
          message : 'Account created successfully'
        })
      } catch (error) {
        res.send({
          status:false , 
          message : error.message
        })
      }
    }
  }
});

// Delete Request
UserRoute.delete("signup/:id", async (req, res) => {
  try {
    const result = await userModel.deleteOne({ _id: req.params.id });
    if (result) {
      res.status(200).json({
        message: "User Deleted",
      });
    } else {
      res.status(404).json({
        error: "INVALID ID",
      });
    }
  } catch (error) {
    res.status(404).json({
      error: "INVALID ID",
    });
  }
});

// LOGIN

//Post Request
UserRoute.post("/signin", async (req, res) => {
  try {
    const user = await userModel.find({ email: req.body.email });
    if (user.length >= 1) {
      if (await argon2.verify(user[0].password, req.body.password)) {
        const access_token = jwt.sign(
          {
            id: user[0]._id,
            email:user[0].email,
            username: user[0].username,
            userType: user[0].userType,
          },
          'qwerty',
          {
            expiresIn: "1d",
          }
        );
        const refresh_token = jwt.sign(
          {
            _id: user[0]._id,
            email:user[0].email,
            username: user[0].username,
            userType: user[0].userType,
          },
          'qwertyuiop',
          {
            expiresIn: "7d",
          }
        );
        res.send({
          status:true , 
          message : 'Login Successfull',
          AccessToken: access_token,
          RefreshToken: refresh_token,
          username: user[0].username,
          userType: user[0].userType,
        })
      } else {
        res.send({
          status:false , 
          message : 'YOUR PASSWORD IS INCORRECT'
        })
      }
    } else {
      res.send({
        status:false , 
        message : 'NO USER NOT FOUND'
      })
    
    }
  } catch (error) {
    res.send({
      status:false , 
      message : error.message
    })
  }
});

//verification post request

UserRoute.post("/signin/verification", async (req, res) => {
  const refreshToken = req.headers["refresh_token"];
  const accessToken = req.headers["access_token"];

  try {
    const refresh_verification = jwt.verify(
      refreshToken,
      'qwertyuiop'
    );

    try {
      const access_verification = jwt.verify(
        accessToken,
        'qwerty'
      );
      if (!access_verification) {
        const newToken = jwt.sign(
          {
            id: refresh_verification._id,
            email:refresh_verification.email,
            username: refresh_verification.username,
            userType: refresh_verification.userType,
          },
          'qwerty',
          {
            expiresIn: "1d",
          }
        );
        res.status(200).json({
          AccessToken: newToken,
        });
      } else {
        res.status(200).json({
          message: "You are authorized",
        });
      }
    } catch (error) {
      const newToken = jwt.sign(
        {
          id: refresh_verification._id,
          email:refresh_verification.email,
          username: refresh_verification.username,
          userType: refresh_verification.userType,
        },
        'qwerty',
        {
          expiresIn: "1d",
        }
      );
      res.status(200).json({
        AccessToken: newToken,
      });
    }
  } catch (error) {
    res.status(404).json({
      error: "YOUR REFRESH TOKEN IS EXPIRED",
    });
  }
});

module.exports = UserRoute;
