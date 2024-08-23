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

export interface API_addQuery {
    track_id: string;
    service: string;
    note: string;
}

export function Service2Id(input: string): string | false {
    const list: { [key: string]: string } = {
        "網家速配": "GoPcHome",
        "郵局": "Ipost"
    };

    return list[input] || false;
}

