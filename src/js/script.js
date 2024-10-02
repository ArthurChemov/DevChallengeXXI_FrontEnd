const title = document.getElementById('title');
const upload = document.getElementById('upload');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('fileInput');
const manualInput = document.getElementById('manualInput');
const submitManualInput = document.getElementById('submitManualInput');
const chartTypeSelect = document.getElementById('chartType');
const createChartButton = document.getElementById('createChart');
const themeToggleButton = document.getElementById('themeToggle');
const modal = document.getElementById("myModal");
const span = document.getElementsByClassName("close")[0];

let graphTitle = document.getElementById('graphTitle').value;
let xAxisCaption = document.getElementById('xAxisCaption').value;
let yAxisCaption = document.getElementById('yAxisCaption').value;

let lineColor = document.getElementById('lineColor').value;
let barColor = document.getElementById('barColor').value;

let columnThickness = document.getElementById('columnThickness').value;
let lineStyle = document.getElementById('lineStyle').value;

const allowedTypes = ['csv', 'xlsx', 'xls', 'json'];
let cachedJsondata = [];

let isDarkMode = false;
let isChart = false;

let xAxis = null;
let labels = null;
let labelsY = null;
let valuesInput = null;
let selectedChartType = null;

themeToggleButton.addEventListener('click', () => {
    if (isDarkMode) {
        document.body.classList.remove('dark-mode');
        themeToggleButton.textContent = 'Light Mode';
    } else {
        document.body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Dark Mode';
    }

    isDarkMode = !isDarkMode;
    if (isChart) drawGraph(xAxis, labels, labelsY, valuesInput, selectedChartType);
});

function updateModalMargin() {
    const width100wv = window.innerWidth;
    const marginHorizontal = (width100wv - 360) / 2;

    const modalContent = document.querySelector('.modal-content');
    modalContent.style.margin = `100px ${marginHorizontal}px 0 ${marginHorizontal}px`;
}


function showErrorModal(message) {
    const modalContent = document.querySelector('.modal-content');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = '';

    modalContent.style.width = '300px';
    updateModalMargin();

    window.addEventListener('resize', async () => {
        await new Promise(resolve => setTimeout(resolve, 16.7));
        updateModalMargin();
    });

    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';

    modalBody.appendChild(errorMessage);
    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function showModal(data) {
    const modalContent = document.querySelector('.modal-content');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = '';

    modalContent.style.width = '95%';
    modalContent.style.margin = '100px 20px 0 20px';

    const table = document.createElement('table');
    table.id = 'data-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.color = 'black';

    if (data.length <= 1) {
        showErrorModal("No data to display!");
        return;
    }

    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');

    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.border = '1px solid #ddd';
        th.style.padding = '8px';
        headerRow.appendChild(th);
    });

    table.appendChild(headerRow);

    data.forEach(row => {
        const tableRow = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            const cellValue = row[header];

            td.textContent = cellValue;

            td.style.border = '1px solid #ddd';
            td.style.padding = '8px';
            tableRow.appendChild(td);
        });

        table.appendChild(tableRow);
    });

    modalBody.appendChild(table);
    modal.style.display = "block";

    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

