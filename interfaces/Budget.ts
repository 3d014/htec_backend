interface BudgetData {
    [categoryId: string]: number;
}
interface RequestBody {
    budgetData: BudgetData[];
    month: string;
    year: number;
    spentBudget?: number; 
}

interface BudgetInstance {
    budgetId: string,
    totalBudget : number,
    spentBudget : number,
    year : number,
    month : number
}


export default RequestBody