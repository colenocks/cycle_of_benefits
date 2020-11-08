import * as functions from "./js/functions.js";
import { FetchHandler } from "./js/fetch.js";

const fetchHandler = new FetchHandler();

/* Menu Button Toggle functionality */
if (document.querySelector(".menu-btn")) {
  functions.menuToggle();
}

/* Display profile styles */
if (document.querySelector(".signin-div")) {
  let div = document.querySelector(".signin-div");
  //fetch user session to display styles
  functions
    .fetchData("/usersession")
    .then((data) => {
      if (data.session) {
        //display styles
        let userLink = document.querySelector(".signin-link");
        let formbutton = document.querySelector(".form-button");
        let iconLink = document.createElement("a");
        let userIcon = document.createElement("i");
        userIcon.classList.add("fas", "fa-user", "fa-2x");
        userIcon.setAttribute("id", "user-icon");
        iconLink.append(userIcon);
        div.appendChild(iconLink);
        userLink.parentNode.removeChild(userLink);

        functions.enableSlideMenu(userIcon);
        functions.appendProfileToMobileMenu();

        if (data.session == "cyobadmin") {
          /* Admin views */
          if (document.querySelector("#viewproject")) {
            const form = {
              formName: document.forms.namedItem("project-form"),
              id: document.getElementById("view_id"),
              type: document.getElementById("view_type"),
              title: document.getElementById("view_title"),
              details: document.getElementById("view_details"),
              tools: document.getElementById("view_tools"),
              address: document.getElementById("view_address"),
              city: document.getElementById("view_city"),
              status: document.getElementById("view_status"),
              currentworkers: document.getElementById("view_current_workers"),
              maxworkers: document.getElementById("view_no_of_workers"),
              duration: document.getElementById("view_duration"),
              point: document.getElementById("view_worth"),
            };

            let editProject = document.getElementById("editProject");
            let enlist = document.getElementById("interest");
            let addBtn = document.getElementById("addproject-btn");
            let editBtn = document.getElementById("editproject-btn");
            let updateProjectBtn = document.getElementById(
              "update-project-btn"
            );

            console.log("Welcome Admin");

            //disable/remove enlist button
            enlist.style.display = "none";
            editProject.style.display = "block";

            let fields = Array.from(
              form.formName.querySelectorAll("input[type=text]")
            );

            updateProjectBtn.style.display = "block";
            updateProjectBtn.setAttribute("disabled", true);
            let editToggle = false;

            //edit click listener function
            editBtn.onclick = function (e) {
              e.preventDefault();
              if (!editToggle) {
                for (let i = 0; i < fields.length; i++) {
                  fields[i].classList.add("edit-profile");
                  fields[i].removeAttribute("disabled");
                }
                updateProjectBtn.removeAttribute("disabled");
                editToggle = true;
              } else {
                for (let i = 0; i < fields.length; i++) {
                  fields[i].classList.remove("edit-profile");
                  fields[i].setAttribute("disabled", true);
                }
                updateProjectBtn.setAttribute("disabled", true);
                editToggle = false;
              }
            };

            updateProjectBtn.onclick = function (e) {
              e.preventDefault();
              fetchHandler.updateProject(form, (response) => {
                if (response) {
                  functions.displayAlert(response, "success");
                  editToggle = false;
                }
              });
            };

            addBtn.onclick = function (e) {
              e.preventDefault();
              let id = document.getElementById("view_id");
              fetchHandler.approveProject(id);
            };
          }
        }
      } else {
        // functions.displayAlert(data.errMessage, "info");
      }
    })
    .catch((err) => {
      console.log("error fetching user session: " + err);
    });
}

/* Login and View Profile */
if (document.getElementById("loginform")) {
  const form = {
    loginForm: document.getElementById("loginform"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    formName: document.forms.namedItem("loginform"),
  };

  form.loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); //ignores the default submit behaviour through action
    fetchHandler.loginUser(form, function (profileUrl) {
      if (profileUrl) {
        functions.displayAlert("Login Successful!", "success");
        location.replace(location.origin + profileUrl);
      }
    });
  });
}

/* Signup */
if (document.getElementById("form")) {
  const form = {
    signupForm: document.getElementById("form"),
    fname: document.getElementById("reg_firstname"),
    lname: document.getElementById("reg_lastname"),
    user: document.getElementById("reg_username"),
    email: document.getElementById("reg_email"),
    password: document.getElementById("reg_password"),
    password_match: document.getElementById("reg_conf_password"),
    formName: document.forms.namedItem("form"),
  };

  document.getElementById("form").addEventListener("submit", (e) => {
    e.preventDefault();
    fetchHandler.signupUser(form);
  });
}

