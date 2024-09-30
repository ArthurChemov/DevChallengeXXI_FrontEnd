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

let isDarkMode = false;// Function to display a modal with provided data
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

    // Ensure that data exists and has at least one row
    if (data.length <= 1) {
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

    // Append the header row to the table
    table.appendChild(headerRow);

    // Populate table rows with data
    data.forEach(row => {
        const tableRow = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            const cellValue = row[header];

            td.textContent = cellValue; // Display numeric values correctly

            td.style.border = '1px solid #ddd';
            td.style.padding = '8px';
            tableRow.appendChild(td);
        });

        // Append each data row to the table
        table.appendChild(tableRow);
    });

    // Append the complete table to the modal body
    modalBody.appendChild(table);

    // Display the modal
    modal.style.display = "block";

    // Close the modal when clicking the "X" button or outside the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Function to update the margin dynamically
function updateModalMargin() {
    // Get the current window width
    const width100wv = window.innerWidth;

    // Calculate margin based on current window width
    const marginHorizontal = (width100wv - 360) / 2;

    // Update modal content margin
    const modalContent = document.querySelector('.modal-content'); // Assuming it's selected by class
    if (modalContent) {
        modalContent.style.margin = `100px ${marginHorizontal}px 0 ${marginHorizontal}px`;
    }
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
        await new Promise(resolve => setTimeout(resolve, 50));
        updateModalMargin();
    });

    const errorMessage = document.createElement('p');
    errorMessage.textContent = message;
    errorMessage.style.color = 'red'; // Style the error message

    // Append the error message to the modal body and display the modal
    modalBody.appendChild(errorMessage);
    modal.style.display = "block";

    // Close the modal on clicking the "X" button or outside the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}

// Theme toggle button logic
themeToggleButton.addEventListener('click', () => {
    if (isDarkMode) {
        document.body.classList.remove('dark-mode');
        themeToggleButton.textContent = 'Light Mode';
    } else {
        document.body.classList.add('dark-mode');
        themeToggleButton.textContent = 'Dark Mode';
    }
    isDarkMode = !isDarkMode; // Toggle the dark mode state
});

// File handling function for different file types
function handleFiles(files) {
    const file = files[0]; // Select the first file
    if (file) {
        const fileType = file.name.split('.').pop().toLowerCase(); // Get file extension
        const allowedTypes = ['csv', 'xlsx', 'xls', 'json']; // Allowed file types

        if (allowedTypes.includes(fileType)) {
            const reader = new FileReader();

            // Handle Excel files (XLSX or XLS)
            if (fileType === 'xlsx' || fileType === 'xls') {
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });

                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];

                    try {
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        showModal(jsonData); // Display the data in the modal
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

                    const headers = rows[0]; // First row as headers
                    try {
                        const jsonData = rows.slice(1).map(row => {
                            return headers.reduce((obj, header, index) => {
                                obj[header.trim()] = row[index] ? row[index].trim() : null;
                                return obj;
                            }, {});
                        });

                        showModal(jsonData); // Display the data in the modal
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
                        const jsonData = JSON.parse(e.target.result); // Try parsing the JSON data
                        // Validate that the JSON is in the expected format (array of objects)
                        if (Array.isArray(jsonData)) {
                            showModal(jsonData); // Display the data in the modal
                        } else {
                            showErrorModal("The JSON does not contain valid data.");
                        }
                    } catch (error) {
                        // Show detailed error message in the modal
                        showErrorModal(`JSON syntax error: ${error.message}. Please check the file.`);
                    }
                }
                reader.readAsText(file);
            }
        } else {
            showErrorModal("Unsupported file type! Please upload a CSV, XLSX, XLS, or JSON file.");
        }
    } else {
        showErrorModal("No file selected.");
    }
}


// Обработка события перетаскивания файла в зону
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault();
    dropZone.classList.add('active'); // Добавляем визуальный эффект при перетаскивании
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('active'); // Убираем визуальный эффект при выходе из зоны
});

dropZone.addEventListener('drop', (event) => {
    event.preventDefault();
    dropZone.classList.remove('active');

    const files = event.dataTransfer.files; // Получаем файл(ы)
    if (files.length) {
        fileInput.files = files; // Связываем перетаскиваемые файлы с input
        handleFiles(files); // Вызываем функцию для обработки файлов
    } else {
        alert('No files detected');
    }
});

// Обработка загрузки файла через input
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const fileType = file.name.split('.').pop().toLowerCase(); // Получаем расширение файла
        const allowedTypes = ['csv', 'xlsx', 'xls', 'json']; // Допустимые типы файлов

        if (allowedTypes.includes(fileType)) {
            if(fileType == 'xlsx' || fileType == 'xls'){
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    // Пример: считывание первого листа
                    const firstSheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[firstSheetName];
                    // Получение данных в формате JSON
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    showModal(jsonData); // Call the modal with data
                };
                reader.readAsArrayBuffer(file);
            }
            else if(fileType == 'csv'){
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result; // Get the file content
                    const rows = content.split('\n').map(row => row.split(',')); // Split rows and columns
                    const headers = rows[0]; // First row as headers

                    // Map rows to JSON objects based on headers
                    const jsonData = rows.slice(1).map(row => {
                        return headers.reduce((obj, header, index) => {
                            obj[header.trim()] = row[index] ? row[index].trim() : null; // Handle empty values
                            return obj;
                        }, {});
                    });

                    showModal(jsonData); // Call the modal with data
                };
                reader.readAsText(file);
            }
            else if(fileType == 'json'){
                const reader = new FileReader();
                reader.onload = (e) => {
                    const jsonData = JSON.parse(e.target.result); // Parse JSON data
                    showModal(jsonData); // Call the modal with data
                };
                reader.readAsText(file);
            }
        } else {
            alert('Unsupported file type. Please upload a valid file.');
        }
    } else {
        alert('No file selected');
    }
});

// Функция для обработки ручного ввода
// submitManualInput.addEventListener('click', () => {
//     const inputData = manualInput.value;
//     if (inputData) {
//         console.log(`Manual input data: ${inputData}`);
//     } else {
//         alert('No data entered');
//     }
// });

// Функция для создания диаграммы при выборе и нажатии кнопки
createChartButton.addEventListener('click', () => {
    const selectedChartType = chartTypeSelect.value;
    console.log(`Creating chart: ${selectedChartType}`);
});

function drawGraph() {
    const labelsInput = document.getElementById('labels').value.split(',');
    const valuesInput = document.getElementById('values').value.split(',').map(Number);
    if (labelsInput.length !== valuesInput.length) {
        alert("Количество меток должно совпадать с количеством значений.");
        return;
    }
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');
    // Очищаем холст перед рисованием
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Настройки графика
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const maxValue = Math.max(...valuesInput);
    const barWidth = canvasWidth / labelsInput.length - 10;
    // Рисуем столбцы
    valuesInput.forEach((value, index) => {
        const barHeight = (value / maxValue) * (canvasHeight - 50);
        const barX = index * (barWidth + 10) + 10;
        const barY = canvasHeight - barHeight - 20;
        // Рисуем столбец
        ctx.fillStyle = 'steelblue';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        // Добавляем текст меток под столбцами
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        ctx.fillText(labelsInput[index], barX + barWidth / 2, canvasHeight - 5);
    });
}