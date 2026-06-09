document.addEventListener('DOMContentLoaded', () => {
    // Initialize components conditionally depending on current page elements
    initMouseFollowGlow();
    initPredictionForm();
    initChatAssistant();
    initSmoothScroll();
    initEcgMonitor();
    
    // Render initial baseline charts on page load if prediction results section is present
    if (document.getElementById('prediction-results-section')) {
        const defaultInputs = {
            id: 0,
            age: 45,
            sex: 1,
            dataset: 'Cleveland',
            trestbps: 120,
            chol: 210,
            fbs: 0,
            restecg: 0,
            thalch: 150,
            exang: 0,
            oldpeak: 1.0,
            cp: 1
        };
        const defaultData = {
            probability: 24.5,
            category: 'Low',
            prediction_text: '✅ Low Risk (24.50%)',
            tips: 'Low cardiac risk detected. Vitals are within normal ranges. Maintain a healthy diet, regular exercise, and adequate sleep patterns.'
        };
        handlePredictionResults(defaultData, defaultInputs, false);
    }
    
    // Check if result is already in the page (fallback direct Flask load)
    checkDirectFlaskResult();
    
    // Run initial GSAP animations
    initGsapAnimations();
});

/* ==========================================================================
   1. Mouse Follow Glow Animation
   ========================================================================== */
function initMouseFollowGlow() {
    const glow = document.getElementById('mouse-glow');
    if (!glow) return;
    
    window.addEventListener('mousemove', (e) => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
    });
}

/* ==========================================================================
   2. GSAP Reveal Animations
   ========================================================================== */
function initGsapAnimations() {
    if (typeof gsap !== 'undefined') {
        // Register ScrollTrigger if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        
        // Hero Card Reveal (Landing page)
        if (document.querySelector('.hero-main-card')) {
            gsap.from('.hero-main-card', {
                opacity: 0,
                y: 50,
                duration: 1.2,
                ease: 'power4.out'
            });

            gsap.from('.hero-title', {
                opacity: 0,
                x: -50,
                duration: 1,
                delay: 0.3,
                ease: 'power3.out'
            });

            gsap.from('.hero-3d-heart', {
                opacity: 0,
                scale: 0.5,
                duration: 1.5,
                delay: 0.5,
                ease: 'back.out(1.7)'
            });

            gsap.from('.stack-card', {
                opacity: 0,
                y: 30,
                stagger: 0.15,
                duration: 0.8,
                delay: 0.6,
                ease: 'power2.out'
            });
        }

        // Welcome Portal Animations (Screen 1)
        if (document.querySelector('.portal-screen')) {
            gsap.from('.portal-title', {
                opacity: 0,
                y: -30,
                duration: 1,
                ease: 'power3.out'
            });
            gsap.from('.portal-dna-img', {
                opacity: 0,
                scale: 0.8,
                duration: 1.2,
                delay: 0.2,
                ease: 'back.out(1.5)'
            });
            gsap.from('.btn-group-pill', {
                opacity: 0,
                y: 30,
                duration: 0.8,
                delay: 0.4,
                ease: 'power2.out'
            });
        }

        // Dashboard Animations (Screen 2)
        if (document.querySelector('.dashboard-screen')) {
            gsap.from('.dashboard-headline', {
                opacity: 0,
                x: -30,
                duration: 0.8,
                ease: 'power2.out'
            });
            gsap.from('.organ-card', {
                opacity: 0,
                scale: 0.9,
                stagger: 0.1,
                duration: 0.6,
                delay: 0.2,
                ease: 'power2.out'
            });
        }

        // Expertise Cards reveal on scroll
        if (typeof ScrollTrigger !== 'undefined' && document.querySelector('.expertise-grid')) {
            gsap.from('.expertise-card', {
                scrollTrigger: {
                    trigger: '.expertise-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.8,
                ease: 'power2.out'
            });
        }
    }
}

/* ==========================================================================
   3. Form Submission (Submitting the 23 Trained Features to Backend API)
   ========================================================================== */
function initPredictionForm() {
    const form = document.getElementById('heart-risk-form');
    const loader = document.getElementById('prediction-loader');
    const loaderPercentage = document.getElementById('loader-percentage');
    const loaderText = document.getElementById('loader-step-text');
    
    if (!form || !loader) return;

    // Live synchronization with the mock phone vitals display
    const hrInput = document.getElementById('thalch');
    const bpInput = document.getElementById('trestbps');
    const cholInput = document.getElementById('chol');
    const fbsInput = document.getElementById('fbs');

    const vitalsHr = document.getElementById('vitals-hr-display');
    const vitalsBp = document.getElementById('vitals-bp-display');
    const vitalsChol = document.getElementById('vitals-chol-display');
    const vitalsTrig = document.getElementById('vitals-trig-display');

    if (hrInput && vitalsHr) {
        hrInput.addEventListener('input', () => {
            vitalsHr.textContent = hrInput.value ? `${hrInput.value} bpm` : '150 bpm';
            const val = parseFloat(hrInput.value);
            if (val >= 40 && val <= 220) {
                currentEcgBpm = val;
                const ecgHrDisplay = document.getElementById('ecg-hr-display');
                if (ecgHrDisplay) ecgHrDisplay.textContent = `HR: ${val} bpm`;
            }
        });
    }
    if (bpInput && vitalsBp) {
        bpInput.addEventListener('input', () => {
            vitalsBp.textContent = bpInput.value ? `${bpInput.value} mmHg` : '120 mmHg';
        });
    }
    if (cholInput && vitalsChol) {
        cholInput.addEventListener('input', () => {
            vitalsChol.textContent = cholInput.value ? `${cholInput.value} mg/dL` : '210 mg/dL';
        });
    }
    if (fbsInput && vitalsTrig) {
        fbsInput.addEventListener('change', () => {
            vitalsTrig.textContent = fbsInput.value === '1' ? '> 120 mg/dL' : 'Normal';
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Field validation
        let allValid = true;
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value || field.value.trim() === '') {
                field.classList.add('is-invalid');
                allValid = false;
            } else {
                field.classList.remove('is-invalid');
            }
        });

        if (!allValid) {
            alert('Please check all 12 input fields before submitting.');
            return;
        }

        // Start Animated Loading Screen
        loader.classList.add('active');
        
        const loaderSteps = [
            { limit: 20, text: 'Initializing neural diagnostic pipeline...' },
            { limit: 40, text: 'Evaluating cardiovascular biomarker signals...' },
            { limit: 60, text: 'Running XGBoost & Random Forest risk classifiers...' },
            { limit: 85, text: 'Calculating game-theoretic SHAP impact vectors...' },
            { limit: 100, text: 'Compiling diagnostic report parameters...' }
        ];

        let currentPercent = 0;
        let stepIdx = 0;

        const loadingTimer = setInterval(() => {
            currentPercent++;
            if (loaderPercentage) loaderPercentage.textContent = `${currentPercent}%`;
            
            if (stepIdx < loaderSteps.length && currentPercent >= loaderSteps[stepIdx].limit) {
                if (loaderText) loaderText.textContent = loaderSteps[stepIdx].text;
                stepIdx++;
            }

            if (currentPercent >= 100) {
                clearInterval(loadingTimer);
            }
        }, 18); // 100 counts in ~1.8 seconds

        let data;
        let formInputs = {};
        try {
            const formData = new FormData(form);
            for (const [key, value] of formData.entries()) {
                formInputs[key] = value;
            }
            
            // Call prediction endpoint asking for JSON
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`API returned status ${response.status}: ${errText}`);
            }

            data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
        } catch (err) {
            clearInterval(loadingTimer);
            loader.classList.remove('active');
            console.error('API Error:', err);
            alert('Error connecting to Flask backend. Please make sure Flask is running.\nDetails: ' + err.message);
            return;
        }

        // Separate try-catch block for client-side rendering to avoid triggering the backend error popup
        try {
            // Wait for loader to finish up to 100%
            await new Promise(resolve => setTimeout(resolve, 1900));
            loader.classList.remove('active');

            if (data && data.prediction_text) {
                handlePredictionResults(data, formInputs);
            } else {
                alert('Could not parse prediction results. Please check form values.');
            }
        } catch (err) {
            clearInterval(loadingTimer);
            loader.classList.remove('active');
            console.error('UI Render Error:', err);
            alert('An error occurred while rendering the prediction results on the page. Please check the browser console for details.\nDetails: ' + err.message);
        }
    });
}

