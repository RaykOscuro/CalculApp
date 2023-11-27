import { jsonReader } from "./projectFunctions";
import { dateSortingFunction } from "./projectFunctions";
import { getDeadline } from "./projectFunctions";

const locjson = await jsonReader();
locjson.sort(dateSortingFunction);

const timeWindow = document.querySelector("h3");

const today = new Date();
today.setUTCHours(0,0,0,0)
const timeWindowEnd = new Date();
timeWindowEnd.setUTCHours(0,0,0,0)
timeWindowEnd.setDate(timeWindowEnd.getDate() + 10);

timeWindow.innerText = `Upcoming Deadlines (${
  today.getDate() < 10 ? "0" : ""
}${today.toLocaleDateString("de-DE")} - ${
  timeWindowEnd.getDate() < 10 ? "0" : ""
}${timeWindowEnd.toLocaleDateString("de-DE")})`;

const projectContainer = document.querySelector(".container_a");

for (var project of locjson) {
  const projectDiv = document.createElement("div");
  const deadline = getDeadline(project.startDate, project.duration);
  const remainingDays = Math.floor((deadline - today) / (1000 * 60 * 60 * 24));
  console.log(deadline, remainingDays);
  if (remainingDays >= 0 && remainingDays < 11 && project.status === "Open") {
    projectDiv.classList.add("container_projectCard");
    projectDiv.innerHTML = `<div class="title">
    <div class="frameImageProject">
      <img src="./images/PersonFilled.svg" class="imageProject" />
    </div>
    <h4 class="cardTitle">${project.name}</h4>
  </div>
  <div class="projectStatus">
    <h5>Project Progress</h5>
    <div class="progressBar_blank">
      <span class="progressBar_text">${project.progress}%</span>
      <div class="progressBar_filled" style="width: ${project.progress}%"></div>
    </div>
  </div>
  <div class="projectStatus">
    <h5>Deadline: ${
      deadline.getDate() < 10 ? "0" : ""
    }${deadline.toLocaleDateString("de-DE")}</h5>
    <div class="progressBar_blank scheduleBad_bg">
      <span class="progressBar_text">${remainingDays} day${
      remainingDays !== 1 ? "s" : ""
    } left (of ${project.duration})</span>
      <div class="progressBar_filled scheduleBad_main" style="width: ${
        ((project.duration - remainingDays) / project.duration) * 100
      }%"></div>
    </div>
  </div>`;
    projectContainer.appendChild(projectDiv); // append it to the parent html element (ul)
  }
}