function processFile(file) {
    const fileType = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    cachedJsondata = [];

    if (allowedTypes.includes(fileType)) {
        if (fileType === 'xlsx' || fileType === 'xls') {
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];

                try {
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    cachedJsondata = jsonData;
                    showModal(jsonData);
                } catch (error) {
                    showErrorModal("File conversion error! Please check the Excel file.");
                }
            };
            reader.readAsArrayBuffer(file);
        }

        else if (fileType === 'csv') {
            reader.onload = (e) => {
                const content = e.target.result;
                const rows = content.split('\n').map(row => row.split(','));
                const headers = rows[0];

                try {
                    const jsonData = rows.slice(1).map(row => {
                        return headers.reduce((obj, header, index) => {
                            obj[header.trim()] = row[index] ? row[index].trim() : null;
                            return obj;
                        }, {});
                    });
                    cachedJsondata = jsonData;
                    showModal(jsonData);
                } catch (error) {
                    showErrorModal("File conversion error! Please check the CSV file.");
                }
            };
            reader.readAsText(file);
        }

        else if (fileType === 'json') {
            reader.onload = (e) => {
                try {
                    const jsonData = JSON.parse(e.target.result);
                    if (Array.isArray(jsonData)) {
                        cachedJsondata = jsonData;
                        showModal(jsonData);
                    } else {
                        showErrorModal("The JSON does not contain valid data.");
                    }
                } catch (error) {
                    showErrorModal("File conversion error! Please check the JSON file.");
                }
            };
            reader.readAsText(file);
        }
    } else {
        showErrorModal("Unsupported file type! Please upload a CSV, XLSX, XLS, or JSON file.");
    }
}

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('active');

    const files = event.dataTransfer.files;
    if (files.length) {
        processFile(files[0]);
    } else {
        showErrorModal('No files detected');
    }
});

dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('active');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active');
});

upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
        event.target.value = '';
    } else {
        showErrorModal("No file selected.");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const valuesTable = document.getElementById('values-table').getElementsByTagName('tbody')[0];
    const headerRow = document.getElementById('values-table').getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];

    let jsonData = [];
    let yAxisCount = 2;
    let xAxisCount = 2;

    function initializeTable() {
        for (let i = 1; i <= yAxisCount; i++) {
            const newHeader = document.createElement('th');
            newHeader.innerHTML = `<input type="text" placeholder="Y${i}" class="y-axis-label">`;
            headerRow.appendChild(newHeader);
        }

        for (let i = 1; i <= xAxisCount; i++) {
            addRow(`X${i}`);
        }
    }

    document.getElementById('add-column').addEventListener('click', function () {
        yAxisCount++;

        const newHeader = document.createElement('th');
        newHeader.innerHTML = `<input type="text" placeholder="Y${yAxisCount}" class="y-axis-label">`;
        headerRow.appendChild(newHeader);

        const rows = valuesTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const newCell = document.createElement('td');
            newCell.innerHTML = `<input type="number" placeholder="Value">`;
            rows[i].appendChild(newCell);
        }
    });

    function addRow(xLabel = '') {
        const newRow = document.createElement('tr');

        const xLabelCell = document.createElement('td');
        xLabelCell.innerHTML = `<input type="text" placeholder="${xLabel}">`;
        newRow.appendChild(xLabelCell);

        for (let i = 0; i < yAxisCount; i++) {
            const newCell = document.createElement('td');
            newCell.innerHTML = `<input type="number" placeholder="Value">`;
            newRow.appendChild(newCell);
        }

        valuesTable.appendChild(newRow);
    }

    document.getElementById('add-row').addEventListener('click', function () {
        xAxisCount++;
        addRow(`X${xAxisCount}`);
    });

    initializeTable();

    document.getElementById('submit-values').addEventListener('click', function () {
        for (let i = 0; i < jsonData.length; i++) {
            for (const key in jsonData[i]) {
                if (jsonData[i][key] === null) {
                    showErrorModal("Please fill in all the details!");
                    return;
                }
            }
        }

        const xAxisLabel = String(headerRow.getElementsByTagName('th')[0].querySelector('input').value).trim();

        const yAxisLabels = Array.from(headerRow.getElementsByTagName('th'))
                                 .slice(1)
                                 .map(header => String(header.querySelector('input').value).trim());

        if (yAxisLabels.some(label => label === null || label.trim() === '')) {
            showErrorModal("Please fill in all the details!");
            return;
        }

        const uniqueYAxisLabels = new Set(yAxisLabels.map(label => label.trim()));
        if (uniqueYAxisLabels.size !== yAxisLabels.length) {
            showErrorModal("Y-axis labels must be unique!");
            return;
        }

        if (uniqueYAxisLabels.has(xAxisLabel.trim())) {
            showErrorModal("X-axis label must be unique and different from Y-axis labels!");
            return;
        }

        if (!xAxisLabel) {
            showErrorModal("Please fill in all the details!");
            return;
        }

        const xAxisValuesSet = new Set();

        const rows = valuesTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const xValue = String(rows[i].getElementsByTagName('td')[0].querySelector('input').value).trim(); // X label as string

            if (xAxisValuesSet.has(xValue)) {
                showErrorModal(`X-axis labels must be unique!`);
                return;
            }
            xAxisValuesSet.add(xValue);

            const rowData = Array.from(rows[i].getElementsByTagName('td'))
                .slice(1)
                .map((cell, index) => {
                    const inputValue = cell.querySelector('input').value;
                    return { [yAxisLabels[index]]: inputValue ? parseFloat(inputValue) : null };
                });

            const combinedRowData = rowData.reduce((acc, current) => Object.assign(acc, current), { [xAxisLabel]: xValue });
            jsonData.push(combinedRowData);
        }

        cachedJsondata = jsonData;
        showModal(jsonData);
    });
});

