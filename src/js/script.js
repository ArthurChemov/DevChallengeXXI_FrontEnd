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

let isDarkMode = false;

// Function to show modal with data
function showModal(data) {
    const modalBody = document.getElementById('modal-body');

    // Clear existing content entirely
    modalBody.innerHTML = ''; // Clear the modal content

    console.log(data.length)
    // Check if data is empty or invalid
    if (data.length <= 1) {
        alert("File is empty! Please fill it and upload it."); // Alert the user about the error
        return;
    }

    // Create a table
    const table = document.createElement('table');
    table.id = 'data-table';
    table.style.width = '100%'; // Set table width to 100%
    table.style.borderCollapse = 'collapse'; // Collapse borders for better appearance

    // Generate table headers (from the keys of the first row)
    const headers = Object.keys(data[0]);
    const headerRow = document.createElement('tr');
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.border = '1px solid #ddd'; // Add border to header
        th.style.padding = '8px'; // Add padding for header
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Generate table rows
    data.forEach(row => {
        const tableRow = document.createElement('tr');
        headers.forEach(header => {
            const td = document.createElement('td');
            // Error handling for incorrect or missing values
            if (row[header] === undefined || row[header] === null || row[header] === "") {
                td.textContent = 'N/A'; // Mark as 'N/A' if value is missing
            } else if (row[header] !== 'number' || isNaN(Number(row[header]))) {
                td.textContent = 'Invalid value'; // Mark as 'Invalid value' for non-numeric fields where numbers are expected
            } else {
                td.textContent = row[header]; // Otherwise, set the content to the actual value
            }
            td.style.border = '1px solid #ddd'; // Add border to cell
            td.style.padding = '8px'; // Add padding for cell
            tableRow.appendChild(td);
        });
        table.appendChild(tableRow);
    });

    // Add the table to the modal body
    modalBody.appendChild(table);

    // Show modal
    modal.style.display = "block";

    // Close modal on clicking "X"
    span.onclick = function() {
        modal.style.display = "none";
    };

    // Close modal on clicking outside the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };
}


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

// Функция обработки файлов
function handleFiles(files) {
    const file = files[0]; // Берем первый файл
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
                    // Try parsing JSON data
                    try {
                        // Получение данных в формате JSON
                        const jsonData = XLSX.utils.sheet_to_json(worksheet);
                        showModal(jsonData); // Call the modal with data
                    } catch (error) {
                        alert("File has syntax errors in JSON! Please check and correct it."); // Alert the user about the error
                    }
                };
                reader.readAsArrayBuffer(file);
            }
            else if(fileType == 'csv'){
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target.result; // Get the file content
                    const rows = content.split('\n').map(row => row.split(',')); // Split rows and columns
                    const headers = rows[0]; // First row as headers

                    try {
                        // Map rows to JSON objects based on headers
                        const jsonData = rows.slice(1).map(row => {
                            return headers.reduce((obj, header, index) => {
                                obj[header.trim()] = row[index] ? row[index].trim() : null; // Handle empty values
                                return obj;
                            }, {});
                        });
                        showModal(jsonData); // Call the modal with data
                    } catch (error) {
                        alert("File has syntax errors in JSON! Please check and correct it."); // Alert the user about the error
                    }

                };
                reader.readAsText(file);
            }
            else if(fileType == 'json'){
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Try parsing JSON data
                    try {
                        const jsonData = JSON.parse(e.target.result); // Parse JSON data
                        showModal(jsonData); // Call the modal with data
                    } catch (error) {
                        alert("File has syntax errors in JSON! Please check and correct it."); // Alert the user about the error
                    }
                };
                reader.readAsText(file);
            }
        } else {
            alert('Unsupported file type. Please upload a valid file.');
        }
    } else {
        alert('No file selected');
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
submitManualInput.addEventListener('click', () => {
    const inputData = manualInput.value;
    if (inputData) {
        alert(`Manual input data: ${inputData}`);
    } else {
        alert('No data entered');
    }
});

// Функция для создания диаграммы при выборе и нажатии кнопки
createChartButton.addEventListener('click', () => {
    const selectedChartType = chartTypeSelect.value;
    alert(`Creating chart: ${selectedChartType}`);
});
