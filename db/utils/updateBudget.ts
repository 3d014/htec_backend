import dayjs from "dayjs";
import { InvoiceItemInstance } from "../../interfaces/Invoice";
import { Budget } from "../../models/Budget";
import { InvoiceItem } from "../../models/InvoiceItem";
import { Product } from "../../models/Product";
import { CategoryBudget } from "../../models/Category-Budget";


const updateBudget = async (invoiceId : string, dateOfIssue: unknown, totalValueWithPdv : number) => {
    try {
        const invoiceItems = await InvoiceItem.findAll({
            where : {invoiceId: invoiceId}
        }) as unknown as InvoiceItemInstance[];

        const month = dayjs(dateOfIssue as Date).format('MMMM');
        const year = dayjs(dateOfIssue as Date).format('YYYY');

        let budget = await Budget.findOne({
            where: { month: month, year: year },
            
        });

        const currentSpentBudget = Number(budget?.dataValues.spentBudget);
        await  budget?.update({
            spentBudget:currentSpentBudget - totalValueWithPdv

        })

        for(const invoiceItem  of invoiceItems){
            const product = await Product.findByPk(invoiceItem.productId);
            const categoryId = product?.dataValues.categoryId;
            const budgetId = budget?.dataValues.budgetId;
            const sumWithPdv = invoiceItem.sumWithPdv;
            
            const categoryBudget = await CategoryBudget.findOne({
                where:{budgetId, categoryId}
            });

            const currentSpentValue = Number(categoryBudget?.dataValues.spentValue);
            await categoryBudget?.update(
                {spentValue : currentSpentValue - sumWithPdv },
                {where:{budgetId, categoryId}}
            );
        }
    } catch (error) {
        console.error("Error updating budget:", error);
    }
};

export default updateBudget;
