import { jsonReader } from "./projectFunctions"; //reads projects from json file into local storage, then returns object from storage
import { budgetSortingFunction } from "./projectFunctions"; //different compare functions (by date)
import { dateSortingFunction } from "./projectFunctions"; //different compare functions (by date)
import { clientSortingFunction } from "./projectFunctions"; //different compare functions (by client)
import { nameSortingFunction } from "./projectFunctions"; //different compare functions (by project name)
import { getDeadline } from "./projectFunctions"; //calculates the deadline from starting date and duration

const locjson = await jsonReader();
locjson.sort(dateSortingFunction);

// counter to keep track of tasks while creating a new project

let assignCounter = 1;

// get today's date (at the start of the day)

const today = new Date();
today.setUTCHours(0, 0, 0, 0);

// getting all the DOM elements we need

const theFormItself = document.getElementById("dataForm");

const newProjectForm = document.getElementById("projectPopup");
const formPageOne = document.getElementById("formPageOne");
const formPageTwo = document.getElementById("formPageTwo");
const formContainerTwo = document.getElementById("formContainerTwo");

const newProjectButton = document.getElementById("newProjectButton");
const cancelButton = document.getElementById("cancelButton");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const confirmButton = document.getElementById("confirmButton");

const headerPopup = document.getElementsByClassName("header_popup");
const headerBudget = document.getElementById("header_budget");

const nameInput = document.getElementById("projectName");
const clientInput = document.getElementById("projectClient");
const budgetInput = document.getElementById("projectBudget");
const deadlineInput = document.getElementById("projectDeadline");
deadlineInput.min = today.toISOString().slice(0, 10);

let departmentSelector = document.getElementById("projectDepartment1");
let hourSelector = document.getElementById("projectHours1");
let employeeSelector = document.getElementById("projectEmployee1");

const projectCost = document.getElementById("currentCost");
const costBar = document.getElementById("costBar");
const sortButtons = document.getElementsByClassName("tableButton");
const projectSearch = document.getElementById("projectSearch");
const projectStatus = document.getElementById("projectStatus");
const projectTable = document.querySelector("#projectTable");

// function to fill our project table with entries, restricted by search & status selector

function populateTable() {
  const searchTerm = projectSearch.value;
  const statusFilter = projectStatus.value;
  for (var project of locjson) {
    const projectRow = document.createElement("tr");
    projectRow.classList.add("projectRow");
    const deadline = getDeadline(project.startDate, project.duration);
    const remainingDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
    projectRow.innerHTML = `<td><button class="innerTableButton" id="${project.name.replace(
      /\s/g,
      ""
    )}">${project.name}</button></td>
    <td>${project.client}</td>
    <td>${deadline.getDate() < 10 ? "0" : ""}${deadline.toLocaleDateString(
      "de-DE"
    )}</td>
      <td>${project.status}</td>
      <td><div class="progressBar_blank progress_inTable">
      <span class="progressBar_text progress_inTable">${
        project.progress
      }%</span>
      <div class="progressBar_filled" style="width: ${project.progress}%">
      </div>
      </div></td>
      <td>€ ${project.budget.toLocaleString("de-DE")}</td>`;
    const searchField =
      project.name.toLowerCase() +
      "••••" +
      project.client.toLowerCase() +
      "••••" +
      project.status.toLowerCase();
      console.log(searchField);
    if (!statusFilter || project.status == statusFilter) {
      if (!searchTerm || searchField.includes(searchTerm.toLowerCase())) {
        projectTable.appendChild(projectRow);
        document
          .getElementById(`${project.name.replace(/\s/g, "")}`)
          .addEventListener("click", (e) => console.log(e.target.id));
      }
    }
    console.log(project.budget.toLocaleString("de-DE"));
    console.log(project);
  }
}

function showPopup() {
  theFormItself.reset();
  formPageOne.classList.remove("hidden");
  formPageTwo.classList.add("hidden");
  newProjectForm.classList.toggle("hidden");
  setTimeout(() => newProjectForm.classList.toggle("invisible"), 10);
  setTimeout(() => newProjectForm.classList.toggle("visible"), 10);
}

