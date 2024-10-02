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

const allowedTypes = ['csv', 'xlsx', 'xls', 'json'];
let cachedJsondata = [];

let isDarkMode = false;
let isChart = false;

let xAxis = null;
let labels = null;
let labelsY = null;
let valuesInput = null;
let selectedChartType = null;

// Theme toggle button logic
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

// Function to update the margin dynamically
function updateModalMargin() {
    const width100wv = window.innerWidth;
    const marginHorizontal = (width100wv - 360) / 2;

    const modalContent = document.querySelector('.modal-content');
    modalContent.style.margin = `100px ${marginHorizontal}px 0 ${marginHorizontal}px`;
}


// Function to display a modal with an error message
function showErrorModal(message) {
    const modalContent = document.querySelector('.modal-content');
    const modalBody = document.getElementById('modal-body');

    // Clear any existing content inside the modal
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

    // Clear any existing content inside the modal
    modalBody.innerHTML = '';

    modalContent.style.width = '95%';
    modalContent.style.margin = '100px 20px 0 20px';

    // Create a table element for displaying data
    const table = document.createElement('table');
    table.id = 'data-table';
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';
    table.style.color = 'black'; // Устанавливаем цвет текста

    if (data.length === 0) {
        showErrorModal("No data to display!");
        return;
    }

    // Generate table headers using keys from the first object in the array
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

    // Table rows with data
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

// Function to process the file based on its type
function processFile(file) {
    const fileType = file.name.split('.').pop().toLowerCase();
    const reader = new FileReader();
    cachedJsondata = [];

    // Check if the file type is allowed
    if (allowedTypes.includes(fileType)) {
        // Handle Excel files (XLSX or XLS)
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

        // Handle CSV files
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

        // Handle JSON files
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

// Handle file upload through drag and drop
dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('active');

    const files = event.dataTransfer.files;
    if (files.length) {
        fileInput.files = files;
        processFile(files);
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

// Handle file upload through input
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        processFile(file);
    } else {
        showErrorModal("No file selected.");
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const valuesTable = document.getElementById('values-table').getElementsByTagName('tbody')[0];
    const headerRow = document.getElementById('values-table').getElementsByTagName('thead')[0].getElementsByTagName('tr')[0];

    let jsonData = [];
    let yAxisCount = 2; // Начальное количество Y-осей
    let xAxisCount = 2; // Начальное количество X-осей

    // Initialize the table with default values
    function initializeTable() {
        // Create Y-axis headers
        for (let i = 1; i <= yAxisCount; i++) {
            const newHeader = document.createElement('th');
            newHeader.innerHTML = `<input type="text" placeholder="Y${i}" class="y-axis-label">`;
            headerRow.appendChild(newHeader);
        }

        // Create X-axis rows with default values
        for (let i = 1; i <= xAxisCount; i++) {
            addRow(`X${i}`);
        }
    }

    // Function to add a new Y-axis column
    document.getElementById('add-column').addEventListener('click', function () {
        yAxisCount++;

        // Add a new header for Y-axis in the table with an input field for the label
        const newHeader = document.createElement('th');
        newHeader.innerHTML = `<input type="text" placeholder="Y${yAxisCount}" class="y-axis-label">`;
        headerRow.appendChild(newHeader);

        // Add a new input field for every existing row for the new Y column
        const rows = valuesTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const newCell = document.createElement('td');
            newCell.innerHTML = `<input type="number" placeholder="Value">`;
            rows[i].appendChild(newCell);
        }
    });

    // Function to add a new X-axis row
    function addRow(xLabel = '') {
        const newRow = document.createElement('tr');

        // First cell for the X-axis label
        const xLabelCell = document.createElement('td');
        xLabelCell.innerHTML = `<input type="text" placeholder="${xLabel}">`;
        newRow.appendChild(xLabelCell);

        // Add the correct number of cells based on existing Y columns
        for (let i = 0; i < yAxisCount; i++) {
            const newCell = document.createElement('td');
            newCell.innerHTML = `<input type="number" placeholder="Value">`;
            newRow.appendChild(newCell);
        }

        // Append the new row to the table body
        valuesTable.appendChild(newRow);
    }

    document.getElementById('add-row').addEventListener('click', function () {
        xAxisCount++;
        addRow(`X${xAxisCount}`);
    });

    // Create default rows
    initializeTable();

    // Handle form submission
    document.getElementById('submit-values').addEventListener('click', function () {
        // Проверка на наличие хотя бы одного значения, отличного от null
        for (let i = 0; i < jsonData.length; i++) {
            for (const key in jsonData[i]) {
                if (jsonData[i][key] === null) {
                    showErrorModal("Please fill in all the details!");
                    return;
                }
            }
        }

        // Получаем значение заголовка для оси X
        const xAxisLabel = String(headerRow.getElementsByTagName('th')[0].querySelector('input').value).trim();

        const yAxisLabels = Array.from(headerRow.getElementsByTagName('th'))
                                 .slice(1) // Skip the first header column (X axis)
                                 .map(header => String(header.querySelector('input').value).trim()); // Get Y-axis labels as strings

        if (yAxisLabels.some(label => label === null || label.trim() === '')) {
            showErrorModal("Please fill in all the details!");
            return;
        }

        // Проверка на дублирующиеся заголовки Y-осей
        const uniqueYAxisLabels = new Set(yAxisLabels.map(label => label.trim())); // Используем Set для проверки уникальности
        if (uniqueYAxisLabels.size !== yAxisLabels.length) {
            showErrorModal("Y-axis labels must be unique!");
            return;
        }

        // Проверка на дублирующийся заголовок X-оси с Y-осями
        if (uniqueYAxisLabels.has(xAxisLabel.trim())) {
            showErrorModal("X-axis label must be unique and different from Y-axis labels!");
            return;
        }

        if (!xAxisLabel) {
            showErrorModal("Please fill in all the details!");
            return;
        }

        // Коллекция для проверки уникальности значений X-оси
        const xAxisValuesSet = new Set();

        // Collect X-axis labels and values for each row
        const rows = valuesTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const xValue = String(rows[i].getElementsByTagName('td')[0].querySelector('input').value).trim(); // X label as string

            // Проверка на дублирующиеся значения X-оси
            if (xAxisValuesSet.has(xValue)) {
                showErrorModal(`X-axis labels must be unique!`);
                return;
            }
            xAxisValuesSet.add(xValue);

            const rowData = Array.from(rows[i].getElementsByTagName('td'))
                .slice(1) // Skip the first column (X label)
                .map((cell, index) => {
                    const inputValue = cell.querySelector('input').value;
                    return { [yAxisLabels[index]]: inputValue ? parseFloat(inputValue) : null };
                });

            // Используем значение из инпута заголовка для создания combinedRowData
            const combinedRowData = rowData.reduce((acc, current) => Object.assign(acc, current), { [xAxisLabel]: xValue });
            jsonData.push(combinedRowData);
        }

        cachedJsondata = jsonData;
        showModal(jsonData);
    });
});