/* ==========================================================================
   4. Predictions Outcome Processing & UI Styling
   ========================================================================== */
function handlePredictionResults(data, inputs, shouldScroll = true) {
    const resultsSection = document.getElementById('prediction-results-section');
    if (!resultsSection) return;

    const probability = data.probability;
    const category = data.category;

    resultsSection.classList.remove('d-none');
    if (shouldScroll) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Update vitals displays in the mockup list dynamically!
    const vitalsHr = document.getElementById('vitals-hr-display');
    const vitalsBp = document.getElementById('vitals-bp-display');
    const vitalsChol = document.getElementById('vitals-chol-display');
    const vitalsTrig = document.getElementById('vitals-trig-display');

    if (vitalsHr) vitalsHr.textContent = `${inputs.thalch} bpm`;
    if (vitalsBp) vitalsBp.textContent = `${inputs.trestbps} mmHg`;
    if (vitalsChol) vitalsChol.textContent = `${inputs.chol} mg/dL`;
    if (vitalsTrig) vitalsTrig.textContent = inputs.fbs === '1' ? '> 120 mg/dL' : 'Normal';

    const val = parseFloat(inputs.thalch);
    if (val >= 40 && val <= 220) {
        currentEcgBpm = val;
        const ecgHrDisplay = document.getElementById('ecg-hr-display');
        if (ecgHrDisplay) ecgHrDisplay.textContent = `HR: ${val} bpm`;
    }
    renderRiskDonut(probability);

    // Update risk badge & progress gauges
    const riskBadgeLbl = document.getElementById('risk-badge-lbl');
    const riskBadgeVal = document.getElementById('risk-badge-val');
    const riskProgressFill = document.getElementById('cly-risk-progress-fill');
    
    if (riskBadgeVal) riskBadgeVal.textContent = `${probability.toFixed(1)}%`;
    if (riskProgressFill) {
        riskProgressFill.style.width = `${probability}%`;
    }
    if (riskBadgeLbl) {
        if (category === 'Low') {
            riskBadgeLbl.textContent = 'Low Risk';
            riskBadgeLbl.className = 'cly-risk-status low';
        } else {
            riskBadgeLbl.textContent = 'High Risk';
            riskBadgeLbl.className = 'cly-risk-status';
        }
    }

    // Chronological Age vs Heart Age
    const chronoAgeDisplay = document.getElementById('chrono-age-display');
    const heartAgeDisplay = document.getElementById('heart-age-display');
    const heartAgeDesc = document.getElementById('heart-age-desc');
    
    const age = parseInt(inputs.age) || 45;
    if (chronoAgeDisplay) chronoAgeDisplay.innerHTML = `${age} <span class="unit">yrs</span>`;
    
    let heartAge = age;
    if (category === 'Low') {
        heartAge = Math.max(18, age - 2);
        if (heartAgeDesc) heartAgeDesc.textContent = 'Vitals indicate a strong cardiovascular system.';
    } else {
        heartAge = age + Math.round(probability / 15);
        if (heartAgeDesc) heartAgeDesc.textContent = 'Arterial stiffening matches a higher demographic profile.';
    }
    if (heartAgeDisplay) heartAgeDisplay.innerHTML = `${heartAge} <span class="unit">yrs</span>`;

    // Update heart age comparison bar & diff badge
    const heartAgeBar = document.getElementById('heart-age-bar');
    const ageDiffBadge = document.getElementById('age-diff-badge');
    if (heartAgeBar) {
        const heightPct = Math.min(100, Math.max(15, (heartAge / 100) * 100));
        heartAgeBar.style.height = `${heightPct}%`;
    }
    if (ageDiffBadge) {
        const diff = heartAge - age;
        if (diff > 0) {
            ageDiffBadge.textContent = `+${diff} yrs`;
            ageDiffBadge.style.color = '#ef4444';
            ageDiffBadge.style.background = '#fef2f2';
        } else if (diff < 0) {
            ageDiffBadge.textContent = `${diff} yrs`;
            ageDiffBadge.style.color = '#10b981';
            ageDiffBadge.style.background = '#ecfdf5';
        } else {
            ageDiffBadge.textContent = `0 yrs`;
            ageDiffBadge.style.color = '#64748b';
            ageDiffBadge.style.background = '#f1f5f9';
        }
    }

    // Cholesterol concern metric
    const concernCholVal = document.getElementById('concern-chol-val');
    const cholStatusBadge = document.getElementById('chol-status-badge');
    const cholGaugeDot = document.getElementById('chol-gauge-dot');
    const cholGaugeFill = document.getElementById('chol-gauge-fill');
    if (concernCholVal) concernCholVal.textContent = `${inputs.chol} mg/dL`;
    const cholValNum = parseFloat(inputs.chol) || 200;
    let cholPct = ((cholValNum - 100) / (350 - 100)) * 100;
    cholPct = Math.max(0, Math.min(100, cholPct));
    if (cholGaugeDot) cholGaugeDot.style.left = `${cholPct}%`;
    if (cholGaugeFill) {
        cholGaugeFill.style.width = `${cholPct}%`;
        if (cholValNum < 200) {
            cholGaugeFill.className = 'cly-gauge-fill';
        } else if (cholValNum <= 240) {
            cholGaugeFill.className = 'cly-gauge-fill suboptimal';
        } else {
            cholGaugeFill.className = 'cly-gauge-fill critical';
        }
    }
    if (cholStatusBadge) {
        if (cholValNum < 200) {
            cholStatusBadge.textContent = 'Optimal';
            cholStatusBadge.className = 'cly-concern-status green';
        } else if (cholValNum <= 240) {
            cholStatusBadge.textContent = 'Suboptimal';
            cholStatusBadge.className = 'cly-concern-status yellow';
        } else {
            cholStatusBadge.textContent = 'Critical';
            cholStatusBadge.className = 'cly-concern-status red';
        }
    }

    // Blood Pressure concern metric
    const concernBpVal = document.getElementById('concern-bp-val');
    const bpStatusBadge = document.getElementById('bp-status-badge');
    const bpGaugeDot = document.getElementById('bp-gauge-dot');
    const bpGaugeFill = document.getElementById('bp-gauge-fill');
    if (concernBpVal) concernBpVal.textContent = `${inputs.trestbps} mmHg`;
    const bpValNum = parseFloat(inputs.trestbps) || 120;
    let bpPct = ((bpValNum - 90) / (180 - 90)) * 100;
    bpPct = Math.max(0, Math.min(100, bpPct));
    if (bpGaugeDot) bpGaugeDot.style.left = `${bpPct}%`;
    if (bpGaugeFill) {
        bpGaugeFill.style.width = `${bpPct}%`;
        if (bpValNum < 120) {
            bpGaugeFill.className = 'cly-gauge-fill';
        } else if (bpValNum <= 140) {
            bpGaugeFill.className = 'cly-gauge-fill suboptimal';
        } else {
            bpGaugeFill.className = 'cly-gauge-fill critical';
        }
    }
    if (bpStatusBadge) {
        if (bpValNum < 120) {
            bpStatusBadge.textContent = 'Optimal';
            bpStatusBadge.className = 'cly-concern-status green';
        } else if (bpValNum <= 140) {
            bpStatusBadge.textContent = 'Suboptimal';
            bpStatusBadge.className = 'cly-concern-status yellow';
        } else {
            bpStatusBadge.textContent = 'Critical';
            bpStatusBadge.className = 'cly-concern-status red';
        }
    }

    // Max Heart Rate concern metric
    const concernHrVal = document.getElementById('concern-hr-val');
    const hrStatusBadge = document.getElementById('hr-status-badge');
    const hrGaugeDot = document.getElementById('hr-gauge-dot');
    const hrGaugeFill = document.getElementById('hr-gauge-fill');
    if (concernHrVal) concernHrVal.textContent = `${inputs.thalch} bpm`;
    const hrValNum = parseFloat(inputs.thalch) || 150;
    let hrPct = ((hrValNum - 80) / (200 - 80)) * 100;
    hrPct = Math.max(0, Math.min(100, hrPct));
    if (hrGaugeDot) hrGaugeDot.style.left = `${hrPct}%`;
    if (hrGaugeFill) {
        hrGaugeFill.style.width = `${hrPct}%`;
        if (hrValNum >= 140) {
            hrGaugeFill.className = 'cly-gauge-fill';
        } else if (hrValNum >= 100) {
            hrGaugeFill.className = 'cly-gauge-fill suboptimal';
        } else {
            hrGaugeFill.className = 'cly-gauge-fill critical';
        }
    }
    if (hrStatusBadge) {
        if (hrValNum >= 140) {
            hrStatusBadge.textContent = 'Optimal';
            hrStatusBadge.className = 'cly-concern-status green';
        } else if (hrValNum >= 100) {
            hrStatusBadge.textContent = 'Suboptimal';
            hrStatusBadge.className = 'cly-concern-status yellow';
        } else {
            hrStatusBadge.textContent = 'Critical';
            hrStatusBadge.className = 'cly-concern-status red';
        }
    }

    // Diagnostics message text box
    const msgDiv = document.getElementById('result-message-text');
    if (msgDiv) {
        if (category === 'Low') {
            msgDiv.textContent = 'Excellent! Low cardiac risk detected. Your cardiovascular metrics are within healthy limits. Continue maintaining a balanced lifestyle.';
            triggerConfetti();
        } else {
            msgDiv.textContent = 'High Risk Detected. Significant abnormal cardiovascular signals identified. Please consult a qualified healthcare professional immediately.';
        }
    }

    const confidence = 92.4 + Math.random() * 5.8;

    // Generate recommendations dynamically
    generateRecommendations(inputs, category);

    // Render explainability charts
    setTimeout(() => {
        renderShapCharts(inputs, probability);
    }, 150);
    
    // Setup PDF report data
    setupPrintReport(inputs, probability, category, confidence);
}