function hidePopup(isSend) {
  newProjectForm.classList.toggle("visible");
  newProjectForm.classList.toggle("invisible");
  setTimeout(() => formPageOne.classList.remove("hidden", "left"), 500);
  setTimeout(() => formPageTwo.classList.add("hidden", "right"), 500);
  setTimeout(() => newProjectForm.classList.toggle("hidden"), 500);
  if (isSend) {
    const trueForm = new FormData(document.getElementById("dataForm"));
    console.log(trueForm);
    const allTasksClean = [];
    for (let task = 1; task < assignCounter; task++) {
      const currentDepartment = trueForm.get(`projectDepartment${task}`);
      console.log(currentDepartment);
      if (currentDepartment) {
        const newTask = {
          department: currentDepartment,
          hours: trueForm.get(`projectHours${task}`),
          employee: trueForm.get(`projectEmployee${task}`),
        };
        allTasksClean.push(newTask);
      }
    }
    const deadlineDate = new Date(
      `${trueForm.get("projectDeadline")}T12:00:00`
    );
    const newProject = {
      name: trueForm.get("projectName"),
      progress: 0,
      startDate: today,
      duration: Math.floor(
        Math.abs(deadlineDate - today) / (1000 * 60 * 60 * 24)
      ),
      status: "Open",
      budget: trueForm.get("projectBudget"),
      client: trueForm.get("projectClient"),
      tasks: allTasksClean,
    };
    console.log(deadlineDate);
    locjson.push(newProject);
    console.log(locjson);
    localStorage.setItem("projects", JSON.stringify(locjson));
  }
}

function switchPopup(direction) {
  const trueForm = new FormData(document.getElementById("dataForm"));
  if (direction === "left") {
    if (nameInput.value && projectClient.value && projectDeadline.value) {
      formPageTwo.classList.remove("hidden");
      setTimeout(() => formPageOne.classList.add("left"), 0);
      setTimeout(() => formPageTwo.classList.remove("right"), 50);
      setTimeout(() => formPageOne.classList.add("hidden"), 250);
      if (budgetInput.value === "") {
        headerBudget.innerText = "Budget: unlimited";
      } else {
        headerBudget.innerText = `Budget: ${parseInt(
          budgetInput.value
        ).toLocaleString("de-DE")}€`;
      }
    }
  } else {
    formPageOne.classList.remove("hidden");
    setTimeout(() => formPageTwo.classList.add("right"), 0);
    setTimeout(() => formPageOne.classList.remove("left"), 50);
    setTimeout(() => formPageTwo.classList.add("hidden"), 250);
  }
}

function setProjectTitle(title) {
  for (let header of headerPopup) {
    header.innerText = title;
  }
}

function addNewInputRow(event) {
  assignCounter++;
  let parentCChildren =
    event.target.parentElement.parentElement.parentElement.children;
  parentCChildren =
    parentCChildren[parentCChildren.length - 1].children[0].children[0];
  console.log(parentCChildren, event.target);
  if (!event.target.value && parentCChildren !== event.target) {
    event.target.parentElement.parentElement.remove();
  } else if (event.target.value && parentCChildren == event.target) {
    const newInputRow = document.createElement("div");
    newInputRow.classList.add("toolbar", "toolbar_popup");
    newInputRow.innerHTML = `<div class="inputField inputField_search">
              <select id="projectDepartment${assignCounter}" name="projectDepartment${assignCounter}" class="inputBox inputBox_selector departmentSelector">
              <option value="" selected></option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="html Coding">html Coding</option>
              <option value="css Coding">css Coding</option>
              <option value="js Coding">js Coding</option>
              </select>
              <label for="projectDepartment${assignCounter}" class="labelInput">Position</label>
              </div>
              <div class="inputField inputField_status">
              <input id="projectHours${assignCounter}" name="projectHours${assignCounter}" type="number" class="inputBox" />
              <label for="projectHours${assignCounter}" class="labelInput">Hours</label>
              </div>
              <div class="inputField inputField_search">
              <select id="projectEmployee${assignCounter}" name="projectEmployee${assignCounter}" class="inputBox inputBox_selector">
              <option value="" selected></option>
              <option value="JoDoe">Jo Doe</option>
              <option value="lorem">Lorem</option>
              <option value="ipsum">Ipsum</option>
              <optgroup label="______________">
              <option value="new">New Employee...</option>
              </optgroup>
              </select>
              <label for="projectEmployee${assignCounter}" class="labelInput">Employee</label>
              </div>
              <div class="popup_button"></div>`;
    formContainerTwo.append(newInputRow);
    departmentSelector = document.getElementById(
      `projectDepartment${assignCounter}`
    );
    hourSelector = document.getElementById(`projectHours${assignCounter}`);
    employeeSelector = document.getElementById(
      `projectEmployee${assignCounter}`
    );
    departmentSelector.addEventListener("change", (e) => addNewInputRow(e));
    departmentSelector.addEventListener("change", (e) => calculateCost(e));
    hourSelector.addEventListener("change", (e) => calculateCost(e));
    employeeSelector.addEventListener("change", (e) => calculateCost(e));
  }
}