createChartButton.addEventListener('click', () => {
    selectedChartType = chartTypeSelect.value;

    if (cachedJsondata.length < 1) {
        showErrorModal("No data to display!");
        return;
    }

    if(xAxisCaption === "") {
        labels = cachedJsondata.map(item => {
            const firstKey = Object.keys(item)[0];
            xAxis = firstKey;
            return item[firstKey];
        });
    } else xAxis = xAxisCaption;

    labelsY = Object.keys(cachedJsondata[0]).slice(1);
    valuesArray = labelsY.map(labelY => {
        return cachedJsondata.map(item => item[labelY]);
    });

    valuesInput = valuesArray;

    document.getElementById('customization-panel').style.display = 'flex';
    document.getElementById('customization-panel').style.flexDirection = 'column';
    document.getElementById('customization-panel').style.alignItems = 'center';
    document.getElementById('customization-panel').style.gap = '20px';

    document.getElementById('chartCanvas').style.display = 'block';

    document.getElementById('exportButtons').style.display = 'flex';
    document.getElementById('exportButtons').style.flexDirection = 'column';
    document.getElementById('exportButtons').style.alignItems = 'center';
    document.getElementById('exportButtons').style.gap = '20px';

    drawGraph(xAxis, labels, labelsY, valuesInput, selectedChartType);
});

