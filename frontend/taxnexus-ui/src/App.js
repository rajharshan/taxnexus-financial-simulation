import React, { useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import jsPDF from "jspdf";

import {
Chart as ChartJS,
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Title,
Tooltip,
Legend
} from "chart.js";

ChartJS.register(
CategoryScale,
LinearScale,
BarElement,
ArcElement,
Title,
Tooltip,
Legend
);

function App() {

const [income,setIncome] = useState("");
const [taxRate,setTaxRate] = useState("");

const [rent,setRent] = useState("");
const [housing,setHousing] = useState("");
const [transport,setTransport] = useState("");

const [alcohol,setAlcohol] = useState("");
const [food,setFood] = useState("");
const [entertainment,setEntertainment] = useState("");
const [cigarettes,setCigarettes] = useState("");

const [location,setLocation] = useState("");
const [familySize,setFamilySize] = useState("");
const [taxType,setTaxType] = useState("");

const [results,setResults] = useState(null);
const [charts,setCharts] = useState(null);

const runSimulation = () => {

const inc = Number(income);
const tax = Number(taxRate);

const fixed =
Number(rent)+Number(housing)+Number(transport);

const variable =
Number(alcohol)+Number(food)+Number(entertainment)+Number(cigarettes);

const totalExpenses = fixed + variable;

const beforeTax = inc * (tax/100);
const taxAfter2 = inc * ((tax+2)/100);
const taxAfter5 = inc * ((tax+5)/100);

const disposableBefore = inc - beforeTax;
const disposable2 = inc - taxAfter2;
const disposable5 = inc - taxAfter5;

const savingsBefore = disposableBefore - totalExpenses;
const savingsAfter = disposable2 - totalExpenses;

const savingsReduction =
((savingsBefore - savingsAfter) / savingsBefore) * 100;

const stressIndex = totalExpenses / disposableBefore;

let stressLevel="Low";
if(stressIndex>0.8) stressLevel="High";
else if(stressIndex>0.5) stressLevel="Moderate";

const savingsRatio = savingsBefore / inc;
const expenseRatio = totalExpenses / inc;
const taxImpact = taxAfter2 / inc;

const stabilityScore =
((savingsRatio*40)+( (1-expenseRatio)*30 )+((1-taxImpact)*30))*100;

let risk="Stable";
if(stabilityScore<50) risk="High Risk";
else if(stabilityScore<80) risk="Moderate";

let recommendations=[];

if(alcohol>0) recommendations.push("Reduce alcohol spending");
if(cigarettes>0) recommendations.push("Reduce cigarette spending");
if(entertainment>5000) recommendations.push("Limit entertainment expenses");
if(savingsBefore<0) recommendations.push("Increase savings and reduce expenses");

setResults({

beforeTax,
taxAfter2,
taxAfter5,
taxDifference: taxAfter2-beforeTax,

disposableBefore,
savingsBefore,
savingsAfter,

stressIndex:stressIndex.toFixed(2),
stressLevel,

stabilityScore:stabilityScore.toFixed(0),
risk,

savingsReduction:savingsReduction.toFixed(1),

recommendations

});

setCharts({

expenseChart:{
labels:["Rent","Housing","Transport","Alcohol","Food","Entertainment","Cigarettes"],
datasets:[
{
data:[rent,housing,transport,alcohol,food,entertainment,cigarettes],
backgroundColor:[
"#FF6384","#36A2EB","#FFCE56",
"#8E44AD","#2ECC71","#F39C12","#C0392B"
]
}
]
},

taxChart:{
labels:["Before Tax","+2% Tax","+5% Tax"],
datasets:[
{
label:"Tax Impact",
data:[beforeTax,taxAfter2,taxAfter5],
backgroundColor:["green","orange","red"]
}
]
},

savingsChart:{
labels:["Savings Before","Savings After Tax"],
datasets:[
{
label:"Savings Comparison",
data:[savingsBefore,savingsAfter],
backgroundColor:["#4CAF50","#F44336"]
}
]
}

});

};

const downloadReport = () => {

const doc = new jsPDF();

doc.text("TaxNexus Financial Report",20,20);

doc.text(`Income: ₹${income}`,20,40);
doc.text(`Location: ${location}`,20,50);
doc.text(`Family Size: ${familySize}`,20,60);
doc.text(`Tax Type: ${taxType}`,20,70);

doc.text("Tax Impact Report",20,90);

doc.text(`Before Tax: ₹${results.beforeTax}`,20,100);
doc.text(`Tax After Increase: ₹${results.taxAfter2}`,20,110);
doc.text(`Tax Difference: ₹${results.taxDifference}`,20,120);

doc.text("Disposable Income",20,140);
doc.text(`Disposable Income: ₹${results.disposableBefore}`,20,150);

doc.text("Savings",20,170);
doc.text(`Savings Before: ₹${results.savingsBefore}`,20,180);
doc.text(`Savings After Tax: ₹${results.savingsAfter}`,20,190);

doc.text("Financial Indicators",20,210);
doc.text(`Budget Stress Index: ${results.stressIndex}`,20,220);
doc.text(`Financial Stability Score: ${results.stabilityScore}`,20,230);
doc.text(`Risk Level: ${results.risk}`,20,240);

doc.save("TaxNexus_Report.pdf");

};

return (

<div style={{textAlign:"center",fontFamily:"Arial"}}>

<h1>TaxNexus Financial Simulation System</h1>

<input placeholder="Monthly Income"
onChange={e=>setIncome(e.target.value)}/><br/><br/>

<input placeholder="Current Tax Rate (%)"
onChange={e=>setTaxRate(e.target.value)}/><br/><br/>

<h3>Fixed Expenses</h3>

<input placeholder="Rent"
onChange={e=>setRent(e.target.value)}/><br/><br/>

<input placeholder="Housing"
onChange={e=>setHousing(e.target.value)}/><br/><br/>

<input placeholder="Transport"
onChange={e=>setTransport(e.target.value)}/><br/><br/>

<h3>Variable Expenses</h3>

<input placeholder="Alcohol"
onChange={e=>setAlcohol(e.target.value)}/><br/><br/>

<input placeholder="Food"
onChange={e=>setFood(e.target.value)}/><br/><br/>

<input placeholder="Entertainment"
onChange={e=>setEntertainment(e.target.value)}/><br/><br/>

<input placeholder="Cigarettes"
onChange={e=>setCigarettes(e.target.value)}/><br/><br/>

<input placeholder="Location"
onChange={e=>setLocation(e.target.value)}/><br/><br/>

<input placeholder="Family Size"
onChange={e=>setFamilySize(e.target.value)}/><br/><br/>

<input placeholder="Tax Type"
onChange={e=>setTaxType(e.target.value)}/><br/><br/>

<button onClick={runSimulation}>Run Simulation</button>

<br/><br/>

{results && (

<div>

<h2>Tax Impact Report</h2>

<p>Before Tax: ₹{results.beforeTax}</p>
<p>After +2% Tax: ₹{results.taxAfter2}</p>
<p>Tax Difference: ₹{results.taxDifference}</p>

<h2>Disposable Income</h2>

<p>₹{results.disposableBefore}</p>

<h2>Savings</h2>

<p>Before Tax: ₹{results.savingsBefore}</p>
<p>After Tax: ₹{results.savingsAfter}</p>

<h2>Financial Indicators</h2>

<p>Budget Stress Index: {results.stressIndex}</p>
<p>Financial Stability Score: {results.stabilityScore}</p>
<p>Risk Level: {results.risk}</p>

<h3>Recommendations</h3>

<ul>
{results.recommendations.map((r,i)=>
<li key={i}>{r}</li>
)}
</ul>

</div>

)}

{charts && (

<div style={{width:"600px",margin:"auto"}}>

<h2>Expense Distribution</h2>
<Pie data={charts.expenseChart}/>

<h2>Tax Impact</h2>
<Bar data={charts.taxChart}/>

<h2>Savings Comparison</h2>
<Bar data={charts.savingsChart}/>

<br/>

<button
onClick={downloadReport}
style={{
padding:"15px 40px",
fontSize:"18px",
backgroundColor:"#007BFF",
color:"white",
border:"none",
borderRadius:"8px"
}}
>
Download Financial Report
</button>

</div>

)}

</div>

);

}

export default App;