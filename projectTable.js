//localStorage.clear();

if (!localStorage.getItem("projects")) {
  const response = await fetch("projects.json");
  const json = await response.json();

  localStorage.setItem("projects", JSON.stringify(json));
}
const locjson = JSON.parse(localStorage.getItem("projects"));

const projectTable = document.querySelector("#projectTable");
const today = new Date();

for (var project of locjson) {
  const projectRow = document.createElement("tr");
  const deadline = new Date(project.startDate);
  deadline.setDate(deadline.getDate() + project.duration);
  const remainingDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  console.log(deadline, remainingDays);
  //  if (remainingDays >= 0 && remainingDays < 11 && project.status==="Open") {
  projectRow.innerHTML = `<td><a href="./CalculApp20.html">${
    project.name
  }</a></td>
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
  projectTable.appendChild(projectRow);
  console.log(project.budget.toLocaleString("de-DE"));
  console.log(project);
  //  }
}

let assignCounter = 1;

const theFormItself = document.getElementById("dataForm");
const trueForm = new FormData(document.getElementById("dataForm"));

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

let departmentSelector = document.getElementsByClassName("departmentSelector");
departmentSelector = departmentSelector[Object.keys(departmentSelector).pop()];

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
    const allTasksRaw = document.getElementsByClassName("toolbar_popup");
    const allTasksClean = [];
    for (let task = 0; task < allTasksRaw.length - 1; task++) {
      const newTask = {
        department: allTasksRaw[task].children[0].children[0].value,
        hours: allTasksRaw[task].children[1].children[0].value,
        employee: allTasksRaw[task].children[2].children[0].value,
      };
      allTasksClean.push(newTask);
    }
    const deadlineDate = new Date(`${deadlineInput.value}T23:59:59`);
    const newProject = {
      name: nameInput.value,
      progress: 0,
      startDate: today,
      duration: Math.ceil(
        Math.abs(deadlineDate - today) / (1000 * 60 * 60 * 24)),
      status: "Open",
      budget: Number(budgetInput.value),
      client: clientInput.value,
      tasks: allTasksClean,
    };
    console.log(deadlineDate);
    locjson.push(newProject);
    console.log(locjson);
    localStorage.setItem("projects", JSON.stringify(locjson));
  }
}

function switchPopup(direction) {
  if (
    direction === "left" &&
    nameInput.value &&
    projectClient.value &&
    projectDeadline.value
  ) {
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
    <select id="projectDepartment${assignCounter}" class="inputBox inputBox_selector departmentSelector">
      <option value="" selected></option>
      <option value="ui_ux">UI/UX Design</option>
      <option value="html">html Coding</option>
      <option value="css">css Coding</option>
      <option value="js">js Coding</option>
    </select>
    <label for="projectDepartment${assignCounter}" class="labelInput">Position</label>
  </div>
  <div class="inputField inputField_status">
    <input id="projectHours${assignCounter}" type="number" class="inputBox" />
    <label for="projectHours${assignCounter}" class="labelInput">Hours</label>
  </div>
  <div class="inputField inputField_search">
    <select id="projectEmployee${assignCounter}" class="inputBox inputBox_selector">
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
    departmentSelector = document.getElementsByClassName("departmentSelector");
    departmentSelector =
      departmentSelector[Object.keys(departmentSelector).pop()];
    departmentSelector.addEventListener("change", (e) => addNewInputRow(e));
  }
}

newProjectButton.addEventListener("click", (e) => showPopup());
cancelButton.addEventListener("click", (e) => hidePopup(false));
nextButton.addEventListener("click", (e) => switchPopup("left"));
backButton.addEventListener("click", (e) => switchPopup("right"));
confirmButton.addEventListener("click", (e) => hidePopup(true));

nameInput.addEventListener("blur", (e) => setProjectTitle(e.target.value));

departmentSelector.addEventListener("change", (e) => addNewInputRow(e));