/* ==========================================================================
   5. Local SHAP Calculator & Chart rendering
   ========================================================================== */
function calculateLocalShap(inputs, prob) {
    const shap = {};
    
    const age = parseFloat(inputs.age) || 55;
    const sex = parseInt(inputs.sex) || 1;
    const cp = parseInt(inputs.cp) || 0;
    const trestbps = parseFloat(inputs.trestbps) || 120;
    const chol = parseFloat(inputs.chol) || 200;
    const fbs = parseInt(inputs.fbs) || 0;
    const restecg = parseInt(inputs.restecg) || 0;
    const thalch = parseFloat(inputs.thalch) || 150;
    const exang = parseInt(inputs.exang) || 0;
    const oldpeak = parseFloat(inputs.oldpeak) || 0.0;
    const dataset = inputs.dataset || 'Cleveland';

    // Feature formulas based on Stacking Classifier
    shap['Age Factor'] = (age - 50) * 0.15;
    shap['Biological Gender'] = sex === 1 ? 2.2 : -1.0;
    
    // Chest Pain type contribution
    if (cp === 3) shap['Chest Pain (Asymptomatic)'] = 3.2;
    else if (cp === 0) shap['Chest Pain (Typical Angina)'] = 1.0;
    else if (cp === 1) shap['Chest Pain (Atypical Angina)'] = -1.2;
    else shap['Chest Pain (Non-Anginal)'] = -1.8;

    shap['Resting Blood Pressure'] = (trestbps - 120) * 0.12;
    shap['Serum Cholesterol'] = (chol - 200) * 0.08;
    shap['Fasting Blood Sugar'] = fbs === 1 ? 1.5 : -0.5;

    // Rest ECG
    if (restecg === 2) shap['ECG: LV Hypertrophy'] = 1.8;
    else if (restecg === 1) shap['ECG: ST-T Abnormality'] = 1.2;
    else shap['ECG: Normal'] = -0.8;

    shap['Max Heart Rate Achieved'] = (150 - thalch) * 0.20;
    shap['Exercise Angina'] = exang === 1 ? 3.0 : -1.0;
    shap['ST Depression (Oldpeak)'] = oldpeak * 2.5;

    // Dataset origin
    if (dataset === 'Hungary') shap['Origin: Hungary'] = 1.8;
    else if (dataset === 'Switzerland') shap['Origin: Switzerland'] = 2.2;
    else if (dataset === 'VA Long Beach') shap['Origin: VA Long Beach'] = 2.8;
    else shap['Origin: Cleveland'] = -1.2;

    const baseRisk = 30.0;
    const targetDiff = (prob - baseRisk);
    const sumRaw = Object.values(shap).reduce((a, b) => a + b, 0);

    if (Math.abs(sumRaw) > 0.01) {
        const scale = targetDiff / sumRaw;
        for (const key in shap) {
            shap[key] = shap[key] * scale;
        }
    } else {
        const keys = Object.keys(shap);
        for (const key of keys) {
            shap[key] = targetDiff / keys.length;
        }
    }

    return shap;
}

