// utils/analyzeText.js

function analyzeReport(text) {
    const findings = {
        cholesterol: null,
        bloodPressure: {
            systolic: null,
            diastolic: null
        },
        fastingGlucose: null,
        hemoglobin: null,
        ast: null,
        alt: null,
        gtp: null,
        bmi: null,
        feedback: [] // Array for detailed user feedback
    };

    // Extract BMI
    const bmiRegex = /body mass index,?\s*kg\/m\??\s*(\d+(\.\d+)?)/i;
    const bmiMatch = text.match(bmiRegex);
    if (bmiMatch) {
        const bmiValue = parseFloat(bmiMatch[1]);
        findings.bmi = `Body Mass Index (BMI): ${bmiValue}`;
        if (bmiValue < 18.5) {
            findings.feedback.push('BMI indicates underweight. A balanced diet and consultation with a healthcare provider are recommended.');
        } else if (bmiValue >= 18.5 && bmiValue <= 24.9) {
            findings.feedback.push('BMI is within a healthy range.');
        } else if (bmiValue >= 25 && bmiValue <= 29.9) {
            findings.feedback.push('BMI indicates overweight. Consider a healthy diet and exercise.');
        } else {
            findings.feedback.push('BMI indicates obesity. Seek medical advice for weight management.');
        }
    }

    // Extract systolic and diastolic blood pressure
    const bpRegex = /systolic blood pressure,?\s*mmHg\s*(\d+(\.\d+)?)\s*(\+\/\d+)?\s*diastolic blood pressure,?\s*mmHg\s*(\d+(\.\d+)?)/i;
    const bpMatch = text.match(bpRegex);
    if (bpMatch) {
        const systolic = parseFloat(bpMatch[1]);
        const diastolic = parseFloat(bpMatch[4]);
        findings.bloodPressure.systolic = systolic;
        findings.bloodPressure.diastolic = diastolic;
        findings.feedback.push(`Blood Pressure: ${systolic}/${diastolic} mmHg`);
        if (systolic > 130 || diastolic > 80) {
            findings.feedback.push('Elevated blood pressure detected. This may indicate hypertension.');
        } else {
            findings.feedback.push('Blood pressure is within a healthy range.');
        }
    }

    // Extract fasting glucose
    const glucoseRegex = /fasting blood glucose,?\s*mg\/dL\s*(\d+(\.\d+)?)/i;
    const glucoseMatch = text.match(glucoseRegex);
    if (glucoseMatch) {
        const glucoseValue = parseFloat(glucoseMatch[1]);
        findings.fastingGlucose = `Fasting Blood Glucose: ${glucoseValue} mg/dL`;
        if (glucoseValue >= 126) {
            findings.feedback.push('High fasting blood glucose detected. This could indicate diabetes.');
        } else if (glucoseValue >= 100 && glucoseValue < 126) {
            findings.feedback.push('Elevated fasting glucose detected. Consider a diabetes screening.');
        } else {
            findings.feedback.push('Fasting glucose is within a healthy range.');
        }
    }

    // Extract total cholesterol
    const cholesterolRegex = /total cholesterol,?\s*mg\/dL\s*(\d+(\.\d+)?)/i;
    const cholesterolMatch = text.match(cholesterolRegex);
    if (cholesterolMatch) {
        const cholesterolValue = parseFloat(cholesterolMatch[1]);
        findings.cholesterol = `Total Cholesterol: ${cholesterolValue} mg/dL`;
        if (cholesterolValue > 200) {
            findings.feedback.push('High cholesterol detected. Levels above 200 mg/dL are considered high.');
        } else {
            findings.feedback.push('Cholesterol level is within a normal range.');
        }
    }

    // Extract hemoglobin
    const hemoglobinRegex = /hemoglobin,?\s*g\/dL\s*(\d+(\.\d+)?)/i;
    const hemoglobinMatch = text.match(hemoglobinRegex);
    if (hemoglobinMatch) {
        const hemoglobinValue = parseFloat(hemoglobinMatch[1]);
        findings.hemoglobin = `Hemoglobin: ${hemoglobinValue} g/dL`;
        if (hemoglobinValue < 12) {
            findings.feedback.push('Low hemoglobin levels detected. This may indicate anemia.');
        } else {
            findings.feedback.push('Hemoglobin levels are within the normal range.');
        }
    }

    // Extract AST
    const astRegex = /AST,?\s*UL\s*(\d+(\.\d+)?)/i;
    const astMatch = text.match(astRegex);
    if (astMatch) {
        findings.ast = `AST: ${astMatch[1]} UL`;
        findings.feedback.push(`AST levels detected: ${astMatch[1]} UL.`);
    }

    // Extract ALT
    const altRegex = /ALT,?\s*IUL\s*(\d+(\.\d+)?)/i;
    const altMatch = text.match(altRegex);
    if (altMatch) {
        findings.alt = `ALT: ${altMatch[1]} IUL`;
        findings.feedback.push(`ALT levels detected: ${altMatch[1]} IUL.`);
    }

    // Extract GTP (r-GTP)
    const gtpRegex = /r-GTP,?\s*IU\/L\s*(\d+(\.\d+)?)/i;
    const gtpMatch = text.match(gtpRegex);
    if (gtpMatch) {
        findings.gtp = `r-GTP: ${gtpMatch[1]} IU/L`;
        findings.feedback.push(`r-GTP levels detected: ${gtpMatch[1]} IU/L.`);
    }

    // Default feedback if no specific conditions are found
    if (findings.feedback.length === 0) {
        findings.feedback.push('No specific medical conditions were detected. For a comprehensive analysis, please consult a medical professional.');
    }

    return findings;
}

module.exports = analyzeReport;
