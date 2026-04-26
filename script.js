// --- MOCK DATA FOR TESTING ---
window.DS = {
    studyHours: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    finalScores: [65, 70, 75, 78, 80, 85, 88, 92, 95, 98]
};

// ==========================================
// STUDENT 3 CONTRIBUTION - STATISTICAL ENGINE
// ==========================================

// 1. mean(arr) → arithmetic average
const mean = (arr) => {
    if (arr.length === 0) return 0;
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return sum / arr.length;
};

// 2. median(arr) → middle value of sorted array
const median = (arr) => {
    if (arr.length === 0) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
        return (sorted[mid - 1] + sorted[mid]) / 2;
    }
    return sorted[mid];
};

// 3. mode(arr) → most frequently occurring value
const mode = (arr) => {
    if (arr.length === 0) return 0;
    const counts = {};
    let maxCount = 0;
    let modeValue = arr[0];

    arr.forEach(num => {
        counts[num] = (counts[num] || 0) + 1;
        if (counts[num] > maxCount) {
            maxCount = counts[num];
            modeValue = num;
        }
    });
    return modeValue; 
};

// 4. variance(arr) → population variance
const variance = (arr) => {
    if (arr.length === 0) return 0;
    const m = mean(arr);
    const squaredDiffs = arr.map(val => Math.pow(val - m, 2));
    return mean(squaredDiffs);
};

// 5. stdDev(arr) → square root of variance
const stdDev = (arr) => {
    return Math.sqrt(variance(arr));
};

// 6. pearsonCorr(x,y) → Pearson correlation coefficient r
const pearsonCorr = (x, y) => {
    if (x.length !== y.length || x.length === 0) return 0;
    const meanX = mean(x);
    const meanY = mean(y);
    
    let numerator = 0;
    let denomX = 0;
    let denomY = 0;

    for (let i = 0; i < x.length; i++) {
        const diffX = x[i] - meanX;
        const diffY = y[i] - meanY;
        numerator += (diffX * diffY);
        denomX += (diffX * diffX);
        denomY += (diffY * diffY);
    }

    if (denomX === 0 || denomY === 0) return 0;
    return numerator / Math.sqrt(denomX * denomY);
};

// 7. linearRegression(x,y) → { slope, intercept, rSquared }
const linearRegression = (x, y) => {
    const r = pearsonCorr(x, y);
    const stdX = stdDev(x);
    const stdY = stdDev(y);
    const meanX = mean(x);
    const meanY = mean(y);

    const slope = stdX === 0 ? 0 : r * (stdY / stdX);
    const intercept = meanY - (slope * meanX);
    const rSquared = Math.pow(r, 2);

    return { slope, intercept, rSquared };
};

// Helper formatter
const round2 = (num) => Math.round(num * 100) / 100;

// 8. Call renderStats(window.DS) inside onDataReady()
const renderStats = (dataset) => {
    const scores = dataset.finalScores;
    const hours = dataset.studyHours;

    // Basic calcs
    const m = mean(scores);
    const med = median(scores);
    const mod = mode(scores);
    const v = variance(scores);
    const sd = stdDev(scores);

    // Top Cards
    document.getElementById('val-mean').innerText = round2(m);
    document.getElementById('val-median').innerText = round2(med);
    document.getElementById('val-std').innerText = round2(sd);
    document.getElementById('val-mode').innerText = mod;

    // Descriptive Panel
    document.getElementById('stat-count').innerText = scores.length;
    document.getElementById('stat-min').innerText = Math.min(...scores);
    document.getElementById('stat-max').innerText = Math.max(...scores);
    document.getElementById('stat-range').innerText = Math.max(...scores) - Math.min(...scores);
    document.getElementById('stat-var').innerText = round2(v);
    document.getElementById('stat-std-full').innerText = round2(sd);

    // Regression Panel
    const r = pearsonCorr(hours, scores);
    const reg = linearRegression(hours, scores);
    
    let interpretation = "Weak";
    if (Math.abs(r) > 0.7) interpretation = "Strong";
    else if (Math.abs(r) > 0.3) interpretation = "Moderate";
    if (r > 0) interpretation += " Positive";
    else if (r < 0) interpretation += " Negative";

    document.getElementById('reg-r').innerText = round2(r);
    document.getElementById('reg-interp').innerText = interpretation;
    document.getElementById('reg-m').innerText = round2(reg.slope);
    document.getElementById('reg-b').innerText = round2(reg.intercept);
    document.getElementById('reg-r2').innerText = round2(reg.rSquared);
    
    const sign = reg.intercept >= 0 ? '+' : '-';
    document.getElementById('reg-eq').innerText = `y = ${round2(reg.slope)}x ${sign} ${Math.abs(round2(reg.intercept))}`;
};

const onDataReady = () => {
    renderStats(window.DS);
};

// Execute when DOM loads
window.addEventListener('DOMContentLoaded', onDataReady);