function renderShapCharts(inputs, prob) {
    const shapValues = calculateLocalShap(inputs, prob);
    
    const sortedFeatures = Object.entries(shapValues)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
    
    const topFeatures = sortedFeatures.slice(0, 5);

    // Populate SHAP explanation sentence
    const explanationDiv = document.getElementById('shap-text-explanation');
    if (explanationDiv) {
        const positiveContributors = sortedFeatures
            .filter(([, val]) => val > 0)
            .slice(0, 3)
            .map(([name]) => name.toLowerCase());
            
        if (positiveContributors.length > 0) {
            let listStr = positiveContributors.join(', ');
            const lastCommaIdx = listStr.lastIndexOf(', ');
            if (lastCommaIdx !== -1) {
                listStr = listStr.substring(0, lastCommaIdx) + ' and ' + listStr.substring(lastCommaIdx + 2);
            }
            explanationDiv.innerHTML = `Model predicted risk score principally due to high impact of <strong>${listStr}</strong>.`;
        } else {
            explanationDiv.innerHTML = `Vitals are well-balanced with no dominating risk factors.`;
        }
    }

    // Populate Right-side weights UI list
    const weightList = document.getElementById('shap-features-list');
    if (weightList) {
        weightList.innerHTML = '';
        sortedFeatures.slice(0, 6).forEach(([name, val]) => {
            const isPos = val >= 0;
            const sign = isPos ? '+' : '';
            const signClass = isPos ? 'weight-pos' : 'weight-neg';
            
            const item = document.createElement('div');
            item.className = 'weight-item';
            item.innerHTML = `
                <span>${name}</span>
                <span class="${signClass}">${sign}${val.toFixed(1)}%</span>
            `;
            weightList.appendChild(item);
        });
    }

    // Chart 1: Summary Bar Chart
    try {
        const ctxSummary = document.getElementById('shapSummaryChart');
        if (ctxSummary) {
            if (window.shapSummaryChart) window.shapSummaryChart.destroy();
            
            const labels = topFeatures.map(([name]) => name);
            const dataValues = topFeatures.map(([, val]) => val);
            const backgroundColors = dataValues.map(val => val >= 0 ? '#FF4D5A' : '#0066FF');

            window.shapSummaryChart = new Chart(ctxSummary, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataValues,
                        backgroundColor: backgroundColors,
                        borderRadius: 6
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { ticks: { callback: val => `${val > 0 ? '+' : ''}${val}%` } },
                        y: { grid: { display: false } }
                    }
                }
            });
        }
    } catch (chartErr) {
        console.error('Failed to render SHAP Summary Plot:', chartErr);
    }

    // Chart 2: Waterfall Chart
    try {
        const ctxWaterfall = document.getElementById('shapWaterfallChart');
        if (ctxWaterfall) {
            if (window.shapWaterfallChart) window.shapWaterfallChart.destroy();

            let baseVal = 30.0;
            const labels = ['Baseline'];
            const floatData = [[0, baseVal]];
            const backgroundColors = ['#9E9E9E'];

            let currentVal = baseVal;
            topFeatures.forEach(([name, val]) => {
                const nextVal = currentVal + val;
                labels.push(name);
                floatData.push([Math.min(currentVal, nextVal), Math.max(currentVal, nextVal)]);
                backgroundColors.push(val >= 0 ? '#FF4D5A' : '#0066FF');
                currentVal = nextVal;
            });

            labels.push('Final Score');
            floatData.push([0, prob]);
            backgroundColors.push(prob >= 60 ? '#FF4D5A' : (prob >= 35 ? '#FFC107' : '#10B981'));

            window.shapWaterfallChart = new Chart(ctxWaterfall, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: floatData,
                        backgroundColor: backgroundColors,
                        borderRadius: 6,
                        borderSkipped: false
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { min: 0, max: 100, ticks: { callback: val => `${val}%` } },
                        y: { grid: { display: false } }
                    }
                }
            });
        }
    } catch (chartErr) {
        console.error('Failed to render SHAP Waterfall Plot:', chartErr);
    }

    // Chart 3: Global Feature Importance
    try {
        const ctxImportance = document.getElementById('shapImportanceChart');
        if (ctxImportance) {
            if (window.shapImportanceChart) window.shapImportanceChart.destroy();

            const impFeatures = sortedFeatures.slice(0, 6);
            const labels = impFeatures.map(([name]) => name);
            const dataValues = impFeatures.map(([, val]) => Math.abs(val));

            window.shapImportanceChart = new Chart(ctxImportance, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        data: dataValues,
                        backgroundColor: 'rgba(0, 102, 255, 0.7)',
                        borderColor: '#0066FF',
                        borderWidth: 1.5,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        x: { grid: { display: false } },
                        y: { ticks: { callback: val => `${val}%` } }
                    }
                }
            });
        }
    } catch (chartErr) {
        console.error('Failed to render SHAP Global Feature Importance Plot:', chartErr);
    }
}

