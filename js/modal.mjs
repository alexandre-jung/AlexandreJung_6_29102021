export function showModal() {
    const modal = document.querySelector('.contact-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const form = modal.querySelector('form');

    function hideModal() {
        modal.classList.remove('visible');
        document.body.style.overflowY = 'auto';
        modalCloseBtn.removeEventListener('click', hideModal);
        form.removeEventListener('submit', onSubmit);
        document.removeEventListener('keydown', hideModal);
    }

    function onSubmit(ev) {
        ev.preventDefault();
        if (handleSubmit(form)) {
            hideModal(ev);
        } else {
            console.log("Le formulaire n'a pas été correctement rempli");
        }
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
    const formInputs = Array.from(form.elements);
    const formFields = formInputs.filter(isFormField);
    if (formFields.every(fieldIsValid)) {
        formFields.forEach(function (field) {
            outputField(field);
            clearFormField(field);
        });
        return true;
    }
    return false;
}

function isFormField(field) {
    return field.dataset.output != 'false';
}

function clearFormField(field) {
    field.value = '';
}

function outputField(field) {
    console.log(
        `%c${field.dataset.label}:%c ${field.value.trim()}`,
        'color: gray; font-style: italic',
        'color: black; font-weight: bold'
    );
}

const Regex = {
    text: /^[a-zA-Z]{2,}(?:-[a-zA-Z]{2,})?$/,
    email: /^[a-z0-9]+([+._-][a-z0-9]+)*@[a-z0-9]+(-[a-z]+)*(\.[a-z]{2,})+$/,
};

const Validator = {
    textarea: field => field.value.trim() != '',
    input: field => field.type in Regex && Regex[field.type].test(field.value.trim()),
};

function fieldIsValid(field) {
    const tagName = field.tagName.toLowerCase();
    const validate = Validator[tagName];
    return validate(field);
}
