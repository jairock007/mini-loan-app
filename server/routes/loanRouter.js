import { Router } from "express";
import {
  createLoan,
  approveLoan,
  getLoans,
  repayLoan,
  updateLoan,
  deleteLoan,
} from "../controllers/loans.js";
import { verifyLogin } from "../controllers/utils.js";

const loanRouter = Router();

loanRouter.get("/", verifyLogin, getLoans);
loanRouter.post("/create", verifyLogin, createLoan);
loanRouter.patch("/approve/:id", verifyLogin, approveLoan);
loanRouter.patch("/update-status/", verifyLogin, updateLoan);
loanRouter.patch("/repay/", verifyLogin, repayLoan);
loanRouter.delete("/delete/:id", verifyLogin, deleteLoan);

export default loanRouter;
