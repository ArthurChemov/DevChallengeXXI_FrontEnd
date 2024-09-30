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
    let yAxisCount = 0;
    let xAxisCount = 0;

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
    document.getElementById('add-row').addEventListener('click', function () {
        xAxisCount++;

        const newRow = document.createElement('tr');

        // First cell for the X-axis label
        const xLabelCell = document.createElement('td');
        xLabelCell.innerHTML = `<input type="text" placeholder="X${xAxisCount}">`;
        newRow.appendChild(xLabelCell);

        // Add the correct number of cells based on existing Y columns
        for (let i = 0; i < yAxisCount; i++) {
            const newCell = document.createElement('td');
            newCell.innerHTML = `<input type="number" placeholder="Value">`;
            newRow.appendChild(newCell);
        }

        // Append the new row to the table body
        valuesTable.appendChild(newRow);
    });

    // Handle form submission
    document.getElementById('submit-values').addEventListener('click', function () {
        cachedJsondata = [];
        jsonData = [];
        const yAxisLabels = Array.from(headerRow.getElementsByTagName('th'))
                                 .slice(1) // Skip the first header column (X \ Y)
                                 .map(header => header.querySelector('input').value || null); // Get Y-axis labels

        // Collect X-axis labels and values for each row
        const rows = valuesTable.getElementsByTagName('tr');
        for (let i = 0; i < rows.length; i++) {
            const xValue = rows[i].getElementsByTagName('td')[0].querySelector('input').value; // X label
            const rowData = Array.from(rows[i].getElementsByTagName('td'))
                                 .slice(1) // Skip the first column (X label)
                                 .map((cell, index) => {
                                     const inputValue = cell.querySelector('input').value;
                                     return { [yAxisLabels[index]]: inputValue ? parseFloat(inputValue) : null };
                                 });

            const combinedRowData = rowData.reduce((acc, current) => Object.assign(acc, current), { "X / Y": xValue });
            jsonData.push(combinedRowData);
        }

        cachedJsondata = jsonData;
        console.log(jsonData)
        showModal(jsonData);
    });
});

createChartButton.addEventListener('click', () => {
    const selectedChartType = chartTypeSelect.value;
    console.log(`Creating chart: ${selectedChartType}`);

    // Логирование данных для исследования структуры
    console.log(cachedJsondata);

    if (cachedJsondata.length > 0) {
        console.log('Keys in first item:', Object.keys(cachedJsondata[0]));  // Выводим ключи первого элемента
    }

    // Извлечение меток
    const labels = cachedJsondata.map(item => {
        // Перебираем ключи объекта
        for (let key in item) {
            // Ищем ключ с типом значения 'string', который будем использовать как метку
            if (typeof item[key] === 'string') {
                return item[key];  // Возвращаем первое строковое значение как метку
            }
        }
        return 'Unknown';  // Если строковое значение не найдено, возвращаем 'Unknown'
    });

    // Извлечение значений
    const valuesArray = []; // Массив для хранения всех значений

    cachedJsondata.forEach(item => {
        const values = [];
        // Перебираем ключи объекта
        for (let key in item) {
            // Ищем ключ с типом значения 'number', который будем использовать как значение
            if (typeof item[key] === 'number') {
                values.push(item[key]);  // Добавляем все числовые значения в массив
            }
        }
        // Добавляем в valuesArray массив значений для текущего элемента
        valuesArray.push(values);
    });

    // Теперь преобразуем valuesArray для передачи в drawGraph
    const maxLength = Math.max(...valuesArray.map(v => v.length)); // Находим максимальную длину массива значений
    const valuesInput = Array.from({ length: maxLength }, (_, i) => valuesArray.map(v => v[i] || 0)); // Транспонируем массивы

    // Теперь вызываем функцию для отрисовки графика с извлечёнными данными
    drawGraph(labels, valuesInput);
});

function drawGraph(labelsInput, valuesInput) {
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Отступы для осей
    const padding = 50;
    const axisYEnd = canvasHeight - padding;
    const axisXEnd = padding;

    // Рассчитываем максимальное значение для шкалы Y
    const maxValue = Math.max(...valuesInput.flat());
    const barWidth = (canvasWidth - padding * 2) / labelsInput.length - 10;

    // Рисуем ось Y (вертикальная)
    ctx.beginPath();
    ctx.moveTo(padding, padding); // Верхняя точка оси Y
    ctx.lineTo(padding, axisYEnd); // Нижняя точка оси Y
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Рисуем ось X (горизонтальная)
    ctx.beginPath();
    ctx.moveTo(padding, axisYEnd); // Начало оси X
    ctx.lineTo(canvasWidth - padding, axisYEnd); // Конец оси X
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Добавляем подпись оси Y
    ctx.save(); // Сохраняем текущее состояние
    ctx.translate(padding - 40, canvasHeight / 2); // Перемещаем на центр оси Y
    ctx.rotate(-Math.PI / 2); // Поворачиваем текст вертикально
    ctx.textAlign = 'center';
    ctx.fillText('Values', 0, 0); // Текст для оси Y
    ctx.restore(); // Восстанавливаем состояние

    // Добавляем подпись оси X
    ctx.textAlign = 'center';
    ctx.fillText('Categories', canvasWidth / 2, canvasHeight - 5); // Текст для оси X

    // Рисуем метки и значения на оси Y (шкала)
    const yTicks = 5;  // Количество делений на оси Y
    const stepY = maxValue / yTicks;

    for (let i = 0; i <= yTicks; i++) {
        const yPos = axisYEnd - (i * (axisYEnd - padding) / yTicks);  // Позиция деления
        const value = Math.round(i * stepY);  // Значение деления

        ctx.beginPath();
        ctx.moveTo(padding - 5, yPos);  // Линия деления
        ctx.lineTo(padding, yPos);
        ctx.stroke();

        ctx.textAlign = 'right';
        ctx.fillText(value, padding - 10, yPos + 5);  // Текст значений на оси Y
    }

    // Рисуем столбцы и метки на оси X для каждого значения
    const numberOfValues = valuesInput.length; // Количество наборов значений
    const valueWidth = barWidth / numberOfValues; // Ширина для каждого набора значений

    valuesInput.forEach((valueSet, index) => {
        valueSet.forEach((value, valueIndex) => {
            const barHeight = (value / maxValue) * (axisYEnd - padding);
            const barX = padding + index * (barWidth + 10) + valueIndex * valueWidth + 10; // Сдвигаем по индексу
            const barY = axisYEnd - barHeight;

            // Рисуем столбцы
            const colors = ['steelblue', 'orange', 'green', 'red', 'purple']; // Цвета для разных значений
            ctx.fillStyle = colors[valueIndex % colors.length]; // Определяем цвет для текущего набора значений
            ctx.fillRect(barX, barY, valueWidth - 2, barHeight); // Рисуем столбец

            // Подписи к столбцам (ось X)
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.fillText(labelsInput[index], barX + (valueWidth - 2) / 2, canvasHeight - 20);
        });
    });
}
