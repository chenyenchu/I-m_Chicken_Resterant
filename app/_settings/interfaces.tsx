export type Product = {
    id: string;
    desc: string;
    price: number;
    visible?: boolean;
    photo: string;
}

export type Drink = {
    id: string;
    desc: string;
    price: number;
    visible?: boolean;  
    photo: string;
};

export type Dessert = {
    id: string;
    desc: string;
    price: number;
    visible?: boolean;
    photo: string;
};

export type Set = {
    id: string;
    desc: string;
    price: number;
    content: string;
    visible?: boolean;
    photo: string;
};

export type Soup = {
    id: string;
    desc: string;
    price: number;
    visible?: boolean;
    photo: string;
};

export type Booking = {
    id: string;
    name: string;
    phone: string;
    people: number;
    date: string;
    time: string;
    state: string;
    visible?: boolean;
};
export type shoppingcart = {
    id: string;
    desc: string;
    price: number;
    flavor: string;
    unit: number;
    name:string;
    visible?: boolean;
};
export type foodorders = {
    id: string;
    desc: string;
    price: number;
    unit: number;
    name:string;
    visible?: boolean;
};
export type Account = {
    id: string;
    name: string;
    email: string;
    role: string;
    password: string;
    visible?: boolean;
};
export interface Users {
    id: string;
    email: string;
    name: string;
    password: string;
    role: string;
    visible?: boolean;
};
