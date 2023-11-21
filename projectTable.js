const response = await fetch("projects.json");
const json = await response.json();

localStorage.setItem("projects", JSON.stringify(json));
const locjson = JSON.parse(localStorage.getItem("projects"));

const projectTable = document.querySelector("#projectTable");
const today = new Date();
console.log("day: ", today.getDate())

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
  console.log(project);
  //  }
}