function drawBarChart(ctx, xAxis, labelsInput, labelsInputY, valuesInput, graphTitle) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const padding = 50;
    const graphHeight = canvasHeight * 0.9;
    const legendHeight = canvasHeight * 0.1;
    const axisYEnd = graphHeight - padding;

    const maxValue = Math.max(...valuesInput.flat());
    const barWidth = (canvasWidth - padding * 2) / (labelsInput.length * labelsInputY.length) - 10;

    const colors = ['steelblue', 'orange', 'green', 'red', 'purple'];

    const axisColor = isDarkMode ? 'white' : 'black';
    const backgroundColor = isDarkMode ? '#333' : 'white';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    const centerX = canvasWidth / 2;
    if(graphTitle === "" || graphTitle === undefined) ctx.fillText("Title", centerX, 30);
    else ctx.fillText(graphTitle, centerX, 30);

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, axisYEnd);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, axisYEnd);
    ctx.lineTo(canvasWidth - padding, axisYEnd);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(padding - 40, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = axisColor;
    if(yAxisCaption === "") ctx.fillText("Value", 0, 10);
    else ctx.fillText(yAxisCaption, 0, 10);
    ctx.restore();

    ctx.fillStyle = axisColor;
    ctx.fillText(xAxis, canvasWidth / 2, canvasHeight - legendHeight - 15);

    const yTicks = 5;
    const stepY = maxValue / yTicks;

    for (let i = 0; i <= yTicks; i++) {
        const yPos = axisYEnd - (i * (axisYEnd - padding) / yTicks);
        const value = Math.round(i * stepY);

        ctx.beginPath();
        ctx.moveTo(padding - 5, yPos);
        ctx.lineTo(padding, yPos);
        ctx.strokeStyle = axisColor;
        ctx.stroke();
        ctx.fillText(value, padding - 20, yPos + 5);
    }

    let animationFrame = 0;
    const animationDuration = 1000;

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 2;

        ctx.fillStyle = isDarkMode ? 'white' : 'black';
        ctx.textAlign = 'center';
        const centerX = canvasWidth / 2;
        if(graphTitle === "" || graphTitle === undefined) ctx.fillText("Title", centerX, 30);
        else ctx.fillText(graphTitle, centerX, 30);

        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, axisYEnd);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(padding, axisYEnd);
        ctx.lineTo(canvasWidth - padding, axisYEnd);
        ctx.stroke();

        ctx.save();
        ctx.translate(padding - 40, canvasHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = axisColor;
        if(yAxisCaption === "") ctx.fillText("Value", 0, 10);
        else ctx.fillText(yAxisCaption, 0, 10);
        ctx.restore();

        ctx.fillStyle = axisColor;
        ctx.fillText(xAxis, canvasWidth / 2, canvasHeight - legendHeight - 15);

        for (let i = 0; i <= yTicks; i++) {
            const yPos = axisYEnd - (i * (axisYEnd - padding) / yTicks);
            const value = Math.round(i * stepY);

            ctx.beginPath();
            ctx.moveTo(padding - 5, yPos);
            ctx.lineTo(padding, yPos);
            ctx.strokeStyle = axisColor;
            ctx.stroke();
            ctx.fillText(value, padding - 20, yPos + 5);
        }

        const progress = Math.min(animationFrame / animationDuration, 1);

        valuesInput.forEach((valueSet, valueIndex) => {
            valueSet.forEach((value, index) => {
                const barHeight = (value / maxValue) * (axisYEnd - padding) * progress;

                const barX = padding + 10 + index * (canvasWidth - padding * 2) / labelsInput.length + valueIndex * barWidth;
                const barY = axisYEnd - barHeight;

                ctx.fillStyle = colors[valueIndex % colors.length];
                ctx.fillRect(barX, barY, barWidth, barHeight);

                if (valueIndex === 0) {
                    ctx.fillStyle = axisColor;
                    const centerX = padding + 20 + (index + 0.5) * (canvasWidth - padding * 2) / labelsInput.length + valueIndex * barWidth;
                    ctx.fillText(labelsInput[index], centerX - 20, canvasHeight - legendHeight - 35);
                }
            });
        });

        drawLegend(ctx, colors, labelsInputY, axisColor, padding, graphHeight + padding - 60, canvasHeight);

        if (animationFrame < animationDuration) {
            animationFrame += 16.7;
            requestAnimationFrame(animate);
        }
    }
    animate();
}