createChartButton.addEventListener('click', () => {
    selectedChartType = chartTypeSelect.value;  // Получаем выбранный тип графика

    if (cachedJsondata.length < 1) {
        showErrorModal("No data to display!");
        return;
    }

    labels = cachedJsondata.map(item => {
        const firstKey = Object.keys(item)[0];
        xAxis = firstKey;
        return item[firstKey];
    });

    labelsY = Object.keys(cachedJsondata[0]).slice(1);
    valuesArray = labelsY.map(labelY => {
        return cachedJsondata.map(item => item[labelY]);
    });

    valuesInput = valuesArray;

    // Показываем канвас
    const canvas = document.getElementById('chartCanvas');
    canvas.style.display = 'block'; // Делаем канвас видимым

    // Теперь передаем тип графика в drawGraph
    drawGraph(xAxis, labels, labelsY, valuesInput, selectedChartType);
});

function drawBarChart(ctx, xAxis, labelsInput, labelsInputY, valuesInput) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Отступы для осей
    const padding = 50;
    const graphHeight = canvasHeight * 0.9; // 90% высоты для графика
    const legendHeight = canvasHeight * 0.1; // 10% высоты для легенды
    const axisYEnd = graphHeight - padding; // Конец оси Y

    // Рассчитываем максимальное значение для шкалы Y
    const maxValue = Math.max(...valuesInput.flat());
    const barWidth = (canvasWidth - padding * 2) / (labelsInput.length * labelsInputY.length) - 10; // Ширина для каждого столбца

    // Определяем цвета для разных категорий Y
    const colors = ['steelblue', 'orange', 'green', 'red', 'purple']; // Цвета для разных категорий Y

    // Установка цветов в зависимости от режима
    const axisColor = isDarkMode ? 'white' : 'black';
    const backgroundColor = isDarkMode ? '#333' : 'white'; // Фон графика
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Закрашиваем фон

    // Рисуем ось Y
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, axisYEnd);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем ось X
    ctx.beginPath();
    ctx.moveTo(padding, axisYEnd);
    ctx.lineTo(canvasWidth - padding, axisYEnd);
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Добавляем подпись оси Y
    ctx.save();
    ctx.translate(padding - 40, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = axisColor;
    ctx.fillText('Values', 0, 10);
    ctx.restore();

    // Добавляем подпись оси X
    ctx.fillStyle = axisColor;
    ctx.fillText(xAxis, canvasWidth / 2, canvasHeight - legendHeight - 15);

    // Рисуем метки на оси Y
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
        ctx.fillText(value, padding - 30, yPos + 5);  // Adjusting position to avoid overlap
    }

    // Animation variables
    let animationFrame = 0;
    const animationDuration = 1000; // Duration of animation in milliseconds

    function animate() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.strokeStyle = axisColor;
        ctx.lineWidth = 2;

        // Redraw axes
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, axisYEnd);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(padding, axisYEnd);
        ctx.lineTo(canvasWidth - padding, axisYEnd);
        ctx.stroke();

        // Redraw labels and ticks
        ctx.save();
        ctx.translate(padding - 40, canvasHeight / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillStyle = axisColor;
        ctx.fillText('Values', 0, 10);
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
            ctx.fillText(value, padding - 30, yPos + 5);  // Adjusting position to avoid overlap
        }

        // Calculate progress
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

        // Increment animation frame
        if (animationFrame < animationDuration) {
            animationFrame += 16.7; // Approx 60 FPS
            requestAnimationFrame(animate);
        }
    }
    animate(); // Start animation
}

