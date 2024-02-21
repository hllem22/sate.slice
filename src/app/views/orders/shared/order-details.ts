import { ItemDetailsView } from "./item-details";

export interface OrderDetails {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    region: string;
    remarks: string;
    dateCreated: string;
    createdBy: string;
    status: string;
    itemList: ItemDetailsView[];
    pickupDate: string;
    paid: boolean;
}

export class OrderDetailsView {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    region: string;
    remarks: string;
    dateCreated: string;
    createdBy: string;
    status: string;
    itemList: ItemDetailsView[];
    pickupDate: string;
    paid: boolean;
}

export interface TotalOrders {
    code: string;
    description: string;
    quantity: number;
    totalAmount: string;
    itemList: TotalOrders[];
}

export class TotalOrdersView {
    code: string;
    description: string;
    quantity: number = 0;
    totalAmount: string = '0.00';
    itemList: TotalOrders[];
}

export class OrderDetailsPage{
    public list:Array<OrderDetailsView>;
    public pageNumber:number=0;
    public totalpages:number=0;
    public size:number=0;
    public totalRecord:number=0;
    public totalList:Array<TotalOrdersView>;
}