/* Update Profile */
if (document.querySelector(".profile")) {
  let editBtn = document.querySelector("#edit-button");
  let saveChanges = document.querySelector("#save_changes");
  let profileForm = document.getElementById("profile-form");
  let formName = document.forms.namedItem("profile-form");

  let inputFields = Array.from(
    profileForm.querySelectorAll(
      "input[type=text], input[type=date], input[type=email]"
    )
  ).slice(1);
  let initialValues = [];
  let editToggle = false;
  functions.saveCurrentData(initialValues, formName);
  //Edit Profile
  editBtn.onclick = editable;

  function editable() {
    //put form values in array
    if (!editToggle) {
      for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].classList.add("edit-profile");
        inputFields[i].removeAttribute("readonly");
      }
      saveChanges.removeAttribute("disabled");
      editToggle = true;
    } else {
      for (let i = 0; i < inputFields.length; i++) {
        inputFields[i].classList.remove("edit-profile");
        inputFields[i].setAttribute("readonly", true);
      }
      saveChanges.setAttribute("disabled", true);
      editToggle = false;
    }
  }
  /* Reset fields */
  let resetBtn = document.getElementById("reset_button");
  resetBtn.onclick = () => {
    if (initialValues.length > 0) {
      // if (confirm("Are You sure you want to rest changes?")) {
      for (let i = 0; i < initialValues.length; i++) {
        formName.elements[i].value = initialValues[i];
      }
      saveChanges.setAttribute("disabled", true);
      editToggle = false;
      functions.clearCurrentData();
    }
  };

  //Save changes
  profileForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const form = {
      username: document.getElementById("edit_username"),
      fname: document.getElementById("edit_firstname"),
      lname: document.getElementById("edit_lastname"),
      email: document.getElementById("edit_email"),
      dob: document.getElementById("edit_dob"),
      address: document.getElementById("edit_address"),
      phone: document.getElementById("edit_phone"),
      state: document.getElementById("edit_state"),
      nationalId: document.getElementById("edit_national_id"),
    };
    fetchHandler.updateProfile(form, (response) => {
      if (!response) {
        functions.displayAlert("Could not update profile", "error");
      } else {
        functions.displayAlert(response, "success");
        functions.clearCurrentData();
        functions.saveCurrentData(initialValues, formName);
        editToggle = false;
        // editable();
      }
    });
  });
}

/*  Profile page stack functionality*/
if (document.querySelector(".boxes")) {
  // let leftbox = document.querySelector(".leftbox");
  let navLinks = document.querySelectorAll(".leftbox nav a");
  let nav = document.querySelector(".rightbox").children;
  let postproject = document.querySelector(".postproject");
  let profile = document.querySelector(".profile");
  let messages = document.querySelector(".messages");
  let rewards = document.querySelector(".rewards");
  let info = document.querySelector(".information");

  //stacked divs display function
  navLinks.forEach((link) => {
    link.onclick = function (e) {
      e.preventDefault();
      navLinks.forEach((otherlinks) => {
        otherlinks.classList.remove("active");
      });
      link.classList.add("active");
      if (link.id === "postproject") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        postproject.classList.remove("noshow");
      } else if (link.id === "profile") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        profile.classList.remove("noshow");
      } else if (link.id === "messages") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        messages.classList.remove("noshow");
      } else if (link.id === "rewards") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        rewards.classList.remove("noshow");
      } else if (link.id === "information") {
        for (let i = 0; i < nav.length; i++) {
          nav[i].classList.add("noshow");
        }
        info.classList.remove("noshow");
      }
    };
  });
}

/* Load all projects */
if (document.querySelector(".projects")) {
  /* view Project page */
  function viewProject() {
    let projectRow = document.querySelectorAll(".project_");
    let projectBtn = document.querySelectorAll(".project-button > input");
    let projectId = document.querySelectorAll(".project-id");

    for (let i = 0; i < projectRow.length; i++) {
      projectBtn[i].onclick = function () {
        fetchHandler.viewProject(projectId[i], (projectidUrl) => {
          if (projectidUrl) {
            location.assign(location.origin + projectidUrl);
          }
        });
      };
    }
  }
  fetchHandler.getProjects((projects) => {
    if (projects) {
      // for (const item in projects) {
      //   functions.appendProjects(item);
      // }
      functions.appendProjects(projects);
      viewProject();
    } else {
      console.log("App js: No project data");
    }
  });
}