function drawLineChart(ctx, xAxis, labelsInput, labelsInputY, valuesInput) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const padding = 50;
    const graphHeight = canvasHeight * 0.9;
    const legendHeight = canvasHeight * 0.1;
    const axisYEnd = graphHeight - padding;

    const maxValue = Math.max(...valuesInput.flat());

    const colors = ['steelblue', 'orange', 'green', 'red', 'purple'];

    const axisColor = isDarkMode ? 'white' : 'black';
    const backgroundColor = isDarkMode ? '#333' : 'white';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = isDarkMode ? 'white' : 'black';
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    const centerX = canvasWidth / 2;
    if(graphTitle === "" || graphTitle === undefined) ctx.fillText("Title", centerX, 30);
    else ctx.fillText(graphTitle, centerX, 30);

    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, axisYEnd);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(padding, axisYEnd);
    ctx.lineTo(canvasWidth - padding, axisYEnd);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.save();
    ctx.translate(padding - 40, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    ctx.fillStyle = axisColor;
    if(yAxisCaption === "") ctx.fillText("Value", 0, 10);
    else ctx.fillText(yAxisCaption, 0, 10);
    ctx.restore();

    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    ctx.fillStyle = axisColor;
    ctx.fillText(xAxis, canvasWidth / 2, canvasHeight - legendHeight - 15);

    const yTicks = 5;
    const stepY = maxValue / yTicks;

    for (let i = 0; i <= yTicks; i++) {
        const yPos = axisYEnd - (i * (axisYEnd - padding) / yTicks);
        const value = Math.round(i * stepY);

        ctx.beginPath();
        ctx.moveTo(padding - 5, yPos);
        ctx.lineTo(padding, yPos);
        ctx.strokeStyle = axisColor;
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillStyle = axisColor;
        ctx.fillText(value, padding - 20, yPos + 5);
    }

    function animateLine(fromX, fromY, toX, toY, progress, color) {
        const currentX = fromX + (toX - fromX) * progress;
        const currentY = fromY + (toY - fromY) * progress;

        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(currentX, currentY);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    let currentSegment = 0;
    let currentProgress = 0;
    const animationDuration = 1000;

    function animateLines() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.fillStyle = isDarkMode ? 'white' : 'black';
        ctx.textAlign = 'center';
        ctx.font = '14px Arial';
        const centerX = canvasWidth / 2;
        if(graphTitle === "" || graphTitle === undefined) ctx.fillText("Title", centerX, 30);
        else ctx.fillText(graphTitle, centerX, 30);

        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, axisYEnd);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(padding, axisYEnd);
        ctx.lineTo(canvasWidth - padding, axisYEnd);
        ctx.stroke();

        ctx.save();
        ctx.translate(padding - 40, canvasHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = 'center';
        ctx.font = '14px Arial';
        ctx.fillStyle = axisColor;
        if(yAxisCaption === "") ctx.fillText("Value", 0, 10);
        else ctx.fillText(yAxisCaption, 0, 10);
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.font = '14px Arial';
        ctx.fillStyle = axisColor;
        ctx.fillText(xAxis, canvasWidth / 2, canvasHeight - legendHeight - 15);

        for (let i = 0; i <= yTicks; i++) {
            const yPos = axisYEnd - (i * (axisYEnd - padding) / yTicks);
            const value = Math.round(i * stepY);

            ctx.beginPath();
            ctx.moveTo(padding - 5, yPos);
            ctx.lineTo(padding, yPos);
            ctx.strokeStyle = axisColor;
            ctx.stroke();
            ctx.fillStyle = axisColor;
            ctx.fillText(value, padding - 20, yPos + 5);
        }

        valuesInput.forEach((valueSet, valueIndex) => {
            ctx.strokeStyle = colors[valueIndex % colors.length];
            ctx.lineWidth = 2;
            ctx.beginPath();

            for (let i = 0; i <= currentSegment; i++) {
                const xPos = padding + i * (canvasWidth - padding * 2) / (labelsInput.length - 1);
                const yPos = axisYEnd - (valueSet[i] / maxValue) * (axisYEnd - padding);

                if (i === 0) {
                    ctx.moveTo(xPos, yPos);
                } else {
                    ctx.lineTo(xPos, yPos);
                }
            }
            ctx.stroke();
        });

        valuesInput.forEach((valueSet, valueIndex) => {
            const fromX = padding + currentSegment * (canvasWidth - padding * 2) / (labelsInput.length - 1);
            const toX = padding + (currentSegment + 1) * (canvasWidth - padding * 2) / (labelsInput.length - 1);
            const fromY = axisYEnd - (valueSet[currentSegment] / maxValue) * (axisYEnd - padding);
            const toY = axisYEnd - (valueSet[currentSegment + 1] / maxValue) * (axisYEnd - padding);

            const progress = currentProgress / animationDuration;

            animateLine(fromX, fromY, toX, toY, progress, colors[valueIndex % colors.length]);
        });

        currentProgress += 16.7;

        if (currentProgress >= animationDuration) {
            currentSegment++;
            currentProgress = 0;
        }
        labelsInput.forEach((label, index) => {
            const xPos = padding + index * (canvasWidth - padding * 2) / (labelsInput.length - 1);
            ctx.fillStyle = axisColor;
            ctx.textAlign = 'center';
            ctx.fillText(label, xPos, canvasHeight - legendHeight - 35);
        });

        drawLegend(ctx, colors, labelsInputY, axisColor, padding, graphHeight + padding - 60, canvasHeight, legendHeight);

        if (currentSegment < labelsInput.length - 1) {
            requestAnimationFrame(animateLines);
        }
    }

    animateLines();
}

