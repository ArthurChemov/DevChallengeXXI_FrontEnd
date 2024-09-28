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
    modalBody.innerHTML = ''; // Полностью очищаем содержимое модального окна

    // Create a table
    const table = document.createElement('table');
    table.id = 'data-table';

    if (data.length) {
        // Generate table headers (from the keys of the first row)
        const headers = Object.keys(data[0]);
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        // Generate table rows
        data.forEach(row => {
            const tableRow = document.createElement('tr');
            headers.forEach(header => {
                const td = document.createElement('td');
                td.textContent = row[header];
                tableRow.appendChild(td);
            });
            table.appendChild(tableRow);
        });
    } else {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No data available';
        modalBody.appendChild(emptyMessage);
    }

    // Add the table to the modal body
    modalBody.appendChild(table);

    // Show modal
    modal.style.display = "block";

    // Close modal on clicking "X"
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal on clicking outside the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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
            console.error('Unsupported file type. Please upload a valid file.');
        }
    } else {
        console.log('No file selected');
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
        console.log('No files detected');
    }
});

// Обработка загрузки файла через input
upload.addEventListener('change', (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Пример: считывание первого листа
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Получение данных в формате JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Вызываем функцию для отображения данных в модальном окне
            showModal(jsonData);
        };

        reader.readAsArrayBuffer(file);
    }
});

// Функция для обработки ручного ввода
submitManualInput.addEventListener('click', () => {
    const inputData = manualInput.value;
    if (inputData) {
        console.log(`Manual input data: ${inputData}`);
    } else {
        console.log('No data entered');
    }
});

// Функция для создания диаграммы при выборе и нажатии кнопки
createChartButton.addEventListener('click', () => {
    const selectedChartType = chartTypeSelect.value;
    console.log(`Creating chart: ${selectedChartType}`);
});
