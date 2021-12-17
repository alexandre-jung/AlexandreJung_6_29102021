export function showModal() {
    const modal = document.querySelector('.contact-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const form = modal.querySelector('form');

    function hideModal(ev) {
        modal.classList.remove('visible');
        ev.preventDefault();
        document.body.style.overflowY = 'auto';
        modalCloseBtn.removeEventListener('click', hideModal);
        form.removeEventListener('submit', onSubmit);
        document.removeEventListener('keydown', hideModal);
    }

    function onSubmit(ev) {
        handleSubmit(form);
        hideModal(ev);
    }

    modal.classList.add('visible');
    document.body.style.overflow = 'hidden';

    modalCloseBtn.addEventListener('click', hideModal);
    form.addEventListener('submit', onSubmit);
    document.addEventListener('keydown', function (ev) {
        if (ev.key == 'Escape') {
            hideModal(ev);
        }
    });
}

function handleSubmit(form) {
    const fields = Array.from(form.elements);
    fields.filter(isFormField).forEach(function (field) {
        outputField(field);
        clearFormField(field);
    });
}

function isFormField(field) {
    return field.dataset.output != 'false';
}

function clearFormField(field) {
    field.value = '';
}

function outputField(field) {
    console.log(
        `%c${field.dataset.label}:%c ${field.value}`,
        'color: gray; font-style: italic',
        'color: black; font-weight: bold'
    );
}
