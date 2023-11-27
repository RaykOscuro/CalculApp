export function getDeadline(startDate, duration) {
  const deadline = new Date(startDate);
  deadline.setUTCHours(0, 0, 0, 0);
  return new Date(deadline.setDate(deadline.getDate() + duration));
}

export function dateSortingFunction(objA, objB) {
  if (
    getDeadline(objA.startDate, objA.duration) <=
    getDeadline(objB.startDate, objB.duration)
  ) {
    return -1;
  } else {
    return 1;
  }
}

export function nameSortingFunction(objA, objB) {
  if (objA.name.toLowerCase() <= objB.name.toLowerCase()) {
    return -1;
  } else {
    return 1;
  }
}

export function clientSortingFunction(objA, objB) {
  if (objA.client.toLowerCase() <= objB.client.toLowerCase()) {
    return -1;
  } else {
    return 1;
  }
}

export function budgetSortingFunction(objA, objB) {
  if (objA.budget <= objB.budget) {
    return -1;
  } else {
    return 1;
  }
}

export async function jsonReader() {
  //  localStorage.clear();

  if (!localStorage.getItem("projects")) {
    const response = await fetch("projects.json");
    const json = await response.json();

    localStorage.setItem("projects", JSON.stringify(json));
  }

  return JSON.parse(localStorage.getItem("projects"));
}