/* Add project */
if (document.querySelector("#post_project")) {
  const form = {
    projectform: document.getElementById("post_project"),
    projectType: document.getElementById("proj_type"),
    projectTitle: document.getElementById("proj_title"),
    projectTools: document.getElementById("proj_tools"),
    projectDetails: document.getElementById("proj_details"),
    projectAddress: document.getElementById("proj_address"),
    projectCity: document.getElementById("proj_city"),
    projectDuration: document.getElementById("proj_duration"),
    projectWorkers: document.getElementById("proj_max_workers"),
    formName: document.forms.namedItem("post_project"),
  };

  form.projectform.addEventListener("submit", (e) => {
    e.preventDefault();
    fetchHandler.addProject(form);
  });
}

/* Update Project current workers */
if (document.querySelector("#project")) {
  // let submitenlist = document.getElementById("enlist");
  const form = {
    projectform: document.getElementById("project-form"),
    id: document.getElementById("view_id"),
  };

  form.projectform.onsubmit = function (e) {
    e.preventDefault();
    fetchHandler.enlistWorker(form, (result) => {
      if (result) {
        fetchHandler.incrementWorkers(form, (incremented) => {
          if (incremented) {
            functions.displayAlert(result, "success");
          }
        });
      }
    });
  };
}

/* Rewards Page */
if (document.querySelector(".rewards")) {
  /* Reload Points */
  // Triggers the assignReward method
  if (document.querySelector(".reward-load")) {
    let reload = document.getElementById("reload");
    reload.onclick = function () {
      fetchHandler.loadPoints((res) => {
        if (res.message) {
          functions.displayAlert(res.message, "success");
        } else if (res.errMessage) {
          functions.displayAlert(res.errMessage, "error");
        }
      });
    };
  }
  /* Redeem Reward */
  if (document.querySelector("#rewardform")) {
    const form = {
      rewardForm: document.getElementById("rewardform"),
      total: document.getElementById("totalpoints"),
      used: document.getElementById("usedpoints"),
      benefit: document.getElementById("benefittype"),
    };

    form.rewardForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // ensure used value is always less or equal to total value
      console.log(form.total.textContent + ": used-" + form.used.value);
      if (
        form.used.value > parseInt(form.total.textContent, 10) ||
        form.total.textContent == 0
      ) {
        functions.displayAlert(
          "You have insufficient points, earn more points",
          "error"
        );
      } else if (form.used.value === "" || form.used.value == 0) {
        functions.displayAlert("Select number of points to redeem", "error");
      } else {
        fetchHandler.redeemReward(form, (message) => {
          if (message) {
            functions.displayAlert(message, "success");
            form.used.value = "";
          }
        });
      }
    });
  }
}

/* View my Enlisted projects */
if (document.querySelector(".messages")) {
  const myEnlistedProjects = function (recordset) {
    let list = document.querySelector(".myprojects");
    let myproject_ = document.createElement("li");
    myproject_.classList.add("myproject_");

    let proj_id = document.createElement("div");
    proj_id.classList.add("myproject-id");
    let proj_title = document.createElement("div");
    proj_title.classList.add("myproject-title");
    let proj_status = document.createElement("div");
    proj_status.classList.add("myproject-status");

    let proj_button = document.createElement("div");
    proj_button.classList.add("myproject-button");
    let input = document.createElement("input");
    input.classList.add("my-btn");
    input.setAttribute("type", "button");
    input.setAttribute("value", "Cancel");
    input.style.background = "red";
    proj_button.appendChild(input);

    proj_id.appendChild(document.createTextNode(recordset.projId));
    proj_title.appendChild(document.createTextNode(recordset.proj_title));
    proj_status.appendChild(document.createTextNode(recordset.proj_status));

    myproject_.appendChild(proj_id);
    myproject_.appendChild(proj_title);
    myproject_.appendChild(proj_status);
    myproject_.appendChild(proj_button);

    list.appendChild(myproject_);
  };

  /* Cancel/De-enlist from project */
  const cancelProject = function () {
    let projectRow = document.querySelectorAll(".myproject_");
    let projectBtn = document.querySelectorAll(".myproject-button > input");
    let projectId = document.querySelectorAll(".myproject-id");
    for (let i = 0; i < projectRow.length; i++) {
      projectBtn[i].onclick = function () {
        if (confirm("Are you sure you want to cancel out?")) {
          fetchHandler.withdrawFromProject(projectId[i], (data) => {
            if (data.message) {
              functions.displayAlert(data.message, "success");
            } else {
              functions.displayAlert(data.errMessage, "error");
            }
          });
        }
      };
    }
  };

  fetchHandler.viewMyProjects((data) => {
    if (!data.errMessage) {
      for (let i = 0; i < data.length; i++) {
        myEnlistedProjects(data[i]);
      }
      cancelProject();
    } else {
      console.log("Oga, nothing show");
      functions.displayAlert(data.errMessage, "error");
    }
  });
}
