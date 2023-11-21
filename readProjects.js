function jsonReader(input) {
  console.log(`${input.title} - ${input.description}`);
  for (course of input.children) jsonReader(course);
}

async function logText() {
  const response = await fetch("./file.json");
  const text = await response.json();
  return(text);
}

logText();
