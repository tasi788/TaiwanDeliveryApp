export interface Service {
    name: number;
    label: string;
    url: string;
    enable: boolean | undefined;
}

export interface ServiceList {
    services: Service[];
}

export interface ServiceToggleStatus {
    [key: string]: boolean;
}

export interface ServiceToggle {
    serviceToggle: ServiceToggleStatus;
}

export interface Token {
    token: string
}

export interface APIToken {
    api: Token;
}