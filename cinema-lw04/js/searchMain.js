
'use strict'

// Fetch all the forms we want to apply custom Bootstrap validation styles to
const forms = document.querySelectorAll('.needs-validation');


// Loop over them and prevent submission
for (let i = 0; i < forms.length; i++) {
    const form = forms[i];
    form.addEventListener('submit', function(event) {
        if (!form.checkValidity()) {
            console.info('start check validation main');
            event.preventDefault();
            event.stopPropagation();
        }
        
        form.classList.add('was-validated');
    }, false);
}
