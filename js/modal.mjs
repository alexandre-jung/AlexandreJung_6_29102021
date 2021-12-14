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
        console.log(`%cPrénom:%c ${form['first-name'].value}`, 'color: gray; font-style: italic', 'color: black; font-weight: bold');
        console.log(`%cNom:%c ${form['last-name'].value}`, 'color: gray; font-style: italic', 'color: black; font-weight: bold');
        console.log(`%cEmail:%c ${form['email'].value}`, 'color: gray; font-style: italic', 'color: black; font-weight: bold');
        console.log(`%cMessage:%c\n${form['message'].value}`, 'color: gray; font-style: italic', 'color: black; font-weight: bold');
        form['first-name'].value = '';
        form['last-name'].value = '';
        form['email'].value = '';
        form['message'].value = '';
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
