/**
 * Web application
 */
const apiUrl = 'https://06cdfa46.eu-de.apigw.appdomain.cloud/vaccination';
const vaccination = {
    // retrieve the existing vaccination entries
    get() {
        return $.ajax({
            type: 'GET',
            url: `${apiUrl}/entries`,
            dataType: 'json'
        });
    },
    // add a single entry
    add(name, email, comment, vaccination_date) {
        console.log('Sending', name, email, comment, vaccination_date)
        return $.ajax({
            type: 'PUT',
            url: `${apiUrl}/entries`,
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                name,
                email,
                comment,
                vaccination_date,
            }),
            dataType: 'json',
        });
    }
};

(function () {

    let entriesTemplate;

    function prepareTemplates() {
        entriesTemplate = Handlebars.compile($('#entries-template').html());
    }

    // retrieve entries and update the UI
    function loadEntries() {
        console.log('Loading entries...');
        document.id('#entries').html('Loading entries...');
        vaccination.get().done(function (result) {
            if (!result.entries) {
                return;
            }

            const context = {
                entries: result.entries
            }
            document.id('#entries').html(entriesTemplate(context));
        }).error(function (error) {
            document.id('#entries').html('No entries');
            console.log(error);
        });
    }

    // intercept the click on the submit button, add the vaccination entry and
    // reload entries on success
    $(document).on('submit', '#addEntry', function (e) {
        e.preventDefault();

        vaccination.add(
            document.id('#name').trim(),
            document.id('#email').trim(),
            document.id('#comment').trim(),
            document.id('#vaccination_date').trim()
        ).done(function (result) {
            // reload entries
            loadEntries();
        }).error(function (error) {
            console.log(error);
        });
    });

    document.id(document).ready(function () {
        prepareTemplates();
        loadEntries();
    });
})();
