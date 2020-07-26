export class Location{
    _id:any;
    band_Number:number;
    location:string;
    degree_of_progress:number;
    completion_rate:number;
    payment:pay[];
    total_actual_expenses:number;
    required_payment:number;
    total_fees:number;
    fees_until_now:number;
    supervision_fees_required:number;
    admin_id:any;
    date:any;
    bussines_id:any
    
}
export interface  pay {
    
    values:number;
}