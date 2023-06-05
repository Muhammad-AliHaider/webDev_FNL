const UserModel = require("../models/user");
const TeacherModel = require("../models/teacher");
const CourseModel = require("../models/course");
const StudentModel = require("../models/student");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const StudentController = require("./Student");
const teachers = require("../models/teacher");

module.exports = {
  create: async function (req, res, next) {
    if (
      !(
        req.body.UserName ||
        req.body.Password ||
        req.body.Name ||
        req.body.Age ||
        req.body.Email ||
        req.body.Role ||
        req.body.CreditCard
      )
    ) {
      res.json({
        status: "failure",
        message: "Incomplete Information",
        data: null,
      });
    }
    // console.log(req.body.Role);
    if (req.body.Role != 1) {
      res.json({ status: "failure", message: "Incorrect Role", data: null });
    }
    await UserModel.create(
      {
        UserName: req.body.UserName,
        Password: req.body.Password,
        Name: req.body.Name,
        Age: req.body.Age,
        Gender: req.body.Gender,
        Email: req.body.Email,
        Role: req.body.Role,
        CourseOffered: [],
        CourseEnrolled: [],
        Notification: [],
        ProfilePic: req.body.ProfilePic,
        BIO: req.body.BIO,
        CreditCard: req.body.CreditCard,
        CreatedAt: new Date(),
      },
      function (err, result) {
        if (err) {
          next(err);
        } else
          res.json({
            status: "success",
            message: "User added successfully!!!",
            data: null,
          });
      }
    );
  },

  profileupdate: async function (req, res) {
    const authHeader = req.headers["authorization"];
    // Extract token from header
    const token = authHeader && authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token, {
      complete: true,
    });

    // Find user using decodedToken.payload.id
    UserModel.findOne({ _id: decodedToken.payload.id })
      .then((user) => {
        // If no user is found, respond with a 404 status
        if (!user) {
          res.status(404).send({
            message: `User not found.`,
          });
          return;
        }

        // Log user data
        console.log(user);

        // Update credit card information
        user.set(req.body.profileData);

          console.log(user)

        // Save the updated user document
        return user.save();
      })
      .then((updatedUser) => {
        // Respond with a success message
        res.status(200).send({ message: "User updated successfully." });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  },

  add_user: async function (req, res, next) {
    if (
      !(
        req.body.UserName ||
        req.body.Password ||
        req.body.Name ||
        req.body.Age ||
        req.body.Email ||
        req.body.Role ||
        req.body.CreditCard
      )
    ) {
      res.json({
        status: "failure",
        message: "Incomplete Information",
        data: null,
      });
    }
    if (req.body.Role != 3 && req.body.Role != 2) {
      res.json({ status: "failure", message: "Incorrect Role", data: null });
    } else {
      await UserModel.create(
        {
          UserName: req.body.UserName,
          Password: req.body.Password,
          Name: req.body.Name,
          Age: req.body.Age,
          Gender: req.body.Gender,
          Email: req.body.Email,
          Role: req.body.Role,
          Notification: [],
          ProfilePic: req.body.ProfilePic,
          BIO: req.body.BIO,
          CreditCard: {
            cardNumber: req.body.cardNumber,
            expirationDate: req.body.expirationDate,
            securityCode: req.body.securityCode,
          },
          CreatedAt: new Date(),
        },
        async function (err, result) {
          if (err) {
            res.send({ status: "failure", message: err.message });
          } else {
            if (req.body.Role == 2) {
              TeacherModel.create({ ID: result._id });
            } else {
              StudentModel.create({ ID: result._id });
            }
            const authHeader = req.headers["authorization"];
            // Extract token from header
            const token = authHeader && authHeader.split(" ")[1];
            const decodedToken = jwt.decode(token, {
              complete: true,
            });
            // console.log(decodedToken.payload)
            await UserModel.find({ _id: decodedToken.payload.id }).then(
              (data1) => {
                str1 = "User: ";
                str2 = str1.concat(req.body.UserName);
                str3 = str2.concat(" created: ");
                notifgen(data1[0], str3);
              }
            );

            res.json({
              status: "success",
              message: "User added successfully!!!",
              data: null,
            });
          }
        }
      );
    }
  },
  update_user: async function (req, res) {
    if (req.body.UserName) {
      if (req.body.Password) {
        req.body.Password = await bcrypt.hashSync(req.body.Password, 10);
      }
      await UserModel.findOneAndUpdate(
        { UserName: req.body.UserName },
        req.body,
        { useFindAndModify: false }
      )
        .then(async (data) => {
          if (data == null) {
            res.status(404).send({
              message: `User not found.`,
            });
          } else {
            const authHeader = req.headers["authorization"];
            // Extract token from header
            const token = authHeader && authHeader.split(" ")[1];
            const decodedToken = jwt.decode(token, {
              complete: true,
            });
            await UserModel.find({ _id: decodedToken.payload.id }).then(
              (data1) => {
                str1 = "User: ";
                str2 = str1.concat(req.body.UserName);
                str3 = str2.concat(" is updated: ");
                notifgen(data1[0], str3);
              }
            );
            res.send({ message: "User updated successfully." });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    } else {
      res.status(500).send({
        message: "UserName not given.",
      });
    }
  },

  readprofile: async function (req, res) {
    {
      try {
        const authHeader = req.headers["authorization"];
        // Extract token from header
        const token = authHeader && authHeader.split(" ")[1];
        const decodedToken = jwt.decode(token, {
          complete: true,
        });
        const user = await UserModel.findOne({ _id: decodedToken.payload.id });
        //console.log(user)
        const std = await StudentModel.findOne({ ID: decodedToken.payload.id });
        //console.log(Acces's1',res.getHeader('Access'))
        res.status(200).json({ data: user, std });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  },

  notifget: async function (req, res) {
    {
      console.log("notifget");
      try {
        const authHeader = req.headers["authorization"];
        // Extract token from header
        const token = authHeader && authHeader.split(" ")[1];
        const decodedToken = jwt.decode(token, {
          complete: true,
        });
        const user = await UserModel.findOne({ _id: decodedToken.payload.id });

        res
          .status(200)
          .json({ Headers: res.getHeader("access"), data: user.Notification });
        // console.log("here _____________________")
        // console.log(res.getHeader("access"));
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  },

  notifdel: async function (req, res) {
    {
      try {
        const authHeader = req.headers["authorization"];
        // Extract token from header
        const token = authHeader && authHeader.split(" ")[1];
        const decodedToken = jwt.decode(token, {
          complete: true,
        });
        const user = await UserModel.findOne({ _id: decodedToken.payload.id });
        const inter = user.Notification.filter((object) => {
          return object._id != req.body._id;
        });
        await UserModel.findOneAndUpdate(
          { _id: decodedToken.payload.id },
          { Notification: inter },
          { useFindAndModify: false }
        );
        res.status(200).json({ data: "Notification Deleted Successfully" });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  },

  readTeacher: async function (req, res) {
    if (!req.body.UserName) {
      await UserModel.find({Role:2})
        .then((data) => {
          res.send({ status: "Success", message: data });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    } else {
      await UserModel.find({ UserName: req.body.UserName })
        .then((data) => {
          res.send({ status: "Success", message: data });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    }
  },

  read_teachers: async function(req,res){
    const teachers=await UserModel.find({Role:2})
    var resp=[]
    for(let i=0;i<teachers.length;i++){
      data = await TeacherModel.find({ID : teachers[i]._id})
      resp.push([teachers[i],data])
    }
    res.send({ status: "Success", data: resp });
  },


  read: async function (req, res) {
    if (!req.body.UserName) {
      await UserModel.find({Role:3})
        .then((data) => {
          res.send({ status: "Success", message: data });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    } else {
      await UserModel.find({ UserName: req.body.UserName })
        .then((data) => {
          res.send({ status: "Success", message: data });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    }
  },

  getUserName: async function (req, res) {
    
      await UserModel.find({ _id: req.body.Data._id })
        .then((data) => {
          res.send({ status: "Success", message: data.Name });
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    
  },
  update: async function (req, res) {
    // update username and email check missing
    const authHeader = req.headers["authorization"];
    // Extract token from header
    const token = authHeader && authHeader.split(" ")[1];
    const decodedToken = jwt.decode(token, {
      complete: true,
    });

    if (req.body.Password) {
      req.body.Password = await bcrypt.hashSync(req.body.Password, 10);
    }

    await UserModel.findOneAndUpdate(
      { _id: decodedToken.payload.id },
      req.body,
      { useFindAndModify: true }
    )
      .then(async (data) => {
        if (data.length == 0) {
          res.status(404).send({
            message: `User not found.`,
          });
        } else {
          // console.log(data)
          str1 = "User Updated: ";
          notifgen(data, str1);
          res.send({ message: "User updated successfully." });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  },

  destroy: async function (req, res) {
    console.log(req.body.UserName);
    await UserModel.findOneAndRemove({ UserName: req.body.UserName })
      .then(async (data) => {
        if (data == null) {
          res.status(404).send({
            message: `User not found.`,
          });
        } else {
          const authHeader = req.headers["authorization"];
          // Extract token from header
          const token = authHeader && authHeader.split(" ")[1];
          const decodedToken = jwt.decode(token, {
            complete: true,
          });
          // console.log(decodedToken.payload)
          await UserModel.find({ _id: decodedToken.payload.id })
            .then((data1) => {
              console.log(data1);
              str1 = "User: ";
              str2 = str1.concat(req.body.UserName);
              str3 = str2.concat(" is Deleted ");
              notifgen(data1[0], str3);
              res.send({
                message: "User deleted successfully!",
              });
            })
            .catch((err) => {
              res.status(500).send({
                message: err.message,
              });
            });
        }
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message,
        });
      });
  },
  add_courses_teacher: async function (req, res) {
    if (req.body.id && req.body.CourseID) {
      await TeacherModel.findOneAndUpdate(
        { ID: req.body.id },
        { $push: { CourseOffered: req.body.CourseID } },
        { useFindAndModify: false }
      )
        .then(async (data) => {
          if (data == null) {
            res.status(404).send({
              message: `User not found.`,
            });
          } else {
            const authHeader = req.headers["authorization"];
            // Extract token from header
            const token = authHeader && authHeader.split(" ")[1];
            const decodedToken = jwt.decode(token, {
              complete: true,
            });
            const user = await UserModel.findOne({
              _id: decodedToken.payload.id,
            });
            const user1 = await UserModel.findOne({ _id: req.body.id });
            const course = await CourseModel.findOne({
              _id: req.body.CourseID,
            });
            str1 = "New teacher Added: ";
            str2 = str1.concat(user1.UserName);
            str3 = str2.concat(" to Course: ");
            str4 = str3.concat(course.Name);
            notifgen(user, str4);
            res.send({ message: "User updated successfully." });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    } else {
      res.status(500).send({
        message: "Incomplete Information",
      });
    }
  },
  remove_courses_teacher: async function (req, res) {
    if (req.body.id && req.body.CourseID) {
      await TeacherModel.findOneAndUpdate(
        { ID: req.body.id },
        { $pull: { CourseOffered: req.body.CourseID } },
        { useFindAndModify: false }
      )
        .then(async (data) => {
          if (data == null) {
            res.status(404).send({
              message: `User not found.`,
            });
          } else {
            const authHeader = req.headers["authorization"];
            // Extract token from header
            const token = authHeader && authHeader.split(" ")[1];
            const decodedToken = jwt.decode(token, {
              complete: true,
            });
            const user = await UserModel.findOne({
              _id: decodedToken.payload.id,
            });
            const user1 = await UserModel.findOne({ _id: req.body.id });
            const course = await CourseModel.findOne({
              _id: req.body.CourseID,
            });
            str1 = "teacher: ";
            str2 = str1.concat(user1.UserName);
            str3 = str2.concat(" removed from Course: ");
            str4 = str3.concat(course.Name);
            notifgen(user, str4);
            res.send({ message: "User updated successfully." });
          }
        })
        .catch((err) => {
          res.status(500).send({
            message: err.message,
          });
        });
    } else {
      res.status(500).send({
        message: "Incomplete Information",
      });
    }
  },

  add_course_student: async function (req, res) {
    try {
      const user = await UserModel.findOne({ _id: req.body._id });
      const student = await StudentModel.findOne({ ID: user._id });
      const combined = student.CourseEnrolled.concat({
        id: req.body.CourseID,
        progress: [],
      });
      console.log(combined, 1);
      await StudentModel.findOneAndUpdate(
        { ID: req.body._id },
        { CourseEnrolled: combined },
        { useFindAndModify: false }
      );
      const course = await CourseModel.findOne({ _id: req.body.CourseID });
      var enrol = course.Students;
      enrol.push(req.body._id);
      await CourseModel.findOneAndUpdate(
        { _id: req.body.CourseID },
        { Students: enrol },
        { useFindAndModify: false }
      );
      str1 = "New Course Added: ";
      str2 = str1.concat(course.Name);
      notifgen(user, str2);
      res.status(200).json({ data: "Course Purchased Successfully" });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  notifget: async function (req, res) {
    {
      try {
        const authHeader = req.headers["authorization"];
        // Extract token from header
        const token = authHeader && authHeader.split(" ")[1];
        const decodedToken = jwt.decode(token, {
          complete: true,
        });
        const user = await UserModel.findOne({ _id: decodedToken.payload.id });
        res.status(200).json({ data: user.Notification });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  },

  notifdel: async function (req, res) {
    {
      try {
        const authHeader = req.headers["authorization"];
        // Extract token from header
        const token = authHeader && authHeader.split(" ")[1];
        const decodedToken = jwt.decode(token, {
          complete: true,
        });
        const user = await UserModel.findOne({ _id: decodedToken.payload.id });
        const inter = user.Notification.filter((object) => {
          return object._id != req.body._id;
        });
        await UserModel.findOneAndUpdate(
          { _id: decodedToken.payload.id },
          { Notification: inter },
          { useFindAndModify: false }
        );
        res.status(200).json({ data: "Notification Deleted Successfully" });
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }
  },
};

async function notifgen(user, msg) {
  try {
    const combined1 = user.Notification.concat({
      message: msg,
      timestamp: Date.now(),
    });
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { Notification: combined1 },
      { useFindAndModify: false }
    );
    // return 0
  } catch (err) {
    console.log(err);
    // return 0
  }
}