function drawLegend(ctx, colors, labelsInputY, axisColor, legendX, legendY, canvasHeight) {
    legendItemHeight = 20;
    legendColumnWidth = 240;
    let currentLegendX = legendX;
    let currentLegendY = legendY;

    ctx.fillStyle = 'black';
    ctx.font = '14px Arial';

    labelsInputY.forEach((labelY, index) => {
        if (currentLegendY + legendItemHeight > canvasHeight) {
            currentLegendY = legendY;
            currentLegendX += legendColumnWidth;
        }

        ctx.fillStyle = colors[index % colors.length];
        ctx.fillRect(currentLegendX, currentLegendY, 15, 15);
        ctx.fillStyle = axisColor;
        ctx.textAlign = 'left';
        ctx.fillText(labelY, currentLegendX + 20, currentLegendY + 12);

        currentLegendY += legendItemHeight;
    });
}

function drawPieChart(ctx, labelsInputIndex, labelsInput, labelsInputY, valuesInput) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    const colors = ['steelblue', 'orange', 'green', 'red', 'purple'];

    const backgroundColor = isDarkMode ? '#333' : 'white';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const categoryValues = valuesInput.map(category => category[labelsInputIndex]);
    const total = categoryValues.reduce((acc, value) => acc + value, 0);

    if (total === 0) {
        ctx.fillStyle = isDarkMode ? 'white' : 'black';
        ctx.fillText("No data to display!", canvasWidth / 2, canvasHeight / 2);
        return;
    }

    const radius = Math.min(canvasWidth, canvasHeight) / 2 - 40;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    let currentSegment = 0;
    let startAngle = 0;
    const animationDuration = 1000;
    let currentProgress = 0;

    function animateSlice() {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        let angle = 0;
        for (let i = 0; i < currentSegment; i++) {
            const value = categoryValues[i];
            const sliceAngle = (value / total) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.fill();
            angle += sliceAngle;
        }

        if (currentSegment < categoryValues.length) {
            const value = categoryValues[currentSegment];
            const sliceAngle = (value / total) * 2 * Math.PI;
            const animatedSliceAngle = (sliceAngle * currentProgress) / animationDuration;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + animatedSliceAngle);
            ctx.closePath();
            ctx.fillStyle = colors[currentSegment % colors.length];
            ctx.fill();

            currentProgress += 16.7;

            if (currentProgress >= animationDuration) {
                currentSegment++;
                currentProgress = 0;
                startAngle += sliceAngle;
            }
        }

        ctx.fillStyle = isDarkMode ? 'white' : 'black';
        ctx.textAlign = 'center';
        ctx.font = '20px Arial';
        if(graphTitle === "") ctx.fillText(`Data for ${labelsInput[labelsInputIndex]}`, centerX, 30);
        else ctx.fillText(graphTitle, centerX, 30);

        if (currentSegment >= categoryValues.length) {
            drawLabelsAndTitle(angle);
        } else {
            requestAnimationFrame(animateSlice);
        }
    }

    function drawLabelsAndTitle(finalAngle) {
        let angle = 0;
        labelsInput.forEach((label, index) => {
            const value = categoryValues[index];
            const sliceAngle = (value / total) * 2 * Math.PI;
            const midAngle = angle + sliceAngle / 2;

            const labelX = centerX + (radius / 2) * Math.cos(midAngle);
            const labelY = centerY + (radius / 2) * Math.sin(midAngle);

            ctx.fillStyle = isDarkMode ? 'white' : 'black';
            ctx.textAlign = 'center';
            ctx.font = '12px Arial';
            ctx.fillText(`${labelsInputY[index]}: ${value}`, labelX, labelY);

            angle += sliceAngle;
        });
    }

    animateSlice();
}