function calculateCost() {
  var currentCost = 0;
  const trueForm = new FormData(document.getElementById("dataForm"));
  const budget = trueForm.get("projectBudget");
  for (
    let functionCounter = 1;
    functionCounter <= assignCounter;
    functionCounter++
  ) {
    const currentDepartment = trueForm.get(
      `projectDepartment${functionCounter}`
    );
    const currentHours = trueForm.get(`projectHours${functionCounter}`);
    const currentEmployee = trueForm.get(`projectEmployee${functionCounter}`);
    hourSelector = document.getElementById(`projectHours${functionCounter}`);
    if (currentHours && currentHours < 0) {
      hourSelector.value = 0;
    }
    if (currentDepartment && currentHours && currentEmployee) {
      currentCost += currentHours * 50;
    }
  }
  projectCost.innerHTML = `${currentCost.toLocaleString("de-DE")}€`;
  if ((currentCost / budget) * 100 <= 100) {
    costBar.classList.remove("scheduleBad_main");
    costBar.style.width = `${(currentCost / budget) * 100}%`;
  } else if (budget) {
    costBar.style.width = `100%`;
    costBar.classList.add("scheduleBad_main");
  }
  console.log((currentCost / budget) * 100);
}

function sortTable(clickedButton) {
  const buttonMarking = clickedButton.innerText;
  for (const button of sortButtons) {
    if (button.innerText.endsWith(" ▾") && button !== clickedButton) {
      button.innerText = button.innerText.slice(0, -2);
    }
  }
  if (!buttonMarking.endsWith(" ▾")) {
    clickedButton.innerText = buttonMarking + " ▾";
  }

  const projectRows = document.getElementsByClassName("projectRow");
  for (const projectRow of projectRows) {
    setTimeout(() => projectRow.remove(), 0);
  }
  if (clickedButton.innerText.includes("Deadline")) {
    locjson.sort(dateSortingFunction);
  } else if (clickedButton.innerText.includes("Client")) {
    locjson.sort(clientSortingFunction);
  } else if (clickedButton.innerText.includes("Name")) {
    locjson.sort(nameSortingFunction);
  } else if (clickedButton.innerText.includes("Budget")) {
    locjson.sort(budgetSortingFunction);
  }
  populateTable();
}

function searchProject(searchTerm) {
  console.log(searchTerm);
  const projectRows = document.getElementsByClassName("projectRow");
  for (const projectRow of projectRows) {
    setTimeout(() => projectRow.remove(), 0);
  }
  populateTable(searchTerm);
}

projectSearch.value = "";
projectStatus.value = "";

populateTable();
newProjectButton.addEventListener("click", (e) => showPopup());
cancelButton.addEventListener("click", (e) => hidePopup(false));
nextButton.addEventListener("click", (e) => switchPopup("left"));
backButton.addEventListener("click", (e) => switchPopup("right"));
confirmButton.addEventListener("click", (e) => hidePopup(true));

nameInput.addEventListener("blur", (e) => setProjectTitle(e.target.value));

departmentSelector.addEventListener("change", (e) => addNewInputRow(e));
departmentSelector.addEventListener("change", (e) => calculateCost(e));
hourSelector.addEventListener("change", (e) => calculateCost(e));
employeeSelector.addEventListener("change", (e) => calculateCost(e));

for (const button of sortButtons) {
  button.addEventListener("click", (e) => sortTable(e.target));
}

projectSearch.addEventListener("input", (e) => searchProject());
projectStatus.addEventListener("change", (e) => searchProject());