function drawLineChart(ctx, xAxis, labelsInput, labelsInputY, valuesInput) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Отступы для осей
    const padding = 50;
    const graphHeight = canvasHeight * 0.9; // 90% высоты для графика
    const legendHeight = canvasHeight * 0.1; // 10% высоты для легенды
    const axisYEnd = graphHeight - padding; // Конец оси Y

    // Рассчитываем максимальное значение для шкалы Y
    const maxValue = Math.max(...valuesInput.flat());

    // Определяем цвета для разных категорий Y
    const colors = ['steelblue', 'orange', 'green', 'red', 'purple']; // Цвета для линий

    // Установка цветов в зависимости от режима
    const axisColor = isDarkMode ? 'white' : 'black';
    const backgroundColor = isDarkMode ? '#333' : 'white'; // Фон графика
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Закрашиваем фон

    // Рисуем ось Y (вертикальная)
    ctx.beginPath();
    ctx.moveTo(padding, padding); // Верхняя точка оси Y
    ctx.lineTo(padding, axisYEnd); // Нижняя точка оси Y
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем ось X (горизонтальная)
    ctx.beginPath();
    ctx.moveTo(padding, axisYEnd); // Начало оси X
    ctx.lineTo(canvasWidth - padding, axisYEnd); // Конец оси X
    ctx.strokeStyle = axisColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Добавляем подпись оси Y
    ctx.save(); // Сохраняем текущее состояние
    ctx.translate(padding - 40, canvasHeight / 2); // Перемещаем на центр оси Y
    ctx.rotate(-Math.PI / 2); // Поворачиваем текст вертикально
    ctx.textAlign = 'center';
    ctx.font = '14px Arial'; // Устанавливаем размер и тип шрифта
    ctx.fillStyle = axisColor; // Устанавливаем цвет текста
    ctx.fillText('Values', 0, 10); // Текст для оси Y
    ctx.restore(); // Восстанавливаем состояние

    // Добавляем подпись оси X
    ctx.textAlign = 'center';
    ctx.font = '14px Arial'; // Устанавливаем размер и тип шрифта
    ctx.fillStyle = axisColor; // Устанавливаем цвет текста
    ctx.fillText(xAxis, canvasWidth / 2, canvasHeight - legendHeight - 15); // Смещаем текст для оси X выше легенды

    // Рисуем метки и значения на оси Y (шкала)
    const yTicks = 5;  // Количество делений на оси Y
    const stepY = maxValue / yTicks;

    for (let i = 0; i <= yTicks; i++) {
        const yPos = axisYEnd - (i * (axisYEnd - padding) / yTicks);  // Позиция деления
        const value = Math.round(i * stepY);  // Значение деления

        ctx.beginPath();
        ctx.moveTo(padding - 5, yPos);  // Линия деления
        ctx.lineTo(padding, yPos);
        ctx.strokeStyle = axisColor; // Цвет сетки
        ctx.stroke();
        ctx.textAlign = 'right';
        ctx.fillStyle = axisColor; // Устанавливаем цвет текста
        ctx.fillText(value, padding - 10, yPos + 5);  // Текст значений на оси Y
    }

    // Функция для анимации линии между двумя точками
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

    // Анимация линий
    let currentSegment = 0;
    let currentProgress = 0;
    const animationDuration = 1000; // Длительность анимации для одного сегмента

    function animateLines() {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight); // Очищаем весь холст перед каждой отрисовкой
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight); // Заново закрашиваем фон

        // Рисуем оси и подписи, которые не меняются в процессе анимации
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
        ctx.fillText('Values', 0, 10);
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.font = '14px Arial';
        ctx.fillStyle = axisColor;
        ctx.fillText(xAxis, canvasWidth / 2, canvasHeight - legendHeight - 15);

        // Шкала Y
        for (let i = 0; i <= yTicks; i++) {
            const yPos = axisYEnd - (i * (axisYEnd - padding) / yTicks);
            const value = Math.round(i * stepY);

            ctx.beginPath();
            ctx.moveTo(padding - 5, yPos);
            ctx.lineTo(padding, yPos);
            ctx.strokeStyle = axisColor;
            ctx.stroke();
            ctx.fillStyle = axisColor;
            ctx.fillText(value, padding - 10, yPos + 5);
        }

        // Рисуем линии без анимации для всех предыдущих сегментов
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

        // Анимируем текущий сегмент для всех линий
        valuesInput.forEach((valueSet, valueIndex) => {
            const fromX = padding + currentSegment * (canvasWidth - padding * 2) / (labelsInput.length - 1);
            const toX = padding + (currentSegment + 1) * (canvasWidth - padding * 2) / (labelsInput.length - 1);
            const fromY = axisYEnd - (valueSet[currentSegment] / maxValue) * (axisYEnd - padding);
            const toY = axisYEnd - (valueSet[currentSegment + 1] / maxValue) * (axisYEnd - padding);

            const progress = currentProgress / animationDuration;

            // Анимируем от одной точки к следующей
            animateLine(fromX, fromY, toX, toY, progress, colors[valueIndex % colors.length]);
        });

        // Увеличиваем прогресс
        currentProgress += 16.7; // Около 60 кадров в секунду

        // Когда один сегмент завершен, переходим к следующему
        if (currentProgress >= animationDuration) {
            currentSegment++;
            currentProgress = 0;
        }
        // Рисуем метки на оси X
        labelsInput.forEach((label, index) => {
            const xPos = padding + index * (canvasWidth - padding * 2) / (labelsInput.length - 1);
            ctx.fillStyle = axisColor;
            ctx.textAlign = 'center';
            ctx.fillText(label, xPos, canvasHeight - legendHeight - 35);
        });

        // Рисуем легенду
        drawLegend(ctx, colors, labelsInputY, axisColor, padding, graphHeight + padding - 60, canvasHeight, legendHeight);

        // Продолжаем анимацию, пока не завершены все сегменты
        if (currentSegment < labelsInput.length - 1) {
            requestAnimationFrame(animateLines);
        }
    }

    // Запускаем анимацию
    animateLines();
}

