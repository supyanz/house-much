function calculate() {
    // Input variables
    const propertyValue = parseFloat(document.getElementById('propertyValueSlider').value);
    const loanPercentage = parseFloat(document.getElementById('loanPercentage').value) / 100;
    const interestRate = parseFloat(document.getElementById('interestRate').value) / 100;
    const loanTenure = parseInt(document.getElementById('loanTenure').value);
    const personAIncome = parseFloat(document.getElementById('personAIncome').value);
    const personBIncome = parseFloat(document.getElementById('personBIncome').value);
    const personAOABalance = parseFloat(document.getElementById('personAOABalance').value);
    const personBOABalance = parseFloat(document.getElementById('personBOABalance').value);

    // Constants (needed for calculations)
    const ceiling = 6800;
    const eeContributionRate = 0.17;
    const oaContributionRate = 0.23;
    const oaBalanceFloor = 20000;

    // Interim calculations
    const personAUsableOA = Math.max(0, personAOABalance - oaBalanceFloor);
    const personBUsableOA = Math.max(0, personBOABalance - oaBalanceFloor);
    // These are calculated based on employee and employer contribution (together at 23%)
    const personAMonthlyCPFContribution = Math.min(ceiling, personAIncome) * oaContributionRate;
    const personBMonthlyCPFContribution = Math.min(ceiling, personBIncome) * oaContributionRate;
    // These are calculated as Income less employee contribution (of 17%), taking into account contribution cap.
    const personATakeHomePay = (personAIncome <= ceiling) ? 
        personAIncome - (eeContributionRate * personAIncome) : 
        personAIncome - (eeContributionRate * ceiling);
    const personBTakeHomePay = (personBIncome <= ceiling) ? 
        personBIncome - (eeContributionRate * personBIncome) : 
        personBIncome - (eeContributionRate * ceiling);
    const loanAmount = propertyValue * loanPercentage;

    // Output calculations
    const monthlyRepayment = calculateMonthlyRepayment(interestRate, loanAmount, loanTenure);
    const downpayment = propertyValue - loanAmount;
    const cpfForDownpayment = Math.min(personAUsableOA + personBUsableOA, downpayment);
    const cashForDownpayment = downpayment - cpfForDownpayment;
    const totalMonthlyCPFContribution = personAMonthlyCPFContribution + personBMonthlyCPFContribution;
    const cashTopUpNeeded = (totalMonthlyCPFContribution < monthlyRepayment) ? (monthlyRepayment - totalMonthlyCPFContribution) : 0;
    const remainingCashFlow = personATakeHomePay + personBTakeHomePay - cashTopUpNeeded;

    // Output
    //The toLocaleString is what I used to display the numbers with commas for thousands.
    document.getElementById('monthlyRepayment').innerText = "$" + monthlyRepayment.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('downpayment').innerText = "$" + downpayment.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('cpfForDownpayment').innerText = "$" + cpfForDownpayment.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('cashForDownpayment').innerText = "$" + cashForDownpayment.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('cashTopUp').innerText = (cashTopUpNeeded > 0) ? `Needs cash top up of $${cashTopUpNeeded.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} monthly` : 'Monthly payment is fully covered by CPF contribution';
    document.getElementById('totalMonthlyCPFContribution').innerText = "$" + totalMonthlyCPFContribution.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById('remainingCashFlow').innerText = "$" + remainingCashFlow.toLocaleString('en', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function calculateMonthlyRepayment(interestRate, loanAmount, loanTenure) {
    const monthlyInterestRate = interestRate / 12;
    const totalPayments = loanTenure * 12;
    const monthlyRepayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -totalPayments));
    return monthlyRepayment;
}

// data validation for input fields
var prevLoanPercentage;
document.getElementById("loanPercentage").addEventListener("input", function(event) {
    var input = event.target;
    var value = parseFloat(input.value);
    input.value = validatePercentage(input.value)
    if (value > 100) {
        input.value = prevLoanPercentage; // Limit the value to 100
        errorAbove100.style.display = "flex";
    } 
    else {
        errorAbove100.style.display = "none";
    }
    prevLoanPercentage = input.value;
});

function validatePercentage(input) {
    if (input < 0) {
        return 0
    } else if (input > 100) {
        return 100
    } else return input
}