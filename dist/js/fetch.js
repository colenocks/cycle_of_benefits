import * as functions from "./functions.js";

function FetchHandler() {}

/*Fetch Methods*/
FetchHandler.prototype = {
  /* Path: {
    path: null,
    set path_(url) {
      this.path = url;
    },
    get path_() {
      return this.path;
    }
  }, */

  loginUser: function (form, callback) {
    let url = form.loginForm.getAttribute("action")
      ? "/login"
      : "/cannotgetposturl";
    if (form.username.value === "" || form.password.value === "") {
      functions.displayAlert("Enter your login information!", "info");
      return false;
    } else {
      //retrieve user data
      const user = {
        username: form.username.value,
        password: form.password.value,
      };
      const fetchOptions = {
        method: "POST",
        headers: {
          Accept: [
            "application/x-www-form-urlencoded",
            "application/json",
            "text/plain",
            "*/*",
          ],
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      };

      functions
        .fetchData(url, fetchOptions)
        .then((data) => {
          if (data.errMessage) {
            console.log("Error: " + data.errMessage);
            functions.displayAlert(
              data.errMessage + ": Username or Password not correct!",
              "error"
            );
          } else {
            functions.clearFormFields(form.formName);
            callback(data.redirect_path);
          }
          callback(null);
        })
        .catch((error) => console.error("HTTP- Error: ", "\n" + error));
    }
  },

  signupUser: function (form) {
    if (form) {
      if (
        !functions.validateSignupForm(form.formName) ||
        form.password.value !== form.password_match.value
      ) {
        functions.displayAlert(
          "Please provide all required information!",
          "error"
        );
        functions.displayAlert("Passwords do not match", "error");
        form.password_match.value = "";
        return false;
      } else {
        let url = form.signupForm.getAttribute("action") || "/submitregister";
        //retrieve user data
        const userobj = {
          username: form.user.value,
          password: form.password.value,
          firstname: form.fname.value,
          lastname: form.lname.value,
          email: form.email.value,
        };
        const fetchOptions = {
          method: "POST",
          headers: {
            Accept: [
              "application/x-www-form-urlencoded",
              "application/json",
              "text/plain",
              "*/*",
            ],
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userobj),
        };
        functions
          .fetchData(url, fetchOptions)
          .then((data) => {
            // console.log(data);
            if (!data.redirect_path) {
              functions.displayAlert(
                "Error setting up Account: " + data.message,
                "error"
              );
              form.user.value = "";
              form.password.value = "";
              form.password_match.value = "";
            } else {
              functions.displayAlert(data.status, "success");
              functions.clearFormFields(form.formName);
              //get data and send to
              if (confirm("Sign in?")) {
                window.location.assign(data.redirect_path);
              } else {
                window.location.assign("/");
                return false;
              }
            }
          })
          .catch((err) => {
            console.log("fetch failed: " + err);
          });
      }
    }
  },

  getProjects: function (callback) {
    functions
      .fetchData("/getprojects", {
        method: "GET",
        headers: {
          Accept: [
            "application/x-www-form-urlencoded",
            "application/json",
            "text/plain",
            "*/*",
          ],
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        if (data) {
          callback(data);
        } else {
          callback(null);
          functions.displayAlert(data.errMessage, "error");
        }
      })
      .catch((err) => {
        console.log("All projects Fetch Error:  " + err);
      });
  },

  addProject: function (form) {
    // validation
    if (!functions.validateSignupForm(form.formName)) {
      functions.displayAlert("Fill all required fields", "error");
      return false;
    } else {
      let url = "/addproject";
      const newProject = {
        type: form.projectType.value,
        title: form.projectTitle.value,
        tools: form.projectTools.value,
        details: form.projectDetails.value,
        address: form.projectAddress.value,
        city: form.projectCity.value,
        duration: form.projectDuration.value,
        maxworkers: form.projectWorkers.value,
      };
      const formdata = new FormData(form.projectform);
      // formdata.append("img", FileList[0]);
      formdata.append("max", newProject.maxworkers);
      const options = {
        method: "POST",
        body: formdata,
      };

      functions
        .fetchData(url, options)
        .then((data) => {
          if (data.message) {
            functions.displayAlert(data.message, "success");
            functions.clearFormFields(form.formName);
          } else {
            functions.displayAlert(data.errMessage, "error");
          }
        })
        .catch((error) => {
          console.log("add project Fetch error: " + error);
        });
    }
  },

  approveProject: function (id) {
    let url = "/approveproject";
    const projId = {
      projid: id.textContent,
    };
    const options = {
      method: "POST",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*",
        ],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(projId),
    };

    functions
      .fetchData(url, options)
      .then((data) => {
        if (data.message) {
          functions.displayAlert(data.message, "success");
        } else {
          functions.displayAlert(data.errMessage, "error");
        }
      })
      .catch((error) => {
        console.log("add project Fetch error: " + error);
      });
  },

  updateProject: function (form, callback) {
    // validation
    let url = "/updateproject";
    const project = {
      id: form.id.textContent,
      type: form.type.value,
      title: form.title.value,
      details: form.details.value,
      tools: form.tools.value,
      address: form.address.value,
      city: form.city.value,
      status: form.status.value,
      currentworkers: form.currentworkers.value,
      maxworkers: form.maxworkers.value,
      duration: form.duration.value,
      point: form.point.value,
    };
    const options = {
      method: "PUT",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*",
        ],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    };

    functions
      .fetchData(url, options)
      .then((data) => {
        if (data.message) {
          callback(data.message);
          return;
        }
        functions.displayAlert(data.errMessage, "error");
      })
      .catch((error) => {
        console.log("post project Fetch error: " + error);
      });
  },

  viewProject: function (projectId, callback) {
    //fetch project data
    const project = {
      id: projectId.textContent /* ,
      postedby: postedBy.textContent */,
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*",
        ],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    };

    let url = "/projectview";
    functions
      .fetchData(url, fetchOptions)
      .then((data) => {
        if (data.redirect_path) {
          callback(data.redirect_path);
        } else {
          functions.displayAlert(data.errMessage, "info");
          callback(null);
        }
      })
      .catch((err) => {
        console.log("project fetch error: " + err);
      });
  },

  updateProfile: function (form, callback) {
    let url = "/updateuser";
    const profile = {
      username: form.username.value,
      fname: form.fname.value,
      lname: form.lname.value,
      email: form.email.value,
      dob: form.dob.value,
      address: form.address.value,
      phone: form.phone.value,
      state: form.state.value,
      nationalId: form.nationalId.value,
    };
    const options = {
      method: "PUT",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*",
        ],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    };

    functions
      .fetchData(url, options)
      .then((data) => {
        if (data.message) {
          console.log(data.message);
          callback(data.message);
        } else {
          callback(null);
        }
      })
      .catch((err) => {
        console.log("Update Profile: " + err);
      });
  },

  clearPath: function () {
    //clear path
    this.Path.path_ = null;
  },

  enlistWorker: function (form, callback) {
    //fetch project data
    const project = {
      projid: form.id.textContent,
    };
    const fetchOptions = {
      method: "POST",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*",
        ],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(project),
    };

    let url = "/enlist";
    functions
      .fetchData(url, fetchOptions)
      .then((data) => {
        if (!data.message) {
          functions.displayAlert(data.errMessage, "error");
          callback(null);
        } else {
          callback(data.message);
        }
      })
      .catch((err) => {
        console.log("enlist fetch error: " + err);
      });
  },

  redeemReward: function (form, callback) {
    const reward = {
      used: form.used.value,
      total: form.total.textContent,
      benefit: form.benefit.value,
    };
    const fetchOptions = {
      method: "PUT",
      headers: {
        Accept: [
          "application/x-www-form-urlencoded",
          "application/json",
          "text/plain",
          "*/*",
        ],
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reward),
    };
    let url = "/redeemreward";
    functions
      .fetchData(url, fetchOptions)
      .then((data) => {
        if (data.errMessage) {
          functions.displayAlert(data.errMessage, "error");
          callback(null);
        } else {
          callback(data.message);
          // reset used value to empty
        }
      })
      .catch((err) => {
        console.log("redeem reward error: " + err);
      });
  },

  loadPoints: function (callback) {
    let url = "/loadpoints";
    functions
      .fetchData(url, {
        method: "PUT",
        headers: {
          Accept: [
            "application/x-www-form-urlencoded",
            "application/json",
            "text/plain",
            "*/*",
          ],
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        if (data) {
          callback(data);
        }
      })
      .catch((err) => {
        console.log("Load Points Fetch err: ", err);
      });
  },

  withdrawFromProject: function (projectId, callback) {
    let url = "/dropworker";
    let project = {
      projid: projectId.textContent,
    };
    functions
      .fetchData(url, {
        method: "DELETE",
        headers: {
          Accept: [
            "application/x-www-form-urlencoded",
            "application/json",
            "text/plain",
            "*/*",
          ],
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      })
      .then((response) => {
        if (response) callback(response);
      })
      .catch((err) => {
        console.log("withdraw project Fetch err: ", err);
      });
  },

  viewMyProjects: function (callback) {
    let url = "/getuserproject";
    functions
      .fetchData(url, {
        method: "GET",
        headers: {
          Accept: [
            "application/x-www-form-urlencoded",
            "application/json",
            "text/plain",
            "*/*",
          ],
          "Content-Type": "application/json",
        },
      })
      .then((data) => {
        if (data) {
          callback(data);
        }
      })
      .catch((err) => {
        console.log("view my projects Fetch err: ", err);
      });
  },
};

export { FetchHandler };