// Draw Legend Function
function drawLegend(ctx, colors, labelsInputY, axisColor, legendX, legendY, canvasHeight) {
    legendItemHeight = 20; // Высота каждого элемента легенды
    legendColumnWidth = 240; // Ширина колонки легенд
    let currentLegendX = legendX; // Текущая позиция по X для легенд
    let currentLegendY = legendY; // Текущая позиция по Y для легенд

    ctx.fillStyle = 'black'; // Цвет текста легенды
    ctx.font = '14px Arial'; // Шрифт легенды

    // Отрисовка элементов легенды с переносом на новую колонку
    labelsInputY.forEach((labelY, index) => {
        // Если элемент выходит за нижнюю границу canvas, переносим на следующую колонну
        if (currentLegendY + legendItemHeight > canvasHeight) {
            currentLegendY = legendY; // Возвращаемся в начало по Y
            currentLegendX += legendColumnWidth; // Смещаемся вправо на ширину новой колонки
        }

        ctx.fillStyle = colors[index % colors.length]; // Цвет для текущей категории
        ctx.fillRect(currentLegendX, currentLegendY, 15, 15); // Квадрат цвета
        ctx.fillStyle = axisColor; // Цвет текста
        ctx.textAlign = 'left'; // Выравнивание текста по левому краю
        ctx.fillText(labelY, currentLegendX + 20, currentLegendY + 12); // Текст легенды

        // Смещаемся вниз для следующего элемента
        currentLegendY += legendItemHeight;
    });
}
function drawPieChart(ctx, labelsInputIndex, labelsInput, labelsInputY, valuesInput) {
    const canvasWidth = ctx.canvas.width;
    const canvasHeight = ctx.canvas.height;

    // Определяем цвета для разных категорий Y
    const colors = ['steelblue', 'orange', 'green', 'red', 'purple']; // Цвета для линий

    // Устанавливаем фон для диаграммы
    const backgroundColor = isDarkMode ? '#333' : 'white';
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Получаем значения для выбранного года
    const categoryValues = valuesInput.map(category => category[labelsInputIndex]); // Берем данные по индексу года
    const total = categoryValues.reduce((acc, value) => acc + value, 0); // Суммируем все значения

    if (total === 0) {
        ctx.fillStyle = isDarkMode ? 'white' : 'black';
        ctx.fillText("No data to display!", canvasWidth / 2, canvasHeight / 2);
        return; // Выходим, если нет данных
    }

    // Устанавливаем начальные параметры для рисования
    const radius = Math.min(canvasWidth, canvasHeight) / 2 - 40; // Радиус диаграммы
    const centerX = canvasWidth / 2; // Центр по X
    const centerY = canvasHeight / 2; // Центр по Y

    // Начальные значения для анимации
    let currentSegment = 0; // Текущий сегмент для анимации
    let startAngle = 0; // Угол начала для сегментов
    const animationDuration = 1000; // Длительность анимации одного сегмента
    let currentProgress = 0; // Прогресс анимации

    function animateSlice() {
        // Очищаем холст и закрашиваем его
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Рисуем уже нарисованные сегменты
        let angle = 0;
        for (let i = 0; i < currentSegment; i++) {
            const value = categoryValues[i];
            const sliceAngle = (value / total) * 2 * Math.PI; // Угол для текущего сегмента
            ctx.beginPath();
            ctx.moveTo(centerX, centerY); // Перемещаемся в центр
            ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle); // Рисуем дугу
            ctx.closePath();
            ctx.fillStyle = colors[i % colors.length]; // Выбор цвета
            ctx.fill(); // Заполняем цветом
            angle += sliceAngle; // Переходим к следующему сегменту
        }

        // Рисуем текущий сегмент с анимацией
        if (currentSegment < categoryValues.length) {
            const value = categoryValues[currentSegment];
            const sliceAngle = (value / total) * 2 * Math.PI; // Угол для текущего сегмента
            const animatedSliceAngle = (sliceAngle * currentProgress) / animationDuration; // Анимированный угол

            ctx.beginPath();
            ctx.moveTo(centerX, centerY); // Перемещаемся в центр
            ctx.arc(centerX, centerY, radius, startAngle, startAngle + animatedSliceAngle); // Рисуем дугу
            ctx.closePath();
            ctx.fillStyle = colors[currentSegment % colors.length]; // Выбор цвета
            ctx.fill(); // Заполняем цветом

            currentProgress += 16; // Прогресс анимации (примерно 60 кадров в секунду)

            // Если анимация текущего сегмента завершена
            if (currentProgress >= animationDuration) {
                currentSegment++; // Переход к следующему сегменту
                currentProgress = 0; // Сброс прогресса
                startAngle += sliceAngle; // Обновление угла начала для следующего сегмента
            }
        }

        // Добавляем заголовок
        ctx.fillStyle = isDarkMode ? 'white' : 'black'; // Цвет текста
        ctx.textAlign = 'center';
        ctx.font = '20px Arial'; // Шрифт заголовка
        ctx.fillText(`Data for ${labelsInput[labelsInputIndex]}`, centerX, 30); // Заголовок диаграммы

        // Если анимация завершена, рисуем подписи
        if (currentSegment >= categoryValues.length) {
            drawLabelsAndTitle(angle); // Рисуем подписи и заголовок
        } else {
            requestAnimationFrame(animateSlice); // Продолжаем анимацию
        }
    }

    function drawLabelsAndTitle(finalAngle) {
        // Добавляем подписи к сегментам
        let angle = 0;
        labelsInput.forEach((label, index) => {
            const value = categoryValues[index];
            const sliceAngle = (value / total) * 2 * Math.PI; // Угол для текущего сегмента
            const midAngle = angle + sliceAngle / 2; // Средний угол

            // Позиция для текста
            const labelX = centerX + (radius / 2) * Math.cos(midAngle);
            const labelY = centerY + (radius / 2) * Math.sin(midAngle);

            ctx.fillStyle = isDarkMode ? 'white' : 'black'; // Цвет текста
            ctx.textAlign = 'center';
            ctx.font = '12px Arial'; // Устанавливаем размер и тип шрифта
            ctx.fillText(`${labelsInputY[index]}: ${value}`, labelX, labelY); // Подпись с значением

            angle += sliceAngle; // Переходим к следующему сегменту
        });
    }

    animateSlice();
}

function drawGraph(xAxis, labelsInput, labelsInputY, valuesInput, chartType) {
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // В зависимости от типа графика вызываем нужную функцию
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
