import { User } from "./user.interface"

export interface Room{
    name?: string;
    description?: string;
    seller_id?: string;
    buyer_id?: string;
    product_id?: string;
    created_on?: Date;
    updated_on?: Date;
}