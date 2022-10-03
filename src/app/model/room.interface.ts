import { User } from "./user.interface"

export interface Room{
    name?: string;
    description?: string;
    users?: User[];
    created_on?: Date;
    updated_on?: Date;
}