function drawGraph(xAxis, labelsInput, labelsInputY, valuesInput, chartType) {
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (chartType === 'bar') {
        drawBarChart(ctx, xAxis, labelsInput, labelsInputY, valuesInput);
        isChart = true;
    } else if (chartType === 'line') {
        drawLineChart(ctx, xAxis, labelsInput, labelsInputY, valuesInput);
        isChart = true;
    } else if (chartType === 'pie') {
        drawPieChart(ctx, 0, labelsInput, labelsInputY, valuesInput);
        isChart = true;
    }
}

document.getElementById('exportPNG').addEventListener('click', function() {
    const canvas = document.getElementById('chartCanvas');
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'chart.png';
    link.click();
});

document.getElementById('exportPDF').addEventListener('click', function() {
    const canvas = document.getElementById('chartCanvas');
        const pdfWindow = window.open('', '_blank');

        const imageURL = canvas.toDataURL('image/png');

        pdfWindow.document.write('<html><head><title>Export PDF Chart</title></head><body>');
        pdfWindow.document.write('<img src="' + imageURL + '" style="width: auto; height: auto;">');
        pdfWindow.document.write('</body></html>');

        pdfWindow.document.close();
        pdfWindow.focus();

        pdfWindow.onload = function() {
            pdfWindow.print();
            pdfWindow.close();
        };
});

document.getElementById('exportSVG').addEventListener('click', function() {
    const canvas = document.getElementById('chartCanvas');

    const dataURL = canvas.toDataURL('image/png');

    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <image href="${dataURL}" width="${canvas.width}" height="${canvas.height}" />
        </svg>`;

    const svgData = encodeURIComponent(svg);
    const downloadLink = document.createElement('a');

    downloadLink.href = `data:image/svg+xml;charset=utf-8,${svgData}`;
    downloadLink.download = 'chart.svg';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
});

document.getElementById('printChart').addEventListener('click', function() {
    const canvas = document.getElementById('chartCanvas');
    const image = canvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>Print Chart</title>
            <style>
                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 0;
                    }
                    body {
                        margin: 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100vh;
                        background-color: white;
                    }
                    img {
                        width: 100%;
                        height: auto;
                        max-height: 100%;
                    }
                }
            </style>
        </head>
        <body>
            <img src="${image}">
        </body>
        </html>
    `);

    setTimeout(() => {
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, 100);
});

window.addEventListener('keydown', function(e) {
    if ((e.ctrlKey) && e.key === 'p') {
        e.preventDefault();
        const canvas = document.getElementById('chartCanvas');
        const image = canvas.toDataURL('image/png');

        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
            <head>
                <title>Print Chart</title>
                <style>
                    @media print {
                        @page {
                            size: A4 landscape;
                            margin: 0;
                        }
                        body {
                            margin: 0;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            background-color: white;
                        }
                        img {
                            width: 100%;
                            height: auto;
                            max-height: 100%;
                        }
                    }
                </style>
            </head>
            <body>
                <img src="${image}">
            </body>
            </html>
        `);

        setTimeout(() => {
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        }, 100);
    }
});

function resetFile() {
    const fileInput = document.getElementById('upload');
    fileInput.value = '';

    cachedJsondata = [];
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    document.getElementById('graphTitle').value = '';
    document.getElementById('xAxisCaption').value = '';
    document.getElementById('yAxisCaption').value = '';

    document.getElementById('chartCanvas').style.display = 'none';
    document.getElementById('customization-panel').style.display = 'none';
    document.getElementById('exportButtons').style.display = 'none';
}