import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import { InvoiceInstance, InvoiceItemInstance } from "../../interfaces/Invoice";
import ProductInstance from "../../interfaces/Product";
import CategoryInstance from "../../interfaces/Category";
import BudgetInstance from "../../interfaces/Budget";
import CategoryBudgetInstance from "../../interfaces/CategoryBudget";
import { Budget } from "../../models/Budget";
import { Invoice } from "../../models/Invoice";
import { InvoiceItem } from "../../models/InvoiceItem";
import { Product } from "../../models/Product";
import { Category } from "../../models/Category";
import { CategoryBudget } from "../../models/Category-Budget";

// Function to create a new budget
export const createNewBudget = async (dateOfIssue: unknown, totalValueWithPdv: unknown) => {
    try {
        const budgetId = uuidv4(); // Generate new UUID for budgetId

        // Create a new Budget record
        await Budget.create({
            budgetId: budgetId,
            totalBudget: 0, // Assuming initial total budget is 0
            spentBudget: totalValueWithPdv, // Set spent budget
            year: dayjs(dateOfIssue as Date).format('YYYY'),
            month: dayjs(dateOfIssue as Date).format('MMMM')
        });

        // Fetch all categories
        const categories = await Category.findAll() as unknown as CategoryInstance[];

        // Create category budgets for the new budget
        await CategoryBudget.bulkCreate(categories.map(category => ({
            categoryBudgetId: uuidv4(),
            budgetId: budgetId,
            categoryId: category.categoryId,
            percentage: 0 // Assuming initial percentage is 0
        })));

    } catch (error) {
        console.error("Error creating new budget:", error);
    }
};

// Function to update category percentages based on budget and invoice items
const updateCategoryPercentages = async (
    budget: BudgetInstance,
    products: ProductInstance[],
    invoiceItems: InvoiceItemInstance[],
    chosenInvoices: InvoiceInstance[]
) => {
    try {
        // Fetch all categories
        const categories = await Category.findAll() as unknown as CategoryInstance[];

        // Initialize object to store sums for each category
        const categorySum: { [key: string]: number } = {};
        categories.forEach(category => categorySum[category.categoryId] = 0);

        // Extract invoiceIds from chosen invoices
        const chosenInvoicesIds = chosenInvoices.map(invoice => invoice.invoiceId);

        // Calculate sums for each category based on invoice items
        invoiceItems.forEach(item => {
            if (chosenInvoicesIds.includes(item.invoiceId)) {
                const product = products.find(product => item.productId === product.productId);
                const categoryId = product?.categoryId;
                if (categoryId) {
                    categorySum[categoryId] += item.sumWithPdv
                }
            }
        });

        // Update category budgets with calculated percentages
        (categories.map(async (category) => {
            const sum = categorySum[category.categoryId];
            let percentage = 0;
            if (budget.spentBudget !== 0) {
                percentage = (sum / budget.spentBudget) * 100;
            }
            await CategoryBudget.update({ percentage: percentage }, {
                where: { categoryId: category.categoryId, budgetId: budget.budgetId }
            });
        }));

    } catch (error) {
        console.error("Error updating category percentages:", error);
    }
};

// Function to update budget based on dateOfIssue
const updateBudget = async (dateOfIssue: unknown) => {
    try {
        // Fetch all invoices, invoice items, products
        const invoices = await Invoice.findAll() as unknown as InvoiceInstance[];
        const invoiceItems = await InvoiceItem.findAll() as unknown as InvoiceItemInstance[];
        const products = await Product.findAll() as unknown as ProductInstance[];

        // Extract month and year from dateOfIssue
        const month = dayjs(dateOfIssue as Date).format('MMMM');
        const year = dayjs(dateOfIssue as Date).format('YYYY');

        // Find or create a budget for the specified month and year
        let budget = await Budget.findOne({
            where: { month: month, year: year },
            
        });

        if(!budget) createNewBudget(dateOfIssue,0)
        


        // Filter invoices for chosen month and year
        const chosenInvoices = invoices.filter(invoice =>
            dayjs(invoice.dateOfIssue).format('MMMM') === month && dayjs(invoice.dateOfIssue).format('YYYY') === year
        );

        // Calculate total spent from chosen invoices
        let totalSpent = 0;
        for (const invoice of chosenInvoices) {
            totalSpent += invoice.totalValueWithPdv
        }

        // Update spentBudget in the budget record
        await Budget.update({ spentBudget: totalSpent }, {
            where: { month: month, year: year }
        });

        // Fetch the updated budget record
        let budgetInstance = await Budget.findOne({
            where: { month: month, year: year }
        }) as unknown as BudgetInstance;

        // Update category percentages based on the updated budget and invoice items
        await updateCategoryPercentages(budgetInstance, products, invoiceItems, chosenInvoices);

    } catch (error) {
        console.error("Error updating budget:", error);
    }
};

export default updateBudget;
