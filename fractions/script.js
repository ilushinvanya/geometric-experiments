let denominator = 1;
let numerator = 0;
let selectedParts = new Set();
let isMouseDown = false;
let toggleMode = null; // 'select' или 'deselect'

const square = document.getElementById('square');
const numeratorEl = document.getElementById('numerator');
const denominatorEl = document.getElementById('denominator');
const increaseBtn = document.getElementById('increaseBtn');
const decreaseBtn = document.getElementById('decreaseBtn');

document.addEventListener('mousedown', () => {
    isMouseDown = true;
});

document.addEventListener('mouseup', () => {
    isMouseDown = false;
    toggleMode = null;
});

function getGridDimensions(n) {
    if (n === 1) return { rows: 1, distribution: [1] };

    const sqrt = Math.sqrt(n);
    let bestRows = 1;
    let bestCols = n;
    let minDiff = n;

    for (let rows = 1; rows <= Math.ceil(sqrt) + 1; rows++) {
        const cols = Math.ceil(n / rows);
        const diff = Math.abs(rows - cols);

        if (diff < minDiff) {
            minDiff = diff;
            bestRows = rows;
            bestCols = cols;
        }
    }

    const baseItems = Math.floor(n / bestRows);
    const extraItems = n % bestRows;

    const distribution = [];
    for (let i = 0; i < bestRows; i++) {
        distribution.push(baseItems + (i < extraItems ? 1 : 0));
    }

    return { rows: bestRows, distribution };
}

function renderSquare() {
    square.innerHTML = '';

    // Удаляем из выбора индексы, которые больше не существуют
    selectedParts.forEach(idx => {
        if (idx >= denominator) {
            selectedParts.delete(idx);
        }
    });

    const { rows, distribution } = getGridDimensions(denominator);

    square.style.display = 'flex';
    square.style.flexWrap = 'wrap';
    square.style.alignContent = 'flex-start';

    const partHeight = `calc(100% / ${rows})`;

    let index = 0;
    for (let row = 0; row < rows; row++) {
        const itemsInRow = distribution[row];
        const partWidth = `calc(100% / ${itemsInRow})`;

        for (let col = 0; col < itemsInRow; col++) {
            const part = document.createElement('div');
            part.className = 'square-part';
            part.dataset.index = index;
            part.style.width = partWidth;
            part.style.height = partHeight;

            // Восстанавливаем выбор
            if (selectedParts.has(index)) {
                part.classList.add('selected');
            }

            const currentIndex = index;

            const togglePart = () => {
                if (toggleMode === null) {
                    // Определяем режим при первом клике
                    toggleMode = selectedParts.has(currentIndex) ? 'deselect' : 'select';
                }

                if (toggleMode === 'select') {
                    if (!selectedParts.has(currentIndex)) {
                        selectedParts.add(currentIndex);
                        part.classList.add('selected');
                        updateNumerator();
                    }
                } else {
                    if (selectedParts.has(currentIndex)) {
                        selectedParts.delete(currentIndex);
                        part.classList.remove('selected');
                        updateNumerator();
                    }
                }
            };

            part.addEventListener('mousedown', (e) => {
                e.preventDefault();
                togglePart();
            });

            part.addEventListener('mouseenter', () => {
                if (isMouseDown) {
                    togglePart();
                }
            });

            square.appendChild(part);
            index++;
        }
    }

    updateNumerator();
    updateDenominator();
    updateButtons();
}

function updateNumerator() {
    numerator = selectedParts.size;
    numeratorEl.textContent = numerator;
}

function updateDenominator() {
    denominatorEl.textContent = denominator;
}

function updateButtons() {
    decreaseBtn.disabled = denominator <= 1;
    increaseBtn.disabled = denominator >= 100;
}

increaseBtn.addEventListener('click', () => {
    if (denominator < 100) {
        denominator++;
        renderSquare();
    }
});

decreaseBtn.addEventListener('click', () => {
    if (denominator > 1) {
        denominator--;
        renderSquare();
    }
});

renderSquare();