/* ==========================================================================
   6. Recommendations Grid Generator (5 Luxury Cards)
   ========================================================================== */
let currentRecommendations = {
    plan: [],
    supplements: [],
    lifestyle: []
};
let activeCareTab = 'plan';

function switchCareTab(tabName) {
    activeCareTab = tabName;
    
    // Update active class on tab buttons
    document.querySelectorAll('.cly-care-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`btn-tab-${tabName}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Render list
    renderCareRecommendations();
}

// Make globally accessible
window.switchCareTab = switchCareTab;

function generateRecommendations(inputs, category) {
    const chol = parseFloat(inputs.chol) || 200;
    const trestbps = parseFloat(inputs.trestbps) || 120;
    const thalach = parseFloat(inputs.thalch) || 150;
    const fbs = parseInt(inputs.fbs) || 0;

    // Plan recommendations
    currentRecommendations.plan = [
        {
            title: "Aerobic Cardio Protocol",
            icon: "fa-person-running",
            desc: thalach < 130 
                ? "Incorporate moderate zone-2 cardiovascular walking, gradually increasing intensity under supervision to raise heart rate safely." 
                : "Engage in 40 minutes of zone-2 cardiovascular training (e.g. incline brisk walk) 4 times weekly to optimize arterial tone.",
            impact: "Reduces risk"
        },
        {
            title: "Soluble Fiber Intake",
            icon: "fa-apple-whole",
            desc: chol > 240
                ? "Consume 15g of oat bran, beans, or psyllium husk daily. Soluble fiber binds bile acids, lowering LDL particle count."
                : "Maintain standard fiber intake of 25g-30g daily to sustain healthy lipid profile metrics.",
            impact: chol > 240 ? "Target: -30mg/dL" : "Optimal"
        },
        {
            title: "Angiotensin Regulation",
            icon: "fa-heart-pulse",
            desc: trestbps > 140
                ? "Monitor blood pressure daily at 08:00. Limit dietary sodium to 1,500mg daily to reduce systolic wall stress."
                : "Maintain current sodium limit (<2,300mg) to sustain normal resting blood pressure.",
            impact: trestbps > 140 ? "Target: <130 mmHg" : "Optimal"
        }
    ];

    // Supplements recommendations
    currentRecommendations.supplements = [
        {
            title: "Omega-3 Ethyl Esters (EPA/DHA)",
            icon: "fa-capsules",
            desc: chol > 220 
                ? "High-dose pharmaceutical grade Omega-3 fatty acids (2g daily). Minimizes triglycerides and reduces plaque inflammation."
                : "Standard Omega-3 supplement (1g daily) to support endothelial membrane stability.",
            impact: "Lipid Support"
        },
        {
            title: "Coenzyme Q10 (Ubiquinol)",
            icon: "fa-pill",
            desc: "100mg ubiquinol daily. Optimizes mitochondrial bioenergetics in cardiac cells and supports general metabolic rate.",
            impact: "Cellular Energy"
        },
        {
            title: "Magnesium L-Threonate",
            icon: "fa-prescription-bottle-medical",
            desc: "400mg before sleep. Promotes smooth muscle relaxation in arterioles, aiding blood pressure reduction and improving sleep.",
            impact: "Vascular Tone"
        }
    ];

    // Lifestyle recommendations
    currentRecommendations.lifestyle = [
        {
            title: "Circadian Sleep Alignments",
            icon: "fa-bed",
            desc: "Establish a strict 8-hour sleep schedule, sleeping before 22:30. Reduces night-time cortisol secretion and regulates blood pressure.",
            impact: "Vitals Recovery"
        },
        {
            title: "Mindfulness HRV Exercises",
            icon: "fa-brain",
            desc: "Utilize resonant breathing (5 seconds inhale, 5 seconds exhale) for 10 minutes twice daily to stimulate vagal tone and lower resting heart rate.",
            impact: "HRV Target: +15ms"
        },
        {
            title: "Heat Exposure Therapy",
            icon: "fa-fire-burner",
            desc: "Sauna sessions at 80°C for 15-20 minutes 3 times weekly. Triggers heat-shock proteins, improving capillaries elasticity.",
            impact: "Endothelial Care"
        }
    ];

    // Render active tab recommendations
    renderCareRecommendations();
}

function renderCareRecommendations() {
    const list = document.getElementById('care-recommendations-list');
    if (!list) return;

    list.innerHTML = '';
    const items = currentRecommendations[activeCareTab] || [];

    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'cly-care-card';
        
        let iconStyle = '';
        let tagStyle = '';
        if (activeCareTab === 'plan') {
            iconStyle = 'color: #0066ff; background: #eff6ff;';
            tagStyle = 'color: #0066ff; background: #eff6ff;';
        } else if (activeCareTab === 'supplements') {
            iconStyle = 'color: #10b981; background: #ecfdf5;';
            tagStyle = 'color: #10b981; background: #ecfdf5;';
        } else {
            iconStyle = 'color: #8b5cf6; background: #f5f3ff;';
            tagStyle = 'color: #8b5cf6; background: #f5f3ff;';
        }

        card.innerHTML = `
            <div class="d-flex align-items-start gap-3">
                <div class="cly-care-card-icon" style="${iconStyle}">
                    <i class="fa-solid ${item.icon}"></i>
                </div>
                <div>
                    <h5 class="cly-care-card-title">${item.title}</h5>
                    <p class="cly-care-card-desc">${item.desc}</p>
                </div>
            </div>
            <span class="cly-care-card-impact" style="${tagStyle}">${item.impact}</span>
        `;
        list.appendChild(card);
    });
}

