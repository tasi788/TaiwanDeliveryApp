import './index.scss';

interface Service {
    id: number;
    name: string;
    description: string;
}

function loadServices(): Service[] | null {
    fetch('./service/services.json')
        .then(response => response.json())
        .then(data => {
            const services: Service[] = data as Service[];
            console.log(data);
            return services;
        })
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
    return null;
}

const services = loadServices();
console.log(services);