const title = document.getElementById('title');
const upload = document.getElementById('upload');
const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('fileInput');
const manualInput = document.getElementById('manualInput');
const submitManualInput = document.getElementById('submitManualInput');
const chartTypeSelect = document.getElementById('chartType');
const createChartButton = document.getElementById('createChart');

const themeToggleButton = document.getElementById('themeToggle');
let isDarkMode = false;

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
            console.log(`File selected: ${file.name}`);
            // Здесь можно добавить обработку файла, например, с помощью библиотеки SheetJS
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

// Обработка файлов при выборе через input
fileInput.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length) {
        handleFiles(files);
    } else {
        console.log('No files selected via input');
    }
});

// Обработка загрузки файла
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
            console.log(jsonData); // Вывод данных в консоль
        };

        reader.readAsArrayBuffer(file);
    }
});

upload.addEventListener('change', (event) => {
    const files = event.target.files;
    if (files.length) {
        handleFiles(files);
    } else {
        console.log('No files selected via input');
    }
});

// Функция для обработки ручного ввода
submitManualInput.addEventListener('click', () => {
    const inputData = manualInput.value;
    if (inputData) {
        console.log(`Manual input data: ${inputData}`);
        // Здесь можно добавить обработку данных, например, сохранение или отправку
    } else {
        console.log('No data entered');
    }
});

// Функция для создания диаграммы при выборе и нажатии кнопки
createChartButton.addEventListener('click', () => {
    const selectedChartType = chartTypeSelect.value;
    console.log(`Creating chart: ${selectedChartType}`);
    // Здесь можно добавить логику для создания диаграммы на основе выбранного типа
});
