import { makeAutoObservable } from "mobx";

class TransactionStore {
    transactions = [];
    loading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setLoading(loading) {
        this.loading = loading;
    }

    setTransactions(transactions) {
        this.transactions = transactions;
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    removeTransaction(id) {
        this.transactions = this.transactions.filter(transaction => transaction.id !== id);
    }

    updateTransaction(updatedTransaction) {
        const index = this.transactions.findIndex(transaction => transaction.id === updatedTransaction.id);
        if (index !== -1) {
            this.transactions[index] = updatedTransaction;
        }
    }
}

const transactionStore = new TransactionStore();
export default transactionStore;