interface Service {
    name: number;
    label: string;
    url: string;
}

interface ServiceList {
    services: Service[];
}

function loadServices(): Promise<ServiceList> {
    return fetch('./services.json')
        .then(response => response.json())
        .then(data => data as ServiceList);
}

let serviceslist: Promise<ServiceList> = loadServices();
const field = document.getElementsByClassName("field");
serviceslist.then(service => {
    service.services.forEach(service => {
        console.log(service);
        let div = document.createElement("div");
        div.className = "cell";
        div.innerHTML = `<input id="${service.label}" type="checkbox" name="${service.label}" class="switch is-warning">
        <label for="${service.label}" >${service.name}</label>`;
        field[0].appendChild(div);
    }
    )
});

