// import * as forms from "./forms.js";
// const usersession = new forms.UserSession();

function menuToggle() {
  /* Toggle Menu*/
  const menuBtn = document.querySelector(".menu-btn");
  const menuHeader = document.querySelector(".menu-header");

  let showMenu = false;
  menuBtn.onclick = function () {
    if (!showMenu) {
      menuBtn.classList.add("close");
      menuHeader.classList.add("show");

      //reset Menu State
      showMenu = true;
    } else {
      menuBtn.classList.remove("close");
      menuHeader.classList.remove("show");

      //reset Menu State
      showMenu = false;
    }
  };
}

function displayAlert(msg, type) {
  //Alert Display
  let parag = document.createElement("p");
  parag.classList.add("p-info");
  parag.append(document.createTextNode(msg));

  // Alert Close button
  let closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.append(document.createTextNode("X"));
  parag.append(closeButton);

  if (type === "error") {
    parag.style.background = "red";
  } else if (type === "info") {
    parag.style.background = "blue";
  } else if (type === "success") {
    parag.style.background = "green";
  }

  if (
    document.querySelector(".modal") &&
    document.querySelector(".alert-box")
  ) {
    let modal = document.querySelector(".modal");
    let alertBox = document.querySelector(".alert-box");
    alertBox.appendChild(parag);
    modal.appendChild(alertBox);
  } else {
    // background
    let modal = document.createElement("div");
    modal.classList.add("modal");
    let alertBox = document.createElement("div");
    alertBox.classList.add("alert-box");
    alertBox.appendChild(parag);
    modal.appendChild(alertBox);
    document.body.appendChild(modal);
  }
  closeButton.onclick = function () {
    let modal = document.querySelector(".modal");
    let alertBox = document.querySelector(".alert-box");
    alertBox.removeChild(parag);
    // modal.removeChild(alertBox);
    if (document.querySelectorAll(".p-info").length == 0) {
      // alertBox.removeChild(parag);
      document.body.removeChild(modal);
      // alertBox.style.display = "none";
    }
    // if(alert)
  };
}

function appendProfileToMobileMenu() {
  // show icon when user is logged in successfully
  let menuItem = document.querySelectorAll(".menu-item");
  //grab and change the sign in list item to my profile
  menuItem[3].setAttribute("href", "/profile");
  menuItem[3].textContent = "My Profile";

  //append signout menu
  let menuList = document.querySelector(".menu-list");
  let signoutMenu = document.createElement("li");
  let signoutLink = document.createElement("a");
  signoutLink.setAttribute("href", "/logout");
  signoutLink.classList.add("menu-item"); //add existing class
  signoutLink.textContent = "Sign Out";

  signoutMenu.appendChild(signoutLink);
  menuList.appendChild(signoutMenu);
}

function enableSlideMenu(userIcon) {
  //called by showUserIcon();
  //create a new div
  let profileDiv = document.createElement("div");
  profileDiv.classList.add("profile-div"); //add existing class
  let ul = document.createElement("ul");

  let profile = document.createElement("li");
  let profileLink = document.createElement("a");
  profileLink.setAttribute("href", "/profile");
  profileLink.textContent = "My Profile";
  profile.appendChild(profileLink);

  let signout = document.createElement("li");
  let signoutLink = document.createElement("a");
  signoutLink.setAttribute("href", "/logout");
  signoutLink.textContent = "Log Out";
  signout.appendChild(signoutLink);

  ul.appendChild(profileLink);
  ul.appendChild(signoutLink);
  profileDiv.appendChild(ul);
  document.body.appendChild(profileDiv);

  let dropdown = false;

  userIcon.onclick = function () {
    if (!dropdown) {
      userIcon.classList.add("enable-slide");
      profileDiv.classList.add("slide-down");

      //reset Menu State
      dropdown = true;
    } else {
      userIcon.classList.remove("enable-slide");
      profileDiv.classList.remove("slide-down");

      //reset Menu State
      dropdown = false;
    }
  };
}

function saveCurrentData(array, formName) {
  for (let i = 0; i < formName.elements.length - 1; i++) {
    array.push(formName.elements[i].value); // || "disabled";
  }
}

function clearCurrentData() {
  initialValues = [];
}

function clearFormFields(formName) {
  let element = formName.elements;
  for (let i = 0; i < element.length - 1; i++) {
    element[i].value = "";
  }
}

function validateSignupForm(formName) {
  let element = formName.elements;
  //check for empty fields
  for (let i = 0; i < element.length - 1; i++) {
    if (element[i].value == "") {
      return false;
    }
  }
  return true;
}

/* create and dynamically add projects */
function appendProjects(project) {
  let pill = document.querySelector(".project-pills");
  let project_ = document.createElement("li");
  project_.classList.add("project_");

  let proj_id = document.createElement("div");
  proj_id.classList.add("project-id");
  let proj_title = document.createElement("div");
  proj_title.classList.add("project-title");
  let proj_worth = document.createElement("div");
  proj_worth.classList.add("project-worth");
  let proj_posted = document.createElement("div");
  proj_posted.classList.add("project-posted");
  let proj_status = document.createElement("div");
  proj_status.classList.add("project-status");
  let proj_workers = document.createElement("div");
  proj_workers.classList.add("project-workers");
  let proj_current_workers = document.createElement("span");
  proj_current_workers.classList.add("current");
  let proj_total_workers = document.createElement("span");
  proj_total_workers.classList.add("total");
  let proj_button = document.createElement("div");
  proj_button.classList.add("project-button");
  let input = document.createElement("input");
  input.classList.add("my-btn");
  input.setAttribute("type", "button");
  input.setAttribute("value", "View");

  /* Add text contents */
  proj_id.appendChild(document.createTextNode(project._id));
  proj_title.appendChild(document.createTextNode(project.title));
  proj_status.appendChild(document.createTextNode(project.status));
  proj_worth.appendChild(document.createTextNode(project.reward_points));
  proj_current_workers.appendChild(
    document.createTextNode(
      project.current_workers ? project.current_workers + "/" : 0 + "/"
    )
  );
  proj_total_workers.appendChild(
    document.createTextNode(project.max_workers ? project.max_workers : 0)
  );

  proj_workers.append(proj_current_workers);
  proj_workers.append(proj_total_workers);
  proj_posted.appendChild(document.createTextNode(project.posted_by));
  proj_button.appendChild(input);

  /* Append to project group */
  project_.appendChild(proj_id);
  project_.appendChild(proj_title);
  project_.appendChild(proj_status);
  project_.appendChild(proj_worth);
  project_.appendChild(proj_workers);
  project_.appendChild(proj_posted);
  project_.appendChild(proj_button);

  /* Visual design for completed projects */
  if (project.proj_status == "Completed") {
    project_.style.backgroundColor = "#888";
  }
  pill.appendChild(project_);
  // document.body.appendChild("pill");
}

function viewProject(fetchHandler) {
  /* view Project page */
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

async function fetchData(url, options) {
  const rawResponse = await fetch(url, options);
  const jsonData = await rawResponse.json();
  return jsonData;
}

export {
  menuToggle,
  displayAlert,
  appendProfileToMobileMenu,
  enableSlideMenu,
  saveCurrentData,
  clearCurrentData,
  clearFormFields,
  validateSignupForm,
  fetchData,
  appendProjects,
  viewProject,
};