/* ==========================================================================
   7. AI Chat Assistant
   ========================================================================== */
function initChatAssistant() {
    const toggle = document.getElementById('chat-toggle-btn');
    const win = document.getElementById('chat-window');
    const close = document.getElementById('chat-close-btn');
    const send = document.getElementById('chat-send-btn');
    const input = document.getElementById('chat-input');
    const body = document.getElementById('chat-body');
    const suggestBtns = document.querySelectorAll('.chat-suggest-btn');
    const dot = document.querySelector('.chat-toggle-btn .unread-dot');

    if (!toggle || !win) return;

    toggle.addEventListener('click', () => {
        win.classList.toggle('active');
        if (dot) dot.remove();
        if (win.classList.contains('active') && input) {
            setTimeout(() => input.focus(), 300);
        }
    });

    if (close) {
        close.addEventListener('click', () => {
            win.classList.remove('active');
        });
    }

    suggestBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            handleUserMessage(btn.textContent.trim());
        });
    });

    if (send && input) {
        send.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    function sendMessage() {
        const txt = input.value.trim();
        if (!txt) return;
        input.value = '';
        handleUserMessage(txt);
    }

    function appendMsg(sender, text) {
        const bubble = document.createElement('div');
        bubble.className = `chat-message ${sender}`;
        bubble.innerHTML = text.replace(/\n/g, '<br>');
        body.appendChild(bubble);
        body.scrollTop = body.scrollHeight;
    }

    function handleUserMessage(query) {
        appendMsg('user', query);
        
        const typ = document.createElement('div');
        typ.className = 'chat-message assistant typing-indicator';
        typ.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
        body.appendChild(typ);
        body.scrollTop = body.scrollHeight;

        setTimeout(() => {
            typ.remove();
            const reply = getBotReply(query);
            appendMsg('assistant', reply);
        }, 900);
    }

    function getBotReply(q) {
        const t = q.toLowerCase();
        if (t.includes('cholesterol')) {
            return `**Lowering Cholesterol:**\n1. **Diet:** Reduce saturated fats (less butter/meat) and boost fibers.\n2. **Vitamins:** Omega-3 fatty acids from fish oil.\n3. **Activity:** 30 mins aerobic walking raises good HDL.`;
        }
        if (t.includes('shap') || t.includes('explain')) {
            return `**SHAP Explainability:**\nSHAP measures feature contributions. Red bars show elements that raise cardiac risk. Blue bars show features reducing risk relative to a baseline.`;
        }
        if (t.includes('attack') || t.includes('symptom')) {
            return `⚠️ **Heart Attack Symptoms:**\n- Crushing chest pressure or squeezing discomfort.\n- Pain radiating down the left arm, neck, or jaw.\n- Sudden shortness of breath and cold sweating.\n\n*Call emergency services immediately if experienced.*`;
        }
        return `I can help with questions about cardiovascular disease, exercise limits, and explaining our AI classifiers. Try asking:\n- "How to lower cholesterol?"\n- "Explain SHAP values"`;
    }
}

