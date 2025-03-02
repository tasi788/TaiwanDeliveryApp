import { readStorage } from "./utils.js";
import { Service, ServiceList, ServiceToggle } from "./types";

function loadServices(): Promise<ServiceList> {
  return fetch("./services.json")
    .then((response) => response.json())
    .then((data) => data as ServiceList);
}

let serviceslist: Promise<ServiceList> = loadServices();
const field = document.getElementsByClassName("field");
serviceslist.then((service) => {
  service.services.forEach(async (service) => {
    // console.log(service);
    let checked = "";
    let serviceToggleData = (await readStorage(
      "serviceToggle",
    )) as ServiceToggle;
    if (
      serviceToggleData.serviceToggle &&
      serviceToggleData.serviceToggle[service.label]
    ) {
      checked = `checked="checked"`;
    }
    let div = document.createElement("div");
    div.className = "cell";
    div.innerHTML = `<input id="${service.label}" type="checkbox" name="${service.label}" class="switch is-warning" ${checked}>
      <label for="${service.label}">${service.name}</label>`;

    let checkbox = div.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    if (checkbox) {
      checkbox.addEventListener("click", function () {
        let isChecked = checkbox.checked;
        readStorage("serviceToggle").then((result) => {
          let data = result as ServiceToggle;
          if (!data.serviceToggle) {
            console.log("serviceToggle not found");
            data = { serviceToggle: {} };
          }
          console.log(data.serviceToggle);
          data.serviceToggle[service.label] = isChecked;
          chrome.storage.sync.set({ serviceToggle: data.serviceToggle });
        });
      });
    }

    field[0].appendChild(div);
  });
});