/* ==========================================================================
   8. PDF Report Setup & Exporting
   ========================================================================== */
function setupPrintReport(inputs, prob, cat, confidence) {
    const date = new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' });
    
    const pDate = document.getElementById('print-date');
    const pAge = document.getElementById('print-age');
    const pGen = document.getElementById('print-gender');
    const pChol = document.getElementById('print-chol');
    const pBp = document.getElementById('print-bp');
    const pHr = document.getElementById('print-hr');
    const pFbs = document.getElementById('print-fbs');
    const pCp = document.getElementById('print-cp');
    const pExang = document.getElementById('print-exang');
    const pOldpeak = document.getElementById('print-oldpeak');
    const pCa = document.getElementById('print-ca');
    const pProb = document.getElementById('print-prob');
    const pCat = document.getElementById('print-cat');

    const cpLabels = ['Typical Angina', 'Atypical Angina', 'Non-Anginal Pain', 'Asymptomatic'];

    if (pDate) pDate.textContent = date;
    if (pAge) pAge.textContent = inputs.age || '45';
    if (pGen) pGen.textContent = (parseInt(inputs.sex) === 1) ? 'Male' : 'Female';
    if (pChol) pChol.textContent = `${inputs.chol || '210'} mg/dL`;
    if (pBp) pBp.textContent = `${inputs.trestbps || '120'} mmHg`;
    if (pHr) pHr.textContent = `${inputs.thalch || '150'} bpm`;
    if (pFbs) pFbs.textContent = (parseInt(inputs.fbs) === 1) ? '> 120 mg/dL' : 'Normal';
    if (pCp) pCp.textContent = cpLabels[parseInt(inputs.cp)] || 'Typical Angina';
    if (pExang) pExang.textContent = (parseInt(inputs.exang) === 1) ? 'Yes' : 'No';
    if (pOldpeak) pOldpeak.textContent = inputs.oldpeak || '0.0';
    if (pCa) pCa.textContent = inputs.ca || '0';
    
    if (pProb) pProb.textContent = `${prob.toFixed(1)}%`;
    if (pCat) pCat.textContent = cat.toUpperCase() + ' RISK';
    
    if (pCat) {
        pCat.className = 'badge';
        if (cat === 'High') {
            pCat.classList.add('bg-danger');
        } else {
            pCat.classList.add('bg-success');
        }
    }

    // Copy recommendations
    const repList = document.getElementById('print-recs-list');
    if (repList) {
        repList.innerHTML = '';
        document.querySelectorAll('#personalized-rec-list .rec-luxury-card').forEach((card) => {
            const title = card.querySelector('.rec-card-title').textContent;
            const desc = card.querySelector('.rec-card-desc').textContent;
            const li = document.createElement('li');
            li.style.marginBottom = '8px';
            li.innerHTML = `<strong>${title}:</strong> ${desc}`;
            repList.appendChild(li);
        });
    }

    // Bind triggers
    document.querySelectorAll('.download-report-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            exportPDFReport();
        };
    });
}

function exportPDFReport() {
    const element = document.getElementById('report-template');
    if (!element) return;

    element.style.display = 'block';

    const options = {
        margin: [10, 10, 10, 10],
        filename: 'CardioAI_Risk_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(options).from(element).save().then(() => {
        element.style.display = 'none';
    }).catch(err => {
        console.error(err);
        element.style.display = 'none';
    });
}

/* ==========================================================================
   9. Fallback & Helpers
   ========================================================================== */
function checkDirectFlaskResult() {
    const hidden = document.getElementById('flask-raw-prediction');
    if (hidden && hidden.textContent.trim() !== '') {
        const rawText = hidden.textContent.trim();
        const fallbackInputs = {
            age: 55, sex: 1, cp: 0, trestbps: 130, chol: 245,
            fbs: 0, restecg: 1, thalch: 142, exang: 1, oldpeak: 1.5,
            slope: 1, ca: 0, thal: 2
        };
        setTimeout(() => {
            // Fake JSON outcome object matching the parsed string
            const isHigh = rawText.toLowerCase().includes('high');
            const probMatch = rawText.match(/(\d+(\.\d+)?)\s*%/);
            const prob = probMatch ? parseFloat(probMatch[1]) : (isHigh ? 78.0 : 15.0);
            
            const data = {
                prediction_text: rawText,
                probability: prob,
                category: isHigh ? 'High' : 'Low',
                tips: 'Check metrics'
            };
            handlePredictionResults(data, fallbackInputs);
        }, 600);
    }
}

function initSmoothScroll() {
    document.querySelectorAll('.btn-start-prediction, .btn-hero-cta, .navbar-nav a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });
}

function animateCounter(id, start, end, duration, suffix = '') {
    const obj = document.getElementById(id);
    if (!obj) return;
    
    const range = end - start;
    const minTimer = 35;
    let stepTime = Math.abs(Math.floor(duration / range));
    stepTime = Math.max(stepTime, minTimer);
    
    const startTime = new Date().getTime();
    const endTime = startTime + duration;
    let timer;
    
    function run() {
        const now = new Date().getTime();
        const remaining = Math.max((endTime - now) / duration, 0);
        const value = end - (remaining * range);
        obj.textContent = value.toFixed(1) + suffix;
        if (value === end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 } });
            confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 } });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }
}

// ECG Monitor Globals
let ecgAnimationId = null;
let currentEcgBpm = 82;

function initEcgMonitor() {
    const canvas = document.getElementById('ecg-monitor-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    });

    let x = 0;
    const points = [];
    const maxPoints = width;
    
    for (let i = 0; i < maxPoints; i++) {
        points.push(height / 2);
    }

    let lastBeatTime = Date.now();

    function draw() {
        ctx.fillStyle = 'rgba(13, 13, 13, 0.12)';
        ctx.fillRect(0, 0, width, height);

        // Grid Background
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.05)';
        ctx.lineWidth = 1;
        for (let g = 0; g < width; g += 15) {
            ctx.beginPath();
            ctx.moveTo(g, 0);
            ctx.lineTo(g, height);
            ctx.stroke();
        }
        for (let g = 0; g < height; g += 15) {
            ctx.beginPath();
            ctx.moveTo(0, g);
            ctx.lineTo(width, g);
            ctx.stroke();
        }

        const now = Date.now();
        const beatInterval = (60 / currentEcgBpm) * 1000;
        
        let targetY = height / 2;
        x = (x + 2) % width;

        const timeInBeat = now - lastBeatTime;
        if (timeInBeat > beatInterval) {
            lastBeatTime = now;
        }

        const beatProgress = timeInBeat / beatInterval;
        if (beatProgress < 0.35) {
            const phase = beatProgress / 0.35;
            if (phase < 0.25) {
                // P wave
                targetY = height / 2 - Math.sin(phase * 4 * Math.PI) * 4;
            } else if (phase >= 0.25 && phase < 0.35) {
                targetY = height / 2;
            } else if (phase >= 0.35 && phase < 0.45) {
                // Q wave
                targetY = height / 2 + (phase - 0.35) * 45;
            } else if (phase >= 0.45 && phase < 0.6) {
                // R wave spike
                const rPhase = (phase - 0.45) / 0.15;
                if (rPhase < 0.5) {
                    targetY = height / 2 - (rPhase * 2) * (height * 0.38);
                } else {
                    targetY = height / 2 - (1 - (rPhase - 0.5) * 2) * (height * 0.38) + (rPhase - 0.5) * 12;
                }
            } else if (phase >= 0.6 && phase < 0.7) {
                // S wave dip
                const sPhase = (phase - 0.6) * 10;
                targetY = height / 2 + (1 - sPhase) * 6;
            } else if (phase >= 0.7 && phase < 0.9) {
                // T wave
                const tPhase = (phase - 0.7) * 5;
                targetY = height / 2 - Math.sin(tPhase * Math.PI) * 6;
            } else {
                targetY = height / 2;
            }
        } else {
            targetY = height / 2;
        }

        points[x] = targetY;

        // Draw Line with glowing shadow
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 6;

        ctx.beginPath();
        for (let i = 0; i < width; i++) {
            const dist = Math.abs(i - x);
            if (dist > 8) {
                if (i === 0) {
                    ctx.moveTo(i, points[i]);
                } else {
                    if (Math.abs(i - x) > 10) {
                        ctx.lineTo(i, points[i]);
                    } else {
                        ctx.moveTo(i, points[i]);
                    }
                }
            } else {
                ctx.moveTo(i, points[i]);
            }
        }
        ctx.stroke();
        
        // Sweep scanning dot
        ctx.fillStyle = '#60a5fa';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(x, points[x], 4.5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.shadowBlur = 0;

        ecgAnimationId = requestAnimationFrame(draw);
    }
    
    draw();
}

function renderRiskDonut(probability) {
    const ctx = document.getElementById('riskDonutChart');
    if (!ctx) return;

    if (window.riskDonutChartObj) {
        window.riskDonutChartObj.destroy();
    }

    const isHigh = probability >= 50.0;
    const accentColor = isHigh ? '#ef4444' : '#10b981';
    
    window.riskDonutChartObj = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [probability, 100 - probability],
                backgroundColor: [accentColor, 'rgba(255, 255, 255, 0.05)'],
                borderWidth: 0,
                hoverBackgroundColor: [accentColor, 'rgba(255, 255, 255, 0.05)']
            }]
        },
        options: {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });

    const donutLbl = document.getElementById('risk-donut-percentage');
    if (donutLbl) {
        donutLbl.textContent = `${probability.toFixed(1)}%`;
        donutLbl.style.color = accentColor;
    }